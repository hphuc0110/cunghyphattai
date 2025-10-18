// Script to seed initial data into MongoDB
import connectDB from "../lib/mongodb"
import Product from "../lib/models/Product"
import Category from "../lib/models/Category"
import { products, categories } from "../lib/data"

async function seedDatabase() {
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
    console.log(`[v0] Seeded ${categoryDocs.length} categories`)

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
        preparationTime: (prod as any).preparationTime,
      })),
    )
    console.log(`[v0] Seeded ${productDocs.length} products`)

    console.log("[v0] Database seeded successfully!")
    process.exit(0)
  } catch (error) {
    console.error("[v0] Error seeding database:", error)
    process.exit(1)
  }
}

seedDatabase()
