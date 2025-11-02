import { NextResponse, type NextRequest } from "next/server"
import connectDB from "@/lib/mongodb"
import Product from "@/lib/models/Product"
import { requireAdmin } from "@/lib/auth-helpers"

// GET /api/products - Get all products with filters
export async function GET(request: Request) {
  try {
    // Connect DB - có cache connection nên nhanh
    await connectDB()

    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const featured = searchParams.get("featured")
    const search = searchParams.get("search")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "50")
    const skip = (page - 1) * limit

    // Build query
    const query: any = {}

    // Filter by category
    if (category && category !== "all") {
      query.category = category
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

    // Search by name or description - tối ưu với text index nếu có
    if (search) {
      // Ưu tiên text search nếu có index
      const searchRegex = { $regex: search, $options: "i" }
      query.$or = [
        { name: searchRegex },
        { nameEn: searchRegex },
        { description: searchRegex },
        { descriptionEn: searchRegex },
      ]
    }

    // Tối ưu sort để sử dụng indexes tốt nhất
    // Nếu có category filter, sort theo category + featured để dùng compound index
    const sortOrder: any = category && category !== "all"
      ? { category: 1, featured: -1, createdAt: -1 } // Dùng compound index
      : { featured: -1, createdAt: -1 } // Sort mặc định

    // Execute query with pagination - chỉ select fields cần thiết để tối ưu
    const [products, total] = await Promise.all([
      Product.find(query)
        .select("name nameEn description descriptionEn image category price variants featured available spicyLevel tags")
        .sort(sortOrder)
        .skip(skip)
        .limit(limit)
        .lean(),
      Product.countDocuments(query),
    ])

    const productsWithId = products.map((product: any) => ({
      ...product,
      id: product._id.toString(),
      categoryId: product.category,
    }))

    // Cache products API - shorter cache vì có thể thay đổi thường xuyên hơn categories
    // Cache 5 phút, stale-while-revalidate 1 giờ
    return NextResponse.json(
      {
        success: true,
        data: productsWithId,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      },
      {
        headers: {
          "Cache-Control": search
            ? "public, s-maxage=60, stale-while-revalidate=300" // Shorter cache for search results
            : "public, s-maxage=300, stale-while-revalidate=3600", // 5 min cache, 1h stale
        },
      },
    )
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

    console.log("[v0] Creating product with data:", {
      name: body.name,
      hasPrice: !!body.price,
      priceValue: body.price,
      hasVariants: !!(body.variants && body.variants.length > 0),
      variantsCount: body.variants?.length || 0
    })

    // Validate required fields
    const requiredFields = ["name", "nameEn", "description", "descriptionEn", "image", "category"]
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ success: false, error: `Missing required field: ${field}` }, { status: 400 })
      }
    }

    // Validate price - allow 0 for market price products
    // Product can have: base price (including 0), variants with prices (including 0), or both
    const hasBasePrice = body.price !== undefined && body.price !== null
    const hasVariants = body.variants && body.variants.length > 0
    
    if (!hasBasePrice && !hasVariants) {
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

    // Prepare product data - only include price if it exists
    const productData: any = {
      name: body.name,
      nameEn: body.nameEn,
      description: body.description,
      descriptionEn: body.descriptionEn,
      image: body.image,
      category: body.category,
      featured: body.featured || false,
      available: body.available !== undefined ? body.available : true,
      spicyLevel: body.spicyLevel || 0,
      tags: body.tags || [],
      preparationTime: body.preparationTime,
    }

    // Only add price if it exists (including 0 for market price)
    if (body.price !== undefined && body.price !== null) {
      productData.price = body.price
    }

    // Only add variants if they exist
    if (body.variants && body.variants.length > 0) {
      productData.variants = body.variants
    }

    // Create product
    const product = await Product.create(productData)

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
