"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Filter, ArrowRight } from "lucide-react"
import type { Product, Category } from "@/lib/types"
import { categories as staticCategories } from "@/lib/data"
import { useSearchParams } from "next/navigation"

export default function MenuPage() {
  const searchParams = useSearchParams()
  const categoryParam = searchParams.get("category")

  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryParam || "all")
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        const categoriesRes = await fetch("/api/categories")
        const categoriesData = await categoriesRes.json()
        if (categoriesData.success) setCategories(categoriesData.data)

        const params = new URLSearchParams()
        if (selectedCategory !== "all") params.append("category", selectedCategory)
        if (searchQuery) params.append("search", searchQuery)

        const productsRes = await fetch(`/api/products?${params.toString()}`)
        const productsData = await productsRes.json()
        if (productsData.success) setProducts(productsData.data)
      } catch (error) {
        console.error("Failed to fetch data:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [selectedCategory, searchQuery])

  useEffect(() => {
    if (categoryParam) setSelectedCategory(categoryParam)
  }, [categoryParam])

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-white via-[#fafafa] to-[#f3f3f3]">
      <Header />

      <main className="flex-1">
        {/* Header Title */}
        <section className="border-b bg-gradient-to-r from-primary/5 to-transparent py-8 md:py-10">
          <div className="container px-4 md:px-6 text-center">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-primary">
              Thực Đơn Nhà Hàng
            </h1>
            <p className="mt-2 text-sm md:text-base text-muted-foreground">
              Khám phá những món ăn hấp dẫn được chọn lọc kỹ lưỡng
            </p>
          </div>
        </section>

        {/* Search + Products */}
        <div className="container py-6 md:py-10 px-4 md:px-6">
          <div className="flex flex-col gap-8">
            {/* Search + Filter */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <label className="block mb-2 text-sm font-semibold text-gray-700">Tìm kiếm món ăn</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Nhập tên món..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 h-11 rounded-lg"
                    />
                  </div>
                </div>

                <div className="sm:w-64">
                  <label className="block mb-2 text-sm font-semibold text-gray-700">Danh mục</label>
                  <div className="relative">
                    <Filter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full h-11 pl-9 pr-4 bg-background border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    >
                      <option value="all">Tất cả món</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Product list */}
            <section className="flex-1 min-w-0">
              {loading ? (
                <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                  {[...Array(10)].map((_, i) => (
                    <div key={i} className="h-80 animate-pulse rounded-xl bg-gray-200" />
                  ))}
                </div>
              ) : products.length === 0 ? (
                <div className="flex flex-col items-center justify-center min-h-[400px] text-center bg-white rounded-2xl shadow-sm border">
                  <div className="text-6xl mb-4">🍽️</div>
                  <h3 className="text-xl font-semibold mb-2">Không tìm thấy món ăn nào</h3>
                  <p className="text-muted-foreground mb-6 max-w-md">
                    Hãy thử thay đổi từ khóa tìm kiếm hoặc chọn danh mục khác
                  </p>
                  <Button
                    variant="outline"
                    className="h-11 px-6"
                    onClick={() => {
                      setSelectedCategory("all")
                      setSearchQuery("")
                    }}
                  >
                    Xóa bộ lọc
                  </Button>
                </div>
              ) : (
                <>
                  <div className="mb-6 flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      Hiển thị <span className="font-semibold text-primary">{products.length}</span> món ăn
                    </div>
                    {selectedCategory !== "all" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedCategory("all")}
                        className="text-primary hover:text-primary/80"
                      >
                        Xem tất cả
                      </Button>
                    )}
                  </div>
                  <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
                    {products.map((product) => (
                      <div key={product.id} className="transition-all duration-300 hover:-translate-y-2 hover:shadow-lg">
                        <ProductCard product={product} />
                      </div>
                    ))}
                  </div>
                </>
              )}
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
