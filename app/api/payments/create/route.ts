import { NextRequest, NextResponse } from "next/server";
import { assertHttpsOrThrow, signCreateRequest, createZaloPayOrder, getPaymentConfig } from "@/lib/payments";
import connectDB from "@/lib/mongodb";
import Order from "@/lib/models/Order";
import { isValidObjectId } from "mongoose";

export async function POST(req: NextRequest) {
	try {
		assertHttpsOrThrow();
		const body = await req.json();
		const orderId: string = body?.orderId;
		const appUserInput: string | undefined = body?.appUser;
		if (!orderId) {
			return NextResponse.json({ error: "orderId is required" }, { status: 400 });
		}

		// Fetch order to build accurate payment payload
		await connectDB();
		const orderQuery = isValidObjectId(orderId) ? { $or: [{ orderId }, { _id: orderId }] } : { orderId };
		const order = await Order.findOne(orderQuery).lean();
		if (!order) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }
		const amount = Math.round(Number(order.total) || 0);
		if (amount <= 0) {
			return NextResponse.json({ error: "Invalid order total" }, { status: 400 });
		}

	    // Read config safely to avoid opaque 500s when env vars are missing
		let appBaseUrl: string;
		try {
			({ appBaseUrl } = getPaymentConfig());
		} catch (e: any) {
			console.error("[payments] missing env config", e?.message || e);
			return NextResponse.json({ error: e?.message || "Missing payment config" }, { status: 500 });
		}
	    const description = `Thanh toán đơn hàng ${orderId}`;
	    const embedData = {
	    	redirect_url: new URL(`/order-success?orderId=${orderId}&source=zalopay`, appBaseUrl).toString(),
	    	merchant_info: "web",
	    };
		const items = (order.items || []).map((it: any) => ({
			name: it?.productName || "",
			price: Math.round(Number(it?.productPrice) || 0),
			quantity: Math.max(1, Number(it?.quantity) || 1),
		}));
		const deliveryFeeLine = Math.round(Number(order.deliveryFee) || 0);
		if (deliveryFeeLine > 0) {
			items.push({ name: "Delivery fee", price: deliveryFeeLine, quantity: 1 });
		}
		const appUser = appUserInput || order.customerPhone || order.customerEmail || "guest";
		let signed: any;
		try {
			signed = signCreateRequest({
			orderId,
			amount,
			appUser,
			description,
			items,
			embedData,
		});
		} catch (e: any) {
			console.error("[payments] sign create request failed", e?.message || e);
			return NextResponse.json({ error: e?.message || "Failed to sign payment request" }, { status: 500 });
		}
    	let providerRes: any;
	    	try {
    		providerRes = await createZaloPayOrder(signed);
	    	} catch (e: any) {
	    		console.error("[payments] provider create failed", e?.message || e);
	    		return NextResponse.json({ error: e?.message || "ZaloPay create failed" }, { status: 502 });
    	}
    	if (!providerRes?.order_url) {
    		return NextResponse.json({ error: providerRes?.message || "Provider response invalid", raw: providerRes }, { status: 502 });
    	}

		// Store mapping app_trans_id -> order for callback reconciliation
	       try {
			await Order.updateOne(
				{ $or: [{ _id: orderId }, { orderId }] },
				{ $set: { zpAppTransId: signed.app_trans_id, paymentMethod: "zalopay", paymentStatus: "pending" } }
			);
		} catch {}

    	return NextResponse.json({ paymentUrl: providerRes.order_url, signed, token: providerRes.zp_trans_token });
	} catch (err: any) {
		return NextResponse.json({ error: err?.message || "Internal error" }, { status: 500 });
	}
}


