import { NextResponse, type NextRequest } from "next/server"
import connectDB from "@/lib/mongodb"
import Product from "@/lib/models/Product"
import { isValidObjectId } from "mongoose"
import { requireAdmin } from "@/lib/auth-helpers"
import { del } from "@vercel/blob"

// GET /api/products/[id] - Get single product
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    // Validate MongoDB ObjectId
    if (!isValidObjectId(params.id)) {
      return NextResponse.json({ success: false, error: "Invalid product ID" }, { status: 400 })
    }

    const product = await Product.findById(params.id).lean()

    if (!product) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: {
        ...product,
        id: product._id.toString(),
        categoryId: product.category,
      },
    })
  } catch (error) {
    console.error("[v0] Error fetching product:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch product" }, { status: 500 })
  }
}

// PATCH /api/products/[id] - Update product (Admin only)
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAdmin(request)

    await connectDB()

    // Validate MongoDB ObjectId
    if (!isValidObjectId(params.id)) {
      return NextResponse.json({ success: false, error: "Invalid product ID" }, { status: 400 })
    }

    const body = await request.json()

    console.log("[v0] Updating product with data:", {
      id: params.id,
      hasPrice: !!body.price,
      priceValue: body.price,
      hasVariants: !!(body.variants && body.variants.length > 0),
      variantsCount: body.variants?.length || 0
    })

    // Validate price - allow 0 for market price products
    // Product can have: base price (including 0), variants with prices (including 0), or both
    const hasBasePrice = body.price !== undefined && body.price !== null
    const hasVariants = body.variants && body.variants.length > 0
    
    if (body.price !== undefined && !hasBasePrice && !hasVariants) {
      return NextResponse.json({ success: false, error: "Product must have either a base price or variants" }, { status: 400 })
    }

    // If variants exist, validate they have price field (including 0 for market price)
    if (hasVariants) {
      for (const variant of body.variants) {
        if (variant.price === undefined || variant.price === null) {
          return NextResponse.json({ success: false, error: "All variants must have a price field (0 for market price)" }, { status: 400 })
        }
        if (variant.price < 0) {
          return NextResponse.json({ success: false, error: "Price cannot be negative" }, { status: 400 })
        }
      }
    }

    // Prepare update data - only include fields that are provided
    const updateData: any = {}
    
    // Only update price if it's provided
    if (body.price !== undefined) {
      updateData.price = body.price
    }

    // Only update variants if they're provided
    if (body.variants !== undefined) {
      updateData.variants = body.variants
    }

    // Add other fields
    const fieldsToUpdate = ['name', 'nameEn', 'description', 'descriptionEn', 'image', 'category', 'featured', 'available', 'spicyLevel', 'tags', 'preparationTime']
    for (const field of fieldsToUpdate) {
      if (body[field] !== undefined) {
        updateData[field] = body[field]
      }
    }

    // Update product
    const product = await Product.findByIdAndUpdate(
      params.id,
      {
        $set: updateData,
      },
      {
        new: true, // Return updated document
        runValidators: true, // Run schema validators
      },
    ).lean()

    if (!product) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: {
        ...product,
        id: product._id.toString(),
        categoryId: product.category,
      },
      message: "Product updated successfully",
    })
  } catch (error: any) {
    console.error("[v0] Error updating product:", error)

    if (error.message === "Authentication required" || error.message === "Admin access required") {
      return NextResponse.json({ success: false, error: error.message }, { status: 401 })
    }

    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to update product",
      },
      { status: 500 },
    )
  }
}

// DELETE /api/products/[id] - Delete product (Admin only)
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAdmin(request)

    await connectDB()

    console.log("[v0] DELETE request for product ID:", params.id)

    // Validate MongoDB ObjectId
    if (!isValidObjectId(params.id)) {
      console.log("[v0] Invalid ObjectId:", params.id)
      return NextResponse.json({ success: false, error: "Invalid product ID" }, { status: 400 })
    }

    const product = await Product.findByIdAndDelete(params.id)

    if (!product) {
      console.log("[v0] Product not found:", params.id)
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 })
    }

    if (product.image && product.image.includes("blob.vercel-storage.com")) {
      try {
        await del(product.image)
        console.log("[v0] Deleted image from Blob:", product.image)
      } catch (error) {
        console.error("[v0] Failed to delete image from Blob:", error)
        // Continue even if image deletion fails
      }
    }

    console.log("[v0] Product deleted successfully:", params.id)

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully",
    })
  } catch (error: any) {
    console.error("[v0] Error deleting product:", error)

    if (error.message === "Authentication required" || error.message === "Admin access required") {
      return NextResponse.json({ success: false, error: error.message }, { status: 401 })
    }

    return NextResponse.json({ success: false, error: "Failed to delete product" }, { status: 500 })
  }
}
