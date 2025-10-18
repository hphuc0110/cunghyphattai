import { Schema, model, models } from "mongoose"

const AddressSchema = new Schema({
  label: {
    type: String,
    required: true,
    trim: true,
  },
  street: {
    type: String,
    required: true,
  },
  district: {
    type: String,
  },
  city: {
    type: String,
    required: true,
  },
  isDefault: {
    type: Boolean,
    default: false,
  },
})

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      select: false, // Don't return password by default
    },
    phone: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      enum: ["customer", "admin", "staff"],
      default: "customer",
      index: true,
    },
    addresses: {
      type: [AddressSchema],
      default: [],
    },
    orders: {
      type: [Schema.Types.ObjectId],
      ref: "Order",
      default: [],
    },
  },
  {
    timestamps: true,
  },
)

// Index for authentication
UserSchema.index({ email: 1 })

const User = models.User || model("User", UserSchema)

export default User
