import { Schema, model, models } from "mongoose"

const ProductVariantSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  available: {
    type: Boolean,
    default: true,
  },
})

const ProductSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    nameEn: {
      type: String,
      required: [true, "English name is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    descriptionEn: {
      type: String,
      required: [true, "English description is required"],
    },
    price: {
      type: Number,
      min: [0, "Price must be positive"],
    },
    variants: {
      type: [ProductVariantSchema],
      default: [],
    },
    image: {
      type: String,
      required: [true, "Image is required"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      index: true,
    },
    featured: {
      type: Boolean,
      default: false,
      index: true,
    },
    available: {
      type: Boolean,
      default: true,
      index: true,
    },
    spicyLevel: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    tags: {
      type: [String],
      default: [],
      index: true,
    },
    preparationTime: {
      type: Number,
      min: 0,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  },
)

// Create indexes for better query performance
ProductSchema.index({ name: "text", nameEn: "text", description: "text" })
ProductSchema.index({ category: 1, featured: -1 })

// Prevent model recompilation in development
const Product = models.Product || model("Product", ProductSchema)

export default Product
