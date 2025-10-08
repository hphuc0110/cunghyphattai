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
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-white to-gray-50">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative flex items-end overflow-hidden min-h-[500px] sm:min-h-[600px] md:min-h-[700px] lg:min-h-[800px]">
          {/* Background */}
          <div className="absolute inset-0">
            <div
              className="w-full h-full bg-cover bg-center bg-no-repeat transition-all duration-500"
              style={{
                backgroundImage: "url(/images/herosection.png)",
              }}
            />
          </div>

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-white/10 via-black/30 to-transparent" />

          {/* Content */}
          <div className="relative z-10 container px-4 sm:px-6 md:px-8 py-10 sm:py-16 text-center text-white">
            <div className="mx-auto max-w-2xl">

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                {/* Nút chính */}
                <Button
                  size="lg"
                  asChild
                  className="relative overflow-hidden group font-semibold w-full sm:w-auto px-8 py-6 rounded-xl shadow-lg 
                  bg-white
                  text-[#cd0000] transition-all duration-300 hover:shadow-2xl hover:scale-105"
                >
                  <Link href="/menu">
                    <span className="relative z-10 flex items-center gap-2">
                      Xem Thực Đơn
                      <ArrowRight className="h-5 w-5" />
                    </span>
                    <span className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-white transition-opacity duration-300" />
                  </Link>
                </Button>

                {/* Nút phụ */}
                <Button
                  size="lg"
                  variant="outline"
                  asChild
                  className="relative overflow-hidden font-semibold w-full sm:w-auto px-8 py-6 rounded-xl 
                  border border-white/80 bg-white/80 text-gray-900 backdrop-blur-md shadow-md 
                  hover:scale-105 hover:shadow-xl hover:bg-white transition-all duration-300"
                >
                  <a href="tel:0901234567">Gọi Đặt Hàng: 091 588 58 88</a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="border-y bg-white/70 py-12">
          <div className="container px-4">
            <div className="grid gap-8 md:grid-cols-3 text-center">
              {[
                { icon: Star, title: "Chất Lượng Cao", desc: "Nguyên liệu tươi ngon, chế biến theo công thức truyền thống" },
                { icon: Clock, title: "Giao Hàng Nhanh", desc: "Giao hàng trong vòng 30-45 phút, đảm bảo món ăn nóng hổi" },
                { icon: Truck, title: "Miễn Phí Ship", desc: "Miễn phí giao hàng cho đơn từ 200.000đ trong bán kính 5km" },
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 shadow-md">
                    <item.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="mb-2 font-bold text-lg">{item.title}</h3>
                  <p className="text-sm text-muted-foreground max-w-xs mx-auto">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-16 bg-gradient-to-b from-white to-gray-50">
          <div className="container px-4">
            <div className="mb-10 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-3">Danh Mục Món Ăn</h2>
              <p className="text-muted-foreground text-base font-medium">
                Khám phá các món ăn đặc sắc từ ẩm thực Trung Hoa
              </p>
            </div>
            <div className="grid gap-5 sm:grid-cols-3 lg:grid-cols-4">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="transition-transform hover:scale-105 hover:shadow-lg bg-white rounded-xl border p-2"
                >
                  <CategoryCard category={category} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="bg-muted/30 py-16">
          <div className="container px-4">
            <div className="mb-8 flex items-center justify-between flex-wrap gap-3">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-1">Món Ăn Nổi Bật</h2>
                <p className="text-muted-foreground text-base font-medium">Những món ăn được yêu thích nhất</p>
              </div>
              <Button
                variant="outline"
                asChild
                className="font-semibold hidden md:flex border-primary/20 hover:bg-primary/10 hover:text-primary transition-all duration-300"
              >
                <Link href="/menu">
                  Xem Tất Cả
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="grid gap-5 sm:grid-cols-3 lg:grid-cols-4">
              {featuredProducts.map((product) => (
                <div key={product.id} className="transition-transform hover:scale-105 hover:shadow-md bg-white rounded-xl border">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>

            <div className="mt-8 text-center md:hidden">
              <Button
                variant="outline"
                className="font-semibold border-primary/20 hover:bg-primary/10 hover:text-primary transition-all duration-300"
                asChild
              >
                <Link href="/menu">
                  Xem Tất Cả
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16">
          <div className="container px-4">
            <div className="rounded-2xl bg-gradient-to-r from-primary to-primary/80 p-10 text-center text-white shadow-xl">
              <h2 className="mb-4 text-3xl md:text-4xl font-bold">
                Đặt Hàng Ngay Hôm Nay
              </h2>
              <p className="mb-6 text-lg text-white/90 max-w-xl mx-auto">
                Gọi ngay để được tư vấn và đặt hàng. Chúng tôi luôn sẵn sàng phục vụ bạn!
              </p>
              <Button
                size="lg"
                variant="secondary"
                className="font-semibold w-full sm:w-auto bg-white text-primary hover:bg-white/90 hover:scale-105 transition-all duration-300 shadow-md rounded-xl"
              >
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
