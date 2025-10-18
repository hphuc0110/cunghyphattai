import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Product from "@/lib/models/Product"
import Category from "@/lib/models/Category"
import { products, categories } from "@/lib/data"

export async function POST() {
  try {
    console.log("[v0] Connecting to MongoDB...")
    await connectDB()

    console.log("[v0] Clearing existing data...")
    await Product.deleteMany({})
    await Category.deleteMany({})

    console.log("[v0] Seeding categories...")
    const categoryDocs = await Category.insertMany(
      categories.map((cat) => ({
        name: cat.name,
        nameEn: cat.nameEn,
        description: cat.description,
        image: cat.image,
        order: cat.order,
      })),
    )

    console.log("[v0] Seeding products...")
    const productDocs = await Product.insertMany(
      products.map((prod) => ({
        name: prod.name,
        nameEn: prod.nameEn,
        description: prod.description,
        descriptionEn: prod.descriptionEn,
        price: prod.price,
        image: prod.image,
        category: prod.category,
        featured: prod.featured,
        available: prod.available,
        spicyLevel: prod.spicyLevel || 0,
        tags: prod.tags,
      })),
    )

    return NextResponse.json({
      success: true,
      message: "Database seeded successfully!",
      data: {
        categories: categoryDocs.length,
        products: productDocs.length,
      },
    })
  } catch (error: any) {
    console.error("[v0] Error seeding database:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to seed database",
        error: error.message,
      },
      { status: 500 },
    )
  }
}
