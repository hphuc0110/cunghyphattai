import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Category from "@/lib/models/Category"
import { requireAdmin } from "@/lib/auth-helpers"

// POST /api/admin/fix-category-orders - Fix duplicate order values
export async function POST(request: Request) {
  try {
    await requireAdmin(request)
    await connectDB()

    console.log("Starting category order fix...")

    // Get all categories sorted by creation date
    const categories = await Category.find({}).sort({ createdAt: 1 })
    console.log(`Found ${categories.length} categories`)

    // Reassign order values sequentially
    for (let i = 0; i < categories.length; i++) {
      const category = categories[i]
      const newOrder = i + 1
      
      if (category.order !== newOrder) {
        console.log(`Updating category "${category.name}" from order ${category.order} to ${newOrder}`)
        await Category.findByIdAndUpdate(category._id, { order: newOrder })
      }
    }

    console.log("Category orders fixed successfully!")
    
    // Verify no duplicates exist
    const duplicateCheck = await Category.aggregate([
      {
        $group: {
          _id: "$order",
          count: { $sum: 1 },
          categories: { $push: "$name" }
        }
      },
      {
        $match: {
          count: { $gt: 1 }
        }
      }
    ])

    if (duplicateCheck.length > 0) {
      console.log("Warning: Duplicate orders still exist:", duplicateCheck)
      return NextResponse.json({
        success: false,
        error: "Duplicate orders still exist",
        duplicates: duplicateCheck
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "Category orders fixed successfully",
      categoriesFixed: categories.length
    })
  } catch (error: any) {
    console.error("Error fixing category orders:", error)

    if (error.message === "Authentication required" || error.message === "Admin access required") {
      return NextResponse.json({ success: false, error: error.message }, { status: 401 })
    }

    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fix category orders",
      },
      { status: 500 },
    )
  }
}
