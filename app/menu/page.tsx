"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Filter } from "lucide-react"
import type { Product, Category } from "@/lib/types"
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

        {/* Content */}
        <div className="container py-6 md:py-10 px-4 md:px-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar */}
            <aside className="lg:w-64 lg:shrink-0 space-y-6">
              {/* Search */}
              <div className="bg-white p-4 rounded-xl shadow-sm border">
                <label className="block mb-2 text-sm font-semibold text-gray-700">
                  Tìm kiếm món ăn
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Nhập tên món..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 h-10 rounded-lg"
                  />
                </div>
              </div>

              {/* Categories */}
              <div className="bg-white p-4 rounded-xl shadow-sm border">
                <div className="mb-3 flex items-center gap-2">
                  <Filter className="h-4 w-4 text-primary" />
                  <h2 className="text-sm font-semibold text-gray-700">Danh mục món</h2>
                </div>

                {/* Responsive scroll area */}
                <div
                  className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:space-y-2 lg:overflow-y-auto 
                             [-ms-overflow-style:none] [scrollbar-width:thin] 
                             [&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-thumb]:rounded-full"
                >
                  <Button
                    variant={selectedCategory === "all" ? "default" : "outline"}
                    className={`shrink-0 rounded-full px-4 h-9 text-sm font-medium transition-all ${
                      selectedCategory === "all"
                        ? "bg-primary text-white"
                        : "bg-gray-50 hover:bg-gray-100"
                    } lg:w-full lg:justify-start lg:rounded-md lg:h-10`}
                    onClick={() => setSelectedCategory("all")}
                  >
                    Tất cả món
                  </Button>

                  {categories.map((category) => (
                    <Button
                      key={category.id}
                      variant={selectedCategory === category.id ? "default" : "outline"}
                      className={`shrink-0 rounded-full px-4 h-9 text-sm font-medium transition-all ${
                        selectedCategory === category.id
                          ? "bg-primary text-white"
                          : "bg-gray-50 hover:bg-gray-100"
                      } lg:w-full lg:justify-start lg:rounded-md lg:h-10`}
                      onClick={() => setSelectedCategory(category.id)}
                    >
                      {category.name}
                    </Button>
                  ))}
                </div>
              </div>
            </aside>

            {/* Product List */}
            <section className="flex-1 min-w-0">
              {loading ? (
                <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="h-72 animate-pulse rounded-lg bg-gray-200" />
                  ))}
                </div>
              ) : products.length === 0 ? (
                <div className="flex flex-col items-center justify-center min-h-[300px] text-center">
                  <p className="text-muted-foreground text-base">
                    Không tìm thấy món ăn nào phù hợp
                  </p>
                  <Button
                    variant="outline"
                    className="mt-4 h-10"
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
                  <div className="mb-4 text-sm text-muted-foreground">
                    Tìm thấy{" "}
                    <span className="font-semibold text-primary">{products.length}</span> món ăn
                  </div>
                  <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
                    {products.map((product) => (
                      <div key={product.id} className="transition-transform hover:-translate-y-1">
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
