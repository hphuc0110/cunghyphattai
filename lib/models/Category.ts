import { Schema, model, models } from "mongoose"

const CategorySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
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
    image: {
      type: String,
      required: [true, "Image is required"],
    },
    order: {
      type: Number,
      required: [true, "Order is required"],
      unique: true,
    },
  },
  {
    timestamps: true,
  },
)

// Unique index on `order` is already defined by the schema field

const Category = models.Category || model("Category", CategorySchema)

export default Category
