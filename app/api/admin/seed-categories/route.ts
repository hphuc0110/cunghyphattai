import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth-helpers"
import { connectDB } from "@/lib/mongodb"
import Category from "@/lib/models/Category"
import Product from "@/lib/models/Product"

const NEW_CATEGORIES = [
  {
    name: "CƠM, MÌ, MIẾN, PHỞ",
    nameEn: "Rice & Noodles",
    description: "Các món cơm, mì, miến, phở truyền thống và hiện đại",
    image: "/images/categories/category-3.webp",
    order: 1,
  },
  {
    name: "Đồ khác (combo)",
    nameEn: "Combo Sets",
    description: "Các phần ăn combo tiện lợi, đa dạng lựa chọn",
    image: "/images/categories/category-10.webp",
    order: 2,
  },
  {
    name: "Đồ khác CCDC",
    nameEn: "Other CCDC",
    description: "Các món đặc biệt và đa dạng theo thực đơn CCDC",
    image: "/images/categories/category-7.webp",
    order: 3,
  },
  {
    name: "Đồ uống mua",
    nameEn: "Beverages Purchase",
    description: "Nước ngọt, trà, cà phê và các loại đồ uống đóng chai",
    image: "/images/categories/category-11.webp",
    order: 4,
  },
  {
    name: "MÓN CHIÊN",
    nameEn: "Fried Dishes",
    description: "Các món chiên giòn rụm, vàng ươm hấp dẫn",
    image: "/images/categories/category-8.webp",
    order: 5,
  },
  {
    name: "MÓN CHIÊN - DIMSUM",
    nameEn: "Fried Dimsum",
    description: "Dimsum chiên phong cách Á Đông, đa dạng hương vị",
    image: "/images/categories/category-12.webp",
    order: 6,
  },
  {
    name: "MÓN HẦM",
    nameEn: "Braised Dishes",
    description: "Các món hầm mềm ngon, bổ dưỡng và đậm đà",
    image: "/images/categories/category-4.webp",
    order: 7,
  },
  {
    name: "MÓN HẤP",
    nameEn: "Steamed Dishes",
    description: "Các món hấp giữ trọn vị ngọt và dinh dưỡng",
    image: "/images/categories/category-5.webp",
    order: 8,
  },
  {
    name: "MÓN THEO MÙA",
    nameEn: "Seasonal Dishes",
    description: "Thực đơn đặc biệt theo mùa, tươi ngon và đa dạng",
    image: "/images/categories/category-6.webp",
    order: 9,
  },
  {
    name: "MÓN TRÁNG MIỆNG",
    nameEn: "Desserts",
    description: "Chè, trái cây, bánh ngọt và các món tráng miệng",
    image: "/images/categories/category-9.webp",
    order: 10,
  },
  {
    name: "MÓN XÀO",
    nameEn: "Stir-Fried Dishes",
    description: "Các món xào thơm ngon, đậm vị với rau củ và thịt",
    image: "/images/categories/category-2.webp",
    order: 11,
  },
  {
    name: "PHA CHẾ",
    nameEn: "Mixed Drinks",
    description: "Nước pha chế độc đáo: mocktail, cocktail, trà sữa,…",
    image: "/images/categories/category-13.webp",
    order: 12,
  },
  {
    name: "SÚP CANH TẦN",
    nameEn: "Soups",
    description: "Súp, canh tần bổ dưỡng, thơm ngon, tốt cho sức khỏe",
    image: "/images/categories/category-1.webp",
    order: 13,
  },
]

export async function POST(request: Request) {
  try {
    // Require admin authentication
    const authResult = await requireAdmin(request)
    if (authResult instanceof NextResponse) {
      return authResult
    }

    await connectDB()

    await Category.deleteMany({})
    console.log("[v0] Deleted all existing categories")

    const categories = await Category.insertMany(NEW_CATEGORIES)
    console.log(`[v0] Created ${categories.length} new categories`)

    const products = await Product.find({}).lean()
    console.log(`[v0] Found ${products.length} products to migrate`)

    if (products.length > 0) {
      // Create category name to ID mapping
      const categoryMap = new Map<string, string>()
      for (const cat of categories) {
        categoryMap.set(cat.name.toLowerCase(), cat._id.toString())
        if (cat.nameEn) {
          categoryMap.set(cat.nameEn.toLowerCase(), cat._id.toString())
        }
      }

      let migrated = 0
      const errors: string[] = []

      // Update each product
      for (const product of products) {
        try {
          const currentCategory = product.category
          let newCategoryId: string | undefined

          // Try exact match
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
            console.log(`[v0] Migrated "${product.name}" to category ID: ${newCategoryId}`)
            migrated++
          } else {
            errors.push(`Could not find category for product "${product.name}"`)
          }
        } catch (error: any) {
          errors.push(`Error migrating "${product.name}": ${error.message}`)
        }
      }

      console.log(`[v0] Migration complete: ${migrated}/${products.length} products updated`)

      return NextResponse.json({
        success: true,
        message: `Created ${categories.length} categories and migrated ${migrated}/${products.length} products`,
        categories: categories.map((cat: any) => ({
          id: cat._id.toString(),
          name: cat.name,
          nameEn: cat.nameEn,
          slug: cat.slug,
          description: cat.description,
          image: cat.image,
          order: cat.order,
        })),
        migration: {
          total: products.length,
          migrated,
          errors: errors.length > 0 ? errors : undefined,
        },
      })
    }

    return NextResponse.json({
      success: true,
      message: `Created ${categories.length} new categories`,
      categories: categories.map((cat: any) => ({
        id: cat._id.toString(),
        name: cat.name,
        nameEn: cat.nameEn,
        slug: cat.slug,
        description: cat.description,
        image: cat.image,
        order: cat.order,
      })),
    })
  } catch (error: any) {
    console.error("[v0] Error seeding categories:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
