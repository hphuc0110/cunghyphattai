import crypto from "crypto";
import { headers } from "next/headers";
import qs from "querystring";

const FIVE_MINUTES_MS = 5 * 60 * 1000;

function requireEnv(name: string): string {
	const value = process.env[name];
	if (!value) {
		throw new Error(`Missing required env: ${name}`);
	}
	return value;
}

export function getPaymentConfig() {
	return {
		appId: requireEnv("PAY_APP_ID"),
		macKey: requireEnv("PAY_MAC_KEY"),
		callbackKey: requireEnv("PAY_CALLBACK_KEY"),
		providerBaseUrl: requireEnv("PAY_PROVIDER_BASE_URL"),
		appBaseUrl: requireEnv("APP_BASE_URL"),
	};
}

export function generateNonce(length = 24): string {
	return crypto.randomBytes(length).toString("hex");
}

export function getTimestampMs(): number {
	return Date.now();
}

export function buildMac(data: Record<string, unknown>, secret: string): string {
	// Deterministic canonical string: sort keys and JSON stringify values
	const keys = Object.keys(data).sort();
	const canonical = keys
		.map((k) => `${k}=${JSON.stringify(data[k])}`)
		.join("&");
	return crypto.createHmac("sha256", secret).update(canonical).digest("hex");
}

export function verifyMac(
	data: Record<string, unknown>,
	providedMac: string,
	secret: string
): boolean {
	const expected = buildMac(data, secret);
	// timing-safe compare
	const a = Buffer.from(expected, "utf8");
	const b = Buffer.from(providedMac || "", "utf8");
	return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export function isRecentTimestamp(timestampMs: number, windowMs = FIVE_MINUTES_MS): boolean {
	const now = Date.now();
	return Math.abs(now - timestampMs) <= windowMs;
}

export function assertHttpsOrThrow() {
	const h = headers();
	const proto = h.get("x-forwarded-proto") || h.get("x-forwarded-protocol") || "";
    // Only enforce when header explicitly indicates HTTP; allow missing header
    const lower = proto.toLowerCase();
    if (lower && lower !== "https") {
        if (process.env.NODE_ENV === "production") {
            throw new Error("HTTPS is required");
        }
    }
}

export type SignedCreatePayload = {
	app_id: number;
	app_trans_id: string;
	app_user: string;
	app_time: number;
	amount: number;
	embed_data: string; // JSON string
	item: string; // JSON string
	description: string;
	bank_code?: string;
	callback_url: string;
	mac: string;
};

// ZaloPay: app_trans_id must be unique per day. Format: yymmdd_random
function generateAppTransId(orderId: string): string {
	const now = new Date();
	const y = String(now.getFullYear()).slice(-2);
	const m = String(now.getMonth() + 1).padStart(2, "0");
	const d = String(now.getDate()).padStart(2, "0");
	const suffix = (orderId || generateNonce(6)).toString().slice(-6);
	return `${y}${m}${d}_${suffix}`;
}

function buildZaloCreateMac(params: {
	app_id: number;
	app_trans_id: string;
	app_user: string;
	amount: number;
	app_time: number;
	embed_data: string;
	item: string;
}, key1: string): string {
	const data = [
		params.app_id,
		params.app_trans_id,
		params.app_user,
		params.amount,
		params.app_time,
		params.embed_data,
		params.item,
	].join("|");
	return crypto.createHmac("sha256", key1).update(data).digest("hex");
}

export function signCreateRequest(input: {
	orderId: string;
	amount: number;
	appUser: string;
	description?: string;
	items?: Array<Record<string, unknown>>;
	embedData?: Record<string, unknown>;
}): SignedCreatePayload {
	const cfg = getPaymentConfig();
	const app_time = getTimestampMs();
	const app_trans_id = generateAppTransId(input.orderId);
	const itemArr = input.items || [];
	const embedObj = input.embedData || {};
	const item = JSON.stringify(itemArr);
	const embed_data = JSON.stringify(embedObj);
	const base = {
		app_id: Number(cfg.appId),
		app_trans_id,
		app_user: input.appUser,
		app_time,
		amount: Math.round(input.amount),
		embed_data,
		item,
		description: input.description || `Thanh toan don hang ${input.orderId}`,
		callback_url: new URL("/api/payments/callback", cfg.appBaseUrl).toString(),
	};
	const mac = buildZaloCreateMac(base, cfg.macKey);
	return { ...base, mac };
}

// ZaloPay callback uses fields: data (string) and mac (hex). Verify with key2
export function verifyZaloCallback(payload: { data?: string; mac?: string }) {
	const { callbackKey } = getPaymentConfig();
	if (!payload?.data || !payload?.mac) return { valid: false } as const;
	const expectedMac = crypto.createHmac("sha256", callbackKey).update(payload.data).digest("hex");
	const a = Buffer.from(expectedMac, "utf8");
	const b = Buffer.from(payload.mac, "utf8");
	const valid = a.length === b.length && crypto.timingSafeEqual(a, b);
	if (!valid) return { valid: false } as const;
	let dataObj: any = null;
	try {
		dataObj = JSON.parse(payload.data);
	} catch {}
	return { valid: true, data: dataObj } as const;
}

export async function createZaloPayOrder(params: SignedCreatePayload) {
	let { providerBaseUrl } = getPaymentConfig();
	try {
		const u = new URL(providerBaseUrl);
		// Normalize common sandbox host misconfigurations
		if (!u.hostname.includes("openapi") && u.hostname.includes("zalopay.vn")) {
			providerBaseUrl = "https://sb-openapi.zalopay.vn";
		}
	} catch {
		providerBaseUrl = "https://sb-openapi.zalopay.vn";
	}
	const url = new URL("/v2/create", providerBaseUrl).toString();
	const body = qs.stringify({
		...params,
		// Ensure correct field names
	});
	const res = await fetch(url, {
		method: "POST",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
		body,
	});
	if (!res.ok) {
		throw new Error(`ZaloPay create failed: ${res.status}`);
	}
	return res.json();
}

// Build MAC for ZaloPay query (v2): HMAC-SHA256(app_id|app_trans_id|key1)
function buildZaloQueryMac(appId: number, appTransId: string, key1: string): string {
    const data = [appId, appTransId, key1].join("|");
    return crypto.createHmac("sha256", key1).update(data).digest("hex");
}

export async function queryZaloPayOrder(appTransId: string) {
    let { providerBaseUrl, appId, macKey } = getPaymentConfig();
    try {
        const u = new URL(providerBaseUrl);
        if (!u.hostname.includes("openapi") && u.hostname.includes("zalopay.vn")) {
            providerBaseUrl = "https://sb-openapi.zalopay.vn";
        }
    } catch {
        providerBaseUrl = "https://sb-openapi.zalopay.vn";
    }
    const url = new URL("/v2/query", providerBaseUrl).toString();
    const body = qs.stringify({
        app_id: Number(appId),
        app_trans_id: appTransId,
        mac: buildZaloQueryMac(Number(appId), appTransId, macKey),
    });
    const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body,
    });
    if (!res.ok) {
        throw new Error(`ZaloPay query failed: ${res.status}`);
    }
    return res.json();
}


