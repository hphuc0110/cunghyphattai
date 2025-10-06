import { NextResponse, type NextRequest } from "next/server"
import connectDB from "@/lib/mongodb"
import Product from "@/lib/models/Product"
import { requireAdmin } from "@/lib/auth-helpers"

// GET /api/products - Get all products with filters
export async function GET(request: Request) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const featured = searchParams.get("featured")
    const search = searchParams.get("search")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "50")
    const skip = (page - 1) * limit

    console.log("[v0] API Products - category param:", category)

    // Build query
    const query: any = {}

    // Filter by category
    if (category && category !== "all") {
      query.category = category
      console.log("[v0] API Products - filtering by category:", category)
    }

    // Filter by featured
    if (featured === "true") {
      query.featured = true
    }

    // Filter by availability (default: only available products)
    const showUnavailable = searchParams.get("showUnavailable")
    if (showUnavailable !== "true") {
      query.available = true
    }

    // Search by name or description
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { nameEn: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { descriptionEn: { $regex: search, $options: "i" } },
      ]
    }

    const allProducts = await Product.find({}).select("name category").limit(10).lean()
    console.log(
      "[v0] API Products - ALL products in DB (first 10):",
      allProducts.map((p: any) => ({ name: p.name, category: p.category })),
    )
    console.log("[v0] API Products - Query being used:", JSON.stringify(query))

    // Execute query with pagination
    const [products, total] = await Promise.all([
      Product.find(query).sort({ featured: -1, createdAt: -1 }).skip(skip).limit(limit).lean(),
      Product.countDocuments(query),
    ])

    console.log("[v0] API Products - found products:", products.length)
    if (products.length > 0) {
      console.log(
        "[v0] API Products - sample matched products:",
        products.slice(0, 3).map((p: any) => ({ name: p.name, category: p.category })),
      )
    }

    const productsWithId = products.map((product: any) => ({
      ...product,
      id: product._id.toString(),
      categoryId: product.category,
    }))

    return NextResponse.json({
      success: true,
      data: productsWithId,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error) {
    console.error("[v0] Error fetching products:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch products" }, { status: 500 })
  }
}

// POST /api/products - Create new product (Admin only)
export async function POST(request: NextRequest) {
  try {
    await requireAdmin(request)

    await connectDB()

    const body = await request.json()

    // Validate required fields
    const requiredFields = ["name", "nameEn", "description", "descriptionEn", "price", "image", "category"]
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ success: false, error: `Missing required field: ${field}` }, { status: 400 })
      }
    }

    // Create product
    const product = await Product.create({
      name: body.name,
      nameEn: body.nameEn,
      description: body.description,
      descriptionEn: body.descriptionEn,
      price: body.price,
      image: body.image,
      category: body.category,
      featured: body.featured || false,
      available: body.available !== undefined ? body.available : true,
      spicyLevel: body.spicyLevel || 0,
      tags: body.tags || [],
      preparationTime: body.preparationTime,
    })

    const productObj = product.toObject()

    return NextResponse.json(
      {
        success: true,
        data: {
          ...productObj,
          id: productObj._id.toString(),
          categoryId: productObj.category,
        },
        message: "Product created successfully",
      },
      { status: 201 },
    )
  } catch (error: any) {
    console.error("[v0] Error creating product:", error)

    if (error.message === "Authentication required" || error.message === "Admin access required") {
      return NextResponse.json({ success: false, error: error.message }, { status: 401 })
    }

    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to create product",
      },
      { status: 500 },
    )
  }
}
