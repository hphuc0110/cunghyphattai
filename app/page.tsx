import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductCard } from "@/components/product-card"
import { ArrowRight, Star, Clock, Truck } from "lucide-react"
import { categories, products } from "@/lib/data"
import { InfiniteMovingCards } from "@/components/infinite-moving-cards"

export default function HomePage() {
  const featuredProducts = products.filter((p) => p.featured).slice(0, 8)

  return (
    <>
      <Header />
        {/* Hero Section */}
        <section className="relative flex items-end overflow-hidden min-h-[500px] sm:min-h-[600px] md:min-h-[700px] lg:min-h-[800px]">
          <div className="absolute inset-0">
            <div
              className="w-full h-full bg-cover bg-center bg-no-repeat transition-all duration-500"
              style={{
                backgroundImage: "url(/images/herosection.png)",
              }}
            />
          </div>

          <div className="absolute inset-0 bg-gradient-to-t from-white/10 via-black/30 to-transparent" />

          <div className="relative z-10 container px-4 sm:px-6 md:px-8 py-10 sm:py-16 text-center text-white">
            <div className="mx-auto max-w-2xl">
            <div
  className="
    flex flex-col sm:flex-row 
    items-center justify-center 
    gap-2 mt-96
  "
>
  {/* Nút 1: Xem thực đơn */}
  <Button
    size="lg"
    asChild
    className="relative overflow-hidden group font-semibold w-full sm:w-auto px-8 py-6 rounded-xl shadow-lg 
    bg-white text-[#cd0000] transition-all duration-300 hover:shadow-2xl hover:scale-105"
  >
    <Link href="/menu">
      <span className="relative z-10 flex items-center gap-2">
        Xem Thực Đơn
        <ArrowRight className="h-5 w-5" />
      </span>
      <span className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-white transition-opacity duration-300" />
    </Link>
  </Button>

  {/* Nút 2: Gọi đặt hàng */}
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

        {/* Featured Products */}
{/* ✨ Features Section – Trung Hoa sang trọng + mây vàng chuyển động */}
<section className="relative overflow-hidden py-24 bg-gradient-to-b from-[#7b1113] via-[#5c0d0f] to-[#250202]">
  {/* 🌸 Nền hoa văn Trung Hoa */}
  <div className="absolute inset-0 bg-[url('/images/chinese-pattern-gold.webp')] opacity-[0.07] bg-repeat bg-center"></div>

  {/* 💫 Hiệu ứng ánh sáng trung tâm */}
  <div className="absolute top-1/2 left-1/2 w-[900px] h-[900px] -translate-x-1/2 -translate-y-1/2 bg-gradient-radial from-[#ffd70033] via-transparent to-transparent blur-3xl opacity-40 animate-pulse"></div>

  {/* ☁️ Mây vàng chuyển động */}
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute top-1/4 left-[-200px] w-[600px] h-[300px] bg-[url('/images/golden-cloud.jpg')] bg-contain bg-no-repeat opacity-30 animate-cloud-left"></div>
    <div className="absolute bottom-1/3 right-[-200px] w-[600px] h-[300px] bg-[url('/images/golden-cloud.jpg')] bg-contain bg-no-repeat opacity-25 animate-cloud-right"></div>
  </div>

  <div className="relative container mx-auto px-6 text-center">
    <h2 className="text-4xl md:text-5xl font-extrabold text-[#ffd700] tracking-widest mb-6 drop-shadow-[0_0_10px_#d4a017aa]">
      TINH HOA ẨM THỰC TRUNG HOA
    </h2>
    <p className="text-lg text-[#f5e2c0] max-w-2xl mx-auto mb-16 leading-relaxed">
      Sự hòa quyện giữa nghệ thuật ẩm thực cổ truyền và phong cách phục vụ đẳng cấp,
      mang đến trải nghiệm không thể quên.
    </p>

    <div className="grid gap-12 md:grid-cols-3">
      {[
        {
          icon: Star,
          title: "Ẩm Thực Tuyệt Hảo",
          desc: "Mỗi món ăn là tinh hoa của nghệ thuật ẩm thực Trung Hoa, được chế biến tỉ mỉ từ đầu bếp giàu kinh nghiệm.",
        },
        {
          icon: Clock,
          title: "Phục Vụ Tận Tâm",
          desc: "Đội ngũ nhân viên chu đáo, tận tình và chuyên nghiệp, luôn sẵn sàng phục vụ bạn mọi lúc.",
        },
        {
          icon: Truck,
          title: "Giao Hàng Hoàn Hảo",
          desc: "Món ăn được giao nhanh chóng, đảm bảo vẫn nóng hổi, nguyên vẹn hương vị tinh tế đặc trưng.",
        },
      ].map((item, i) => (
        <div
          key={i}
          className="relative group rounded-3xl p-[2px] bg-gradient-to-br from-[#d4a017] to-[#ffecb3] hover:from-[#ffecb3] hover:to-[#d4a017] transition-all duration-700"
        >
          <div className="relative z-10 flex flex-col items-center justify-center bg-[#1a0000]/70 rounded-3xl py-12 px-8 h-full">
            {/* Icon */}
            <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-[#ffd7001a] border border-[#ffd70055] group-hover:shadow-[0_0_30px_#ffd70066] transition-all duration-500">
              <item.icon className="h-12 w-12 text-[#ffd700]" />
            </div>

            {/* Title */}
            <h3 className="text-2xl font-bold text-[#ffd700] mb-4 tracking-wide">
              {item.title}
            </h3>

            {/* Description */}
            <p className="text-base text-[#f5e2c0] leading-relaxed max-w-xs mx-auto">
              {item.desc}
            </p>

            {/* Decorative line */}
            <div className="mt-6 w-20 h-[2px] bg-gradient-to-r from-transparent via-[#ffd700] to-transparent group-hover:w-28 transition-all duration-700"></div>
          </div>

          {/* Viền ánh sáng động */}
          <div className="absolute inset-0 rounded-3xl blur-[2px] opacity-0 group-hover:opacity-100 bg-gradient-to-br from-[#ffd70099] to-transparent transition-all duration-700"></div>
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

            <div className="relative">
              <InfiniteMovingCards
                items={categories.map((category) => ({
                  id: category.id,
                  content: (
                    <Link
                      href="/menu"
                      className="group relative flex flex-col items-center justify-end min-w-[200px] sm:min-w-[220px] mx-4 
                      h-[260px] sm:h-[300px] overflow-hidden rounded-[2rem] border-2 border-primary/30 
                      bg-gradient-to-b from-primary/10 via-white/10 to-primary/10 shadow-[0_0_15px_rgba(255,100,100,0.2)]
                      transition-all duration-500 hover:scale-105 hover:shadow-[0_0_30px_rgba(255,100,100,0.5)]"
                    >
                      {/* Ảnh */}
                      <div className="absolute inset-0 overflow-hidden rounded-[2rem]">
                        <img
                          src={category.image || "/placeholder.svg"}
                          alt={category.name}
                          className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-all duration-500"
                        />
                      </div>

                      {/* Viền phát sáng kiểu Genshin */}
                      <div className="absolute inset-0 rounded-[2rem] border-2 border-white/30 group-hover:border-primary/60 
                      shadow-[0_0_20px_rgba(255,255,255,0.2)] group-hover:shadow-[0_0_30px_rgba(255,100,100,0.4)] transition-all duration-500" />

                      {/* Gradient nền chữ */}
                      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 via-black/30 to-transparent rounded-b-[2rem]">
                        <h3 className="text-lg font-bold text-white drop-shadow-md">{category.name}</h3>
                        <p className="text-xs text-white/80">{category.nameEn}</p>
                      </div>
                    </Link>
                  ),
                }))}
                direction="left"
                pauseOnHover={true}
                duration={240000}
              />
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
      
      <Footer />
    </>
  )
}
