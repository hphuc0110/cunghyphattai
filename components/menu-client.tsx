"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { MemoizedProductsGrid } from "@/components/products-grid"
import { ImagePreloader } from "@/components/image-preloader"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Filter, Menu as MenuIcon, X } from "lucide-react"
import type { Product, Category } from "@/lib/types"
import { useRouter, useSearchParams } from "next/navigation"

interface MenuClientProps {
  initialProducts: Product[]
  initialCategories: Category[]
  initialCategory?: string | null
}

export function MenuClient({ initialProducts, initialCategories, initialCategory }: MenuClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const categoryParam = searchParams.get("category")

  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || categoryParam || "all")
  const [searchQuery, setSearchQuery] = useState("")
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery)
    }, 500)

    return () => clearTimeout(timer)
  }, [searchQuery])

  // Fetch products khi category hoặc search thay đổi (client-side filtering)
  useEffect(() => {
    async function fetchProducts() {
      // Nếu không có filter, dùng initial data
      if (selectedCategory === "all" && !debouncedSearchQuery) {
        setProducts(initialProducts)
        return
      }

      setLoading(true)
      try {
        const params = new URLSearchParams()
        if (selectedCategory !== "all") params.append("category", selectedCategory)
        if (debouncedSearchQuery) params.append("search", debouncedSearchQuery)

        const productsRes = await fetch(`/api/products?${params.toString()}`, {
          cache: "default",
        })
        const productsData = await productsRes.json()
        if (productsData.success) {
          setProducts(productsData.data)
        }
      } catch (error) {
        console.error("Failed to fetch products:", error)
        // Fallback to initial products on error
        setProducts(initialProducts)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [selectedCategory, debouncedSearchQuery, initialProducts])

  // Update URL khi category thay đổi
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())
    if (selectedCategory !== "all") {
      params.set("category", selectedCategory)
    } else {
      params.delete("category")
    }
    router.replace(`/menu?${params.toString()}`, { scroll: false })
  }, [selectedCategory, router, searchParams])

  const handleCategoryClick = useCallback((categoryId: string) => {
    setSelectedCategory(categoryId)
    setSidebarOpen(false)
  }, [])

  const handleClearFilters = useCallback(() => {
    setSelectedCategory("all")
    setSearchQuery("")
  }, [])

  const toggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev)
  }, [])

  // Memoize computed values
  const filteredProductsCount = useMemo(() => products.length, [products.length])
  const backImage = useMemo(() => "/images/back-mon.jpg", [])

  // Extract image URLs for preloading
  const productImages = useMemo(() => products.map((p) => p.image).filter(Boolean), [products])

  // Memoize products list để tránh re-render khi scroll
  const memoizedProducts = useMemo(() => products, [products])

  return (
    <>
      {/* Preload critical images */}
      <ImagePreloader images={productImages} />

      {/* Nút mở sidebar (mobile) */}
      <div className="flex items-center justify-between mb-4 md:hidden">
        <h2 className="text-lg font-semibold">Thực đơn</h2>
        <Button variant="outline" size="icon" onClick={toggleSidebar}>
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
                onClick={() => handleCategoryClick("all")}
                className={`w-full text-left px-3 py-2 rounded-lg transition ${
                  selectedCategory === "all"
                    ? "bg-[#b45309]/10 text-[#b45309] font-semibold"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
              >
                Tất cả món
              </button>
            </li>
            {initialCategories.map((category) => (
              <li key={category.id}>
                <button
                  onClick={() => handleCategoryClick(category.id)}
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
              <Button variant="outline" className="h-11 px-6" onClick={handleClearFilters}>
                Xóa bộ lọc
              </Button>
            </div>
          ) : (
            <>
              <div className="mb-6 flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Hiển thị{" "}
                  <span className="font-semibold text-[#b45309]">{filteredProductsCount}</span> món ăn
                </div>
                {selectedCategory !== "all" && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCategoryClick("all")}
                    className="text-[#b45309] hover:text-[#92400e]"
                  >
                    Xem tất cả
                  </Button>
                )}
              </div>

              <MemoizedProductsGrid products={memoizedProducts} backImage={backImage} />
            </>
          )}
        </section>
      </div>
    </>
  )
}

