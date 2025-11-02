import connectDB from "@/lib/mongodb"
import Product from "@/lib/models/Product"
import Category from "@/lib/models/Category"

export interface MenuFilters {
  category?: string
  search?: string
  featured?: boolean
  limit?: number
}

/**
 * Fetch products directly from database (for SSR)
 */
export async function getProducts(filters: MenuFilters = {}) {
  try {
    await connectDB()

    const { category, search, featured, limit = 50 } = filters

    // Build query
    const query: any = {
      available: true, // Only available products
    }

    // Filter by category
    if (category && category !== "all") {
      query.category = category
    }

    // Filter by featured
    if (featured === true) {
      query.featured = true
    }

    // Search by name or description
    if (search) {
      const searchRegex = { $regex: search, $options: "i" }
      query.$or = [
        { name: searchRegex },
        { nameEn: searchRegex },
        { description: searchRegex },
        { descriptionEn: searchRegex },
      ]
    }

    // Tối ưu sort để sử dụng indexes tốt nhất
    const sortOrder: any = category && category !== "all"
      ? { category: 1, featured: -1, createdAt: -1 } // Dùng compound index
      : { featured: -1, createdAt: -1 } // Sort mặc định

    // Execute query - chỉ select fields cần thiết
    const products = await Product.find(query)
      .select("name nameEn description descriptionEn image category price variants featured available spicyLevel tags")
      .sort(sortOrder)
      .limit(limit)
      .lean()

    // Transform products
    const productsWithId = products.map((product: any) => ({
      ...product,
      id: product._id.toString(),
      categoryId: product.category,
    }))

    return productsWithId
  } catch (error) {
    console.error("[Menu] Error fetching products:", error)
    return []
  }
}

/**
 * Fetch categories directly from database (for SSR)
 */
export async function getCategories() {
  try {
    await connectDB()

    const categories = await Category.find({})
      .sort({ order: 1 })
      .lean()

    const categoriesWithId = categories.map((category: any) => ({
      ...category,
      id: category._id.toString(),
    }))

    return categoriesWithId
  } catch (error) {
    console.error("[Menu] Error fetching categories:", error)
    return []
  }
}

