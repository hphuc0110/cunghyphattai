"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductCard } from "@/components/product-card"
import { ArrowRight, Star, Clock, Truck } from "lucide-react"
import { categories, products } from "@/lib/data"
import { InfiniteMovingCards } from "@/components/infinite-moving-cards"
import { motion } from "framer-motion"

export default function HomePage() {
  const featuredProducts = products.filter((p) => p.featured).slice(0, 8)

  return (
    <>
      <Header />

    <section className="relative flex items-center justify-center overflow-hidden min-h-[600px] sm:min-h-[700px] lg:min-h-[800px]">
      {/* Ảnh nền chính */}
      <div className="absolute inset-0">
        <div
          className="w-full h-full bg-cover bg-center transition-all duration-700 scale-105 hover:scale-110"
          style={{
            backgroundImage: "url(/images/herosection.png)",
          }}
        />
      </div>

      {/* Overlay hiệu ứng Trung Hoa */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-transparent" />
      <div className="absolute inset-0 backdrop-blur-[1px]" />

      {/* Họa tiết trang trí Trung Hoa */}
      <img
        src="/images/cloud.png"
        alt="Mây Trung Hoa"
        className="absolute left-0 bottom-0 w-[180px] sm:w-[250px] opacity-80 animate-float-slow"
      />
      <img
        src="/images/cloud.png"
        alt="Mây Trung Hoa"
        className="absolute right-0 top-0 w-[160px] sm:w-[220px] opacity-70 animate-float-slow-delayed"
      />
      <img
        src="/images/lantern.png"
        alt="Đèn lồng"
        className="absolute top-10 left-30 w-[100px] sm:w-[140px] drop-shadow-[0_0_10px_rgba(255,200,100,0.7)] animate-swing-slow"
      />

      {/* Nội dung chính */}
      <div className="relative z-10 text-center text-white px-6 sm:px-8 max-w-3xl">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-wide mb-6 text-yellow-300 drop-shadow-[0_0_10px_rgba(255,200,0,0.6)]">
          Ẩm Thực Trung Hoa Thượng Hạng
        </h1>

        {/* Nút hành động */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            size="lg"
            asChild
            className="relative overflow-hidden group font-semibold w-full sm:w-auto px-8 py-6 rounded-2xl shadow-lg 
              bg-gradient-to-r from-[#b40000] to-[#ff4d4d] text-white border border-yellow-400/50 
              transition-all duration-500 hover:scale-105 hover:shadow-[0_0_25px_rgba(255,200,0,0.6)]"
          >
            <Link href="/menu">
              <span className="relative z-10 flex items-center gap-2">
                Xem Thực Đơn
                <ArrowRight className="h-5 w-5" />
              </span>
              <span className="absolute inset-0 opacity-0 group-hover:opacity-30 bg-yellow-300/20 transition-opacity duration-500" />
            </Link>
          </Button>

          <Button
            size="lg"
            variant="outline"
            asChild
            className="relative overflow-hidden font-semibold w-full sm:w-auto px-8 py-6 rounded-2xl 
              border border-yellow-400 bg-white/80 text-[#800000] backdrop-blur-md shadow-md 
              hover:scale-105 hover:shadow-[0_0_25px_rgba(255,200,0,0.5)] transition-all duration-500"
          >
            <a href="tel:0915885888">Gọi Đặt Hàng: 091 588 58 88</a>
          </Button>
        </div>
      </div>

      {/* Hiệu ứng ánh sáng chuyển động nhẹ */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-200/10 to-transparent animate-slow-shimmer" />
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
    {/* Tiêu đề */}
    <div className="mb-10 text-center">
      <h2 className="text-3xl md:text-4xl font-bold mb-3">Danh Mục Món Ăn</h2>
      <p className="text-muted-foreground text-base font-medium">
        Khám phá các món ăn đặc sắc từ ẩm thực Trung Hoa
      </p>
    </div>

    {/* Grid danh mục */}
    <div
      className="
        grid 
        grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 
        gap-6 place-items-center
      "
    >
      {categories.map((category) => (
        <Link
          key={category.id}
          href="/menu"
          className="
            relative w-full 
            h-[260px] sm:h-[300px] md:h-[340px] 
            overflow-hidden rounded-2xl 
            group shadow-lg transition-all duration-500
            border-2 border-transparent
            hover:border-[#ff4d4d]/50
            hover:shadow-[0_0_25px_rgba(255,77,77,0.5)]
          "
        >
          {/* Ảnh */}
          <img
            src={category.image || '/placeholder.svg'}
            alt={category.name}
            className="
              w-full h-full object-cover
              transition-transform duration-700 ease-out
              group-hover:scale-110
            "
          />

          {/* Viền sáng kiểu Genshin */}
          <div
            className="
              absolute inset-0 rounded-2xl 
              border-2 border-white/10 
              group-hover:border-[#ff4d4d]/70
              transition-all duration-700
              shadow-[0_0_15px_rgba(255,255,255,0.2)]
              group-hover:shadow-[0_0_30px_rgba(255,77,77,0.4)]
              animate-none group-hover:animate-glowPulse
            "
          />

          {/* Overlay chữ */}
          <div
            className="
              absolute bottom-0 left-0 right-0 
              bg-gradient-to-t from-black/70 via-black/30 to-transparent 
              p-4 rounded-b-2xl
            "
          >
            <h3 className="text-white text-lg font-semibold drop-shadow-md">
              {category.name}
            </h3>
            <p className="text-white/80 text-xs">{category.nameEn}</p>
          </div>
        </Link>
      ))}
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
