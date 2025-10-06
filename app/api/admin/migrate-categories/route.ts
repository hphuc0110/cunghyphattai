import { NextResponse, type NextRequest } from "next/server"
import connectDB from "@/lib/mongodb"
import Product from "@/lib/models/Product"
import Category from "@/lib/models/Category"
import { requireAdmin } from "@/lib/auth-helpers"

// POST /api/admin/migrate-categories - Update all products with new category IDs
export async function POST(request: NextRequest) {
  try {
    await requireAdmin(request)
    await connectDB()

    // Get all categories
    const categories = await Category.find({}).lean()
    console.log("[v0] Migration - Found categories:", categories.length)

    // Get all products
    const products = await Product.find({}).lean()
    console.log("[v0] Migration - Found products:", products.length)

    if (products.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No products to migrate",
        updated: 0,
      })
    }

    // Create a mapping of category names to IDs
    const categoryMap = new Map<string, string>()
    for (const cat of categories) {
      categoryMap.set(cat.name.toLowerCase(), cat._id.toString())
      if (cat.nameEn) {
        categoryMap.set(cat.nameEn.toLowerCase(), cat._id.toString())
      }
    }

    console.log("[v0] Migration - Category map:", Array.from(categoryMap.entries()))

    let updated = 0
    const errors: string[] = []

    // Update each product
    for (const product of products) {
      try {
        const currentCategory = product.category
        console.log(`[v0] Migration - Product "${product.name}" has category:`, currentCategory)

        // Check if category is already a valid ObjectId (24 hex chars)
        const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(currentCategory)

        if (isValidObjectId) {
          // Check if this ID exists in current categories
          const categoryExists = categories.some((cat) => cat._id.toString() === currentCategory)
          if (categoryExists) {
            console.log(`[v0] Migration - Product "${product.name}" already has valid category ID`)
            continue
          }
        }

        // Try to find matching category by name
        let newCategoryId: string | undefined

        // Try exact match first
        for (const [name, id] of categoryMap.entries()) {
          if (currentCategory.toLowerCase() === name) {
            newCategoryId = id
            break
          }
        }

        // Try partial match if no exact match
        if (!newCategoryId) {
          for (const [name, id] of categoryMap.entries()) {
            if (currentCategory.toLowerCase().includes(name) || name.includes(currentCategory.toLowerCase())) {
              newCategoryId = id
              break
            }
          }
        }

        if (newCategoryId) {
          await Product.updateOne({ _id: product._id }, { $set: { category: newCategoryId } })
          console.log(`[v0] Migration - Updated "${product.name}" from "${currentCategory}" to "${newCategoryId}"`)
          updated++
        } else {
          const error = `Could not find matching category for product "${product.name}" with category "${currentCategory}"`
          console.warn(`[v0] Migration - ${error}`)
          errors.push(error)
        }
      } catch (error: any) {
        const errorMsg = `Error updating product "${product.name}": ${error.message}`
        console.error(`[v0] Migration - ${errorMsg}`)
        errors.push(errorMsg)
      }
    }

    return NextResponse.json({
      success: true,
      message: `Migration completed. Updated ${updated} products.`,
      updated,
      total: products.length,
      errors: errors.length > 0 ? errors : undefined,
    })
  } catch (error: any) {
    console.error("[v0] Migration error:", error)

    if (error.message === "Authentication required" || error.message === "Admin access required") {
      return NextResponse.json({ success: false, error: error.message }, { status: 401 })
    }

    return NextResponse.json(
      {
        success: false,
        error: error.message || "Migration failed",
      },
      { status: 500 },
    )
  }
}
