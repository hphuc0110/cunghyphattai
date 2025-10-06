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
        console.log("[v0] Categories fetched:", categoriesData.data)
        if (categoriesData.success) {
          setCategories(categoriesData.data)
        }

        const params = new URLSearchParams()
        if (selectedCategory !== "all") {
          params.append("category", selectedCategory)
        }
        if (searchQuery) {
          params.append("search", searchQuery)
        }

        console.log("[v0] Fetching products with params:", params.toString())
        console.log("[v0] Selected category:", selectedCategory)

        const productsRes = await fetch(`/api/products?${params.toString()}`)
        const productsData = await productsRes.json()
        console.log("[v0] Products fetched:", productsData.data)
        if (productsData.success) {
          setProducts(productsData.data)
        }
      } catch (error) {
        console.error("Failed to fetch data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [selectedCategory, searchQuery])

  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam)
    }
  }, [categoryParam])

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Title */}
        <section className="border-b bg-muted/50 py-6 md:py-8 lg:py-12">
          <div className="container px-4 md:px-6">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-balance">Thực Đơn</h1>
          </div>
        </section>

        <div className="container py-4 md:py-6 lg:py-8 px-4 md:px-6">
          <div className="flex flex-col gap-4 md:gap-6 lg:flex-row">
            {/* Sidebar & Categories */}
            <aside className="lg:w-64 lg:shrink-0">
              <div className="space-y-4 md:space-y-5 lg:sticky lg:top-20">
                {/* Search */}
                <div>
                  <label className="mb-2 block text-sm font-semibold">Tìm kiếm</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Tìm món ăn..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 h-10 md:h-11"
                    />
                  </div>
                </div>

                {/* Categories */}
                <div>
                  <div className="mb-2.5 flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <label className="text-sm font-semibold">Danh mục</label>
                  </div>
                  <div
                    className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:space-y-1.5 lg:overflow-y-auto lg:max-h-[calc(100vh-16rem)] lg:pb-0 
                               [-ms-overflow-style:none] [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-thumb]:rounded-full"
                  >
                    <Button
                      variant={selectedCategory === "all" ? "default" : "outline"}
                      className="shrink-0 rounded-full px-4 h-9 text-sm font-medium lg:w-full lg:justify-start lg:rounded-md lg:h-10"
                      onClick={() => setSelectedCategory("all")}
                    >
                      Tất cả món
                    </Button>
                    {categories.map((category) => (
                      <Button
                        key={category.id}
                        variant={selectedCategory === category.id ? "default" : "outline"}
                        className="shrink-0 rounded-full px-4 h-9 text-sm font-medium lg:w-full lg:justify-start lg:rounded-md lg:h-10"
                        onClick={() => {
                          console.log("[v0] Category clicked:", category.id, category.name)
                          setSelectedCategory(category.id)
                        }}
                      >
                        {category.name}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </aside>

            {/* Products */}
            <div className="flex-1 min-w-0">
              {loading ? (
                <div className="grid gap-3 md:gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="h-80 md:h-96 animate-pulse rounded-lg bg-muted" />
                  ))}
                </div>
              ) : products.length === 0 ? (
                <div className="flex min-h-[300px] md:min-h-[400px] flex-col items-center justify-center text-center px-4">
                  <p className="text-sm md:text-base lg:text-lg text-muted-foreground font-medium">
                    Không tìm thấy món ăn nào
                  </p>
                  <Button
                    variant="outline"
                    className="mt-4 bg-transparent h-10 md:h-11"
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
                  <div className="mb-3 md:mb-4 text-xs md:text-sm text-muted-foreground font-medium">
                    Tìm thấy {products.length} món ăn
                  </div>
                  <div className="grid gap-3 md:gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
                    {products.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
