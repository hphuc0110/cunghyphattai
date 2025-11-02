import { Suspense } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { MenuClient } from "@/components/menu-client"
import { getProducts, getCategories } from "@/lib/menu-helpers"

interface MenuPageProps {
  searchParams: { category?: string; search?: string }
}

// Loading skeleton
function MenuSkeleton() {
  return (
    <div className="flex flex-col md:flex-row gap-8">
      <aside className="hidden md:block w-64">
        <div className="h-8 w-32 bg-gray-200 rounded animate-pulse mb-4" />
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-10 bg-gray-200 rounded animate-pulse" />
          ))}
        </div>
      </aside>
      <section className="flex-1">
        <div className="h-16 bg-gray-200 rounded-xl animate-pulse mb-6" />
        <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-80 bg-gray-200 rounded-xl animate-pulse" />
          ))}
        </div>
      </section>
    </div>
  )
}

export default async function MenuPage({ searchParams }: MenuPageProps) {
  const category = searchParams.category || "all"
  const search = searchParams.search

  // Fetch data song song ở server - nhanh hơn nhiều so với client-side
  const [products, categories] = await Promise.all([
    getProducts({ category, search, limit: 200 }),
    getCategories(),
  ])

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-[#fff9f3] via-[#fffefb] to-[#fdf8f2]">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-6 md:py-10">
        <Suspense fallback={<MenuSkeleton />}>
          <MenuClient
            initialProducts={products}
            initialCategories={categories}
            initialCategory={category}
          />
        </Suspense>
      </main>

      <Footer />
    </div>
  )
}
