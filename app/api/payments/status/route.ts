import { NextRequest, NextResponse } from "next/server";
import { assertHttpsOrThrow, queryZaloPayOrder } from "@/lib/payments";
import connectDB from "@/lib/mongodb";
import Order from "@/lib/models/Order";

export async function POST(req: NextRequest) {
    try {
        assertHttpsOrThrow();
        await connectDB();
        const body = await req.json().catch(() => ({}));
        const orderId: string | undefined = body?.orderId;
        if (!orderId) {
            return NextResponse.json({ error: "orderId is required" }, { status: 400 });
        }

        const order = await Order.findOne({ $or: [{ orderId }, { _id: orderId }] }).lean();
        if (!order) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }
        const appTransId: string | undefined = (order as any)?.zpAppTransId;
        if (!appTransId) {
            return NextResponse.json({ error: "No app_trans_id for this order" }, { status: 400 });
        }

        let providerRes: any;
        try {
            providerRes = await queryZaloPayOrder(appTransId);
        } catch (e: any) {
            return NextResponse.json({ error: e?.message || "Query failed" }, { status: 502 });
        }

        // ZaloPay success: return_code === 1
        const isPaid = Number(providerRes?.return_code) === 1;
        try {
            await Order.updateOne(
                { orderId: order.orderId },
                { $set: { paymentStatus: isPaid ? "paid" : "pending", ...(isPaid ? { status: "completed" } : {}) } }
            );
        } catch {}

        return NextResponse.json({ ok: true, isPaid, provider: providerRes });
    } catch (err: any) {
        return NextResponse.json({ error: err?.message || "Internal error" }, { status: 500 });
    }
}


