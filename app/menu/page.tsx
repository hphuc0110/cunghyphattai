"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Filter, Menu as MenuIcon, X } from "lucide-react"
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
  const [sidebarOpen, setSidebarOpen] = useState(false)

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
    if (categoryParam) setSelectedCategory(categoryParam)
  }, [categoryParam])

  const backImage = "/images/back-mon.jpg"

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-[#fff9f3] via-[#fffefb] to-[#fdf8f2]">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-6 md:py-10">
        {/* Nút mở sidebar (mobile) */}
        <div className="flex items-center justify-between mb-4 md:hidden">
          <h2 className="text-lg font-semibold">Thực đơn</h2>
          <Button variant="outline" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <X className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
          </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-8 relative">
          {/* Sidebar danh mục */}
          <aside
            className={`${
              sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
            } fixed md:static top-0 left-0 z-40 h-full md:h-auto w-64 bg-white md:bg-transparent shadow-md md:shadow-none border-r md:border-none transition-transform duration-300 ease-in-out overflow-y-auto p-6 md:p-0`}
          >
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Filter className="h-4 w-4 text-[#b45309]" />
              Danh mục
            </h3>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => {
                    setSelectedCategory("all")
                    setSidebarOpen(false)
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg transition ${
                    selectedCategory === "all"
                      ? "bg-[#b45309]/10 text-[#b45309] font-semibold"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  Tất cả món
                </button>
              </li>
              {categories.map((category) => (
                <li key={category.id}>
                  <button
                    onClick={() => {
                      setSelectedCategory(category.id)
                      setSidebarOpen(false)
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg transition ${
                      selectedCategory === category.id
                        ? "bg-[#b45309]/10 text-[#b45309] font-semibold"
                        : "hover:bg-gray-100 text-gray-700"
                    }`}
                  >
                    {category.name}
                  </button>
                </li>
              ))}
            </ul>
          </aside>

          {/* Overlay cho mobile */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 bg-black/30 md:hidden z-30"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Khu vực món ăn */}
          <section className="flex-1 min-w-0">
            {/* Ô tìm kiếm */}
            <div className="mb-6 bg-white/80 backdrop-blur-md p-5 rounded-2xl shadow-md border border-gray-100">
              <label className="block mb-2 text-sm font-semibold text-gray-700">
                Tìm kiếm món ăn
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Nhập tên món..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-11 rounded-lg focus:ring-2 focus:ring-[#b45309]/50"
                />
              </div>
            </div>

            {/* Danh sách món ăn */}
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
                    Hiển thị{" "}
                    <span className="font-semibold text-[#b45309]">{products.length}</span> món ăn
                  </div>
                  {selectedCategory !== "all" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedCategory("all")}
                      className="text-[#b45309] hover:text-[#92400e]"
                    >
                      Xem tất cả
                    </Button>
                  )}
                </div>

                <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="transition-transform duration-300 hover:-translate-y-2 hover:scale-[1.01]"
          >
            <ProductCard product={product} backImage={backImage} />
          </div>
        ))}
                </div>
              </>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}
