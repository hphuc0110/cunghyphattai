import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CategoryCard } from "@/components/category-card"
import { ProductCard } from "@/components/product-card"
import { ArrowRight, Star, Clock, Truck } from "lucide-react"
import { categories, products } from "@/lib/data"

export default function HomePage() {
  const featuredProducts = products.filter((p) => p.featured).slice(0, 8)

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/10">
          <div className="absolute inset-0 bg-[url('/placeholder.svg?height=800&width=1600')] opacity-5" />
          <div className="container relative py-12 md:py-24 px-4">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-4 md:mb-6 inline-block rounded-full bg-primary/10 px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm font-semibold text-primary">
                恭喜發財 - Chúc Mừng Phát Tài
              </div>
              <h1 className="mb-4 md:mb-6 text-3xl md:text-4xl lg:text-6xl font-bold tracking-tight text-balance">
                Hương Vị Trung Hoa
                <br />
                <span className="text-primary">Chính Gốc</span>
              </h1>
              <p className="mb-6 md:mb-8 text-base md:text-lg lg:text-xl text-muted-foreground text-pretty leading-relaxed px-4 md:px-0">
                Trải nghiệm ẩm thực Trung Hoa đích thực với các món ăn truyền thống được chế biến từ nguyên liệu tươi
                ngon, mang đến hương vị đậm đà và tinh tế.
              </p>
              <div className="flex flex-col items-center justify-center gap-3 sm:gap-4 sm:flex-row px-4 md:px-0">
                <Button size="lg" className="gap-2 font-semibold w-full sm:w-auto" asChild>
                  <Link href="/menu">
                    Xem Thực Đơn
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="font-semibold bg-transparent w-full sm:w-auto" asChild>
                  <a href="tel:0901234567">Gọi Đặt Hàng: 0901 234 567</a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="border-y bg-muted/50 py-8 md:py-12">
          <div className="container px-4">
            <div className="grid gap-6 md:gap-8 md:grid-cols-3">
              <div className="flex flex-col items-center text-center">
                <div className="mb-3 md:mb-4 flex h-14 w-14 md:h-16 md:w-16 items-center justify-center rounded-full bg-primary/10">
                  <Star className="h-7 w-7 md:h-8 md:w-8 text-primary" />
                </div>
                <h3 className="mb-2 font-bold text-base md:text-lg">Chất Lượng Cao</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Nguyên liệu tươi ngon, chế biến theo công thức truyền thống
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="mb-3 md:mb-4 flex h-14 w-14 md:h-16 md:w-16 items-center justify-center rounded-full bg-primary/10">
                  <Clock className="h-7 w-7 md:h-8 md:w-8 text-primary" />
                </div>
                <h3 className="mb-2 font-bold text-base md:text-lg">Giao Hàng Nhanh</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Giao hàng trong vòng 30-45 phút, đảm bảo món ăn nóng hổi
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="mb-3 md:mb-4 flex h-14 w-14 md:h-16 md:w-16 items-center justify-center rounded-full bg-primary/10">
                  <Truck className="h-7 w-7 md:h-8 md:w-8 text-primary" />
                </div>
                <h3 className="mb-2 font-bold text-base md:text-lg">Miễn Phí Ship</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Miễn phí giao hàng cho đơn từ 200.000đ trong bán kính 5km
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-12 md:py-16">
          <div className="container px-4">
            <div className="mb-6 md:mb-8 text-center">
              <h2 className="mb-2 md:mb-3 text-2xl md:text-3xl lg:text-4xl font-bold text-balance">Danh Mục Món Ăn</h2>
              <p className="text-sm md:text-base text-muted-foreground text-pretty font-medium">
                Khám phá các món ăn đặc sắc từ ẩm thực Trung Hoa
              </p>
            </div>
            <div className="grid gap-3 sm:gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
              {categories.map((category) => (
                <CategoryCard key={category.id} category={category} />
              ))}
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="bg-muted/50 py-12 md:py-16">
          <div className="container px-4">
            <div className="mb-6 md:mb-8 flex items-center justify-between">
              <div>
                <h2 className="mb-1 md:mb-2 text-2xl md:text-3xl lg:text-4xl font-bold text-balance">Món Ăn Nổi Bật</h2>
                <p className="text-sm md:text-base text-muted-foreground font-medium">
                  Những món ăn được yêu thích nhất
                </p>
              </div>
              <Button variant="outline" asChild className="hidden md:flex font-semibold bg-transparent">
                <Link href="/menu">
                  Xem Tất Cả
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="grid gap-3 sm:gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            <div className="mt-6 md:mt-8 text-center md:hidden">
              <Button variant="outline" className="font-semibold bg-transparent" asChild>
                <Link href="/menu">
                  Xem Tất Cả
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 md:py-16">
          <div className="container px-4">
            <div className="rounded-lg bg-gradient-to-r from-primary to-primary/80 p-6 md:p-8 lg:p-12 text-center text-primary-foreground">
              <h2 className="mb-3 md:mb-4 text-2xl md:text-3xl lg:text-4xl font-bold text-balance">
                Đặt Hàng Ngay Hôm Nay
              </h2>
              <p className="mb-4 md:mb-6 text-base md:text-lg text-primary-foreground/90 text-pretty leading-relaxed">
                Gọi ngay để được tư vấn và đặt hàng. Chúng tôi luôn sẵn sàng phục vụ bạn!
              </p>
              <Button size="lg" variant="secondary" className="font-semibold w-full sm:w-auto" asChild>
                <a href="tel:0901234567">Gọi: 0901 234 567</a>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
