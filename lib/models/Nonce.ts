import mongoose, { Schema, model, models } from "mongoose";

export interface NonceDocument extends mongoose.Document {
	nonce: string;
	purpose: string;
	createdAt: Date;
}

const NonceSchema = new Schema<NonceDocument>(
	{
		nonce: { type: String, required: true, unique: true, index: true },
		purpose: { type: String, required: true },
	},
	{ timestamps: { createdAt: true, updatedAt: false } }
);

// TTL index: expire nonces after 10 minutes
NonceSchema.index({ createdAt: 1 }, { expireAfterSeconds: 600 });

export const Nonce = models.Nonce || model<NonceDocument>("Nonce", NonceSchema);


