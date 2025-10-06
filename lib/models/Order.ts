import { Schema, model, models } from "mongoose"

const OrderItemSchema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  // Snapshot of product data at time of order
  productName: {
    type: String,
    required: true,
  },
  productPrice: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  specialInstructions: {
    type: String,
  },
})

const OrderSchema = new Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    customerName: {
      type: String,
      required: [true, "Customer name is required"],
      trim: true,
    },
    customerPhone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
      index: true,
    },
    customerEmail: {
      type: String,
      trim: true,
      lowercase: true,
    },
    deliveryAddress: {
      type: String,
      required: [true, "Delivery address is required"],
    },
    items: {
      type: [OrderItemSchema],
      required: true,
      validate: {
        validator: (items: any[]) => items.length > 0,
        message: "Order must have at least one item",
      },
    },
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    deliveryFee: {
      type: Number,
      required: true,
      min: 0,
      default: 20000,
    },
    total: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "preparing", "ready", "delivering", "completed", "cancelled"],
      default: "pending",
      index: true,
    },
    paymentMethod: {
      type: String,
      enum: ["cash", "card", "online"],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
      index: true,
    },
    specialInstructions: {
      type: String,
    },
    estimatedDeliveryTime: {
      type: Date,
    },
    // Admin fields
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
)

// Indexes for common queries
OrderSchema.index({ status: 1, createdAt: -1 })
OrderSchema.index({ customerPhone: 1, createdAt: -1 })
OrderSchema.index({ orderId: 1 })

const Order = models.Order || model("Order", OrderSchema)

export default Order
