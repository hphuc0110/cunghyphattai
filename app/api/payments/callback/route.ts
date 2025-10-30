import { NextRequest, NextResponse } from "next/server";
import { assertHttpsOrThrow, verifyZaloCallback } from "@/lib/payments";
import connectDB from "@/lib/mongodb";
import { Nonce } from "@/lib/models/Nonce";
import Order from "@/lib/models/Order";

export async function POST(req: NextRequest) {
	try {
		assertHttpsOrThrow();
		await connectDB();
		const ct = (req.headers.get("content-type") || "").toLowerCase();
		let payload: any = null;
		try {
			if (ct.includes("application/json")) {
				payload = await req.json();
			} else if (ct.includes("application/x-www-form-urlencoded")) {
				const text = await req.text();
				const params = new URLSearchParams(text);
				payload = { data: params.get("data"), mac: params.get("mac") };
			} else {
				// Fallback: try JSON, then form
				payload = await req.json().catch(async () => {
					const text = await req.text();
					const params = new URLSearchParams(text);
					return { data: params.get("data"), mac: params.get("mac") };
				});
			}
		} catch {}

		console.log("[payments] callback received", {
			ct,
			hasData: Boolean(payload?.data),
			hasMac: Boolean(payload?.mac),
		});

		if (payload?.data === undefined || payload?.mac === undefined) {
			return NextResponse.json({ error: "Missing data/mac" }, { status: 400 });
		}

		const verification = verifyZaloCallback(payload);
		if (!verification.valid) {
			console.warn("[payments] invalid signature");
			return NextResponse.json({ return_code: 0, return_message: "invalid signature" });
		}

		const data = verification.data || {};
		const appTransId = data?.app_trans_id;
		if (!appTransId) {
			console.warn("[payments] missing app_trans_id in data");
			return NextResponse.json({ return_code: 0, return_message: "missing app_trans_id" });
		}

		// Replay protection: app_trans_id must be unique
		const nonceStr = String(appTransId);
		const existing = await Nonce.findOne({ nonce: nonceStr }).lean();
		if (existing) {
			console.log("[payments] replay detected for", appTransId);
			return NextResponse.json({ return_code: 1, return_message: "ok" });
		}

		await Nonce.create({ nonce: nonceStr, purpose: "payment_callback" });

		// Success: return_code === 1
		const isSuccess = Number(data?.return_code) === 1;
		try {
			await Order.updateOne(
				{ zpAppTransId: appTransId },
				{ $set: { paymentStatus: isSuccess ? "paid" : "failed", ...(isSuccess ? { status: "completed" } : {}) } }
			);
			console.log("[payments] order updated", { appTransId, isSuccess });
		} catch (e) {
			console.error("[payments] failed to update order", e);
		}

		// ZaloPay expects 200 with return_code
		return NextResponse.json({ return_code: 1, return_message: "success" });
	} catch (err: any) {
		console.error("[payments] callback error", err);
		return NextResponse.json({ return_code: 0, return_message: "internal error" });
	}
}


