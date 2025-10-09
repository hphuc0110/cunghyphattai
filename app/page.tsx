"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ArrowRight, Star, Clock, Truck, Menu, Phone } from "lucide-react"
import { categories, products } from "@/lib/data"


export default function HomePage() {
  const featuredProducts = products.filter((p) => p.featured).slice(0, 8)

  return (
    <>
      <Header />
      <section className="relative min-h-screen w-full overflow-hidden">
  {/* Background Image - Desktop */}
  <div className="absolute inset-0 hidden md:block">
    <img
      src="/images/herosection.png"
      alt="HEROSECTION"
      className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
      style={{ top: 0, left: 0 }}
    />
    <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/30 to-black/20" />
  </div>

  {/* Background Image - Mobile */}
  <div className="absolute inset-0 md:hidden">
    <img
      src="/images/herosection-mobile.png" // bạn sẽ thêm ảnh riêng cho mobile
      alt="HEROSECTION MOBILE"
      className="h-full w-full object-cover"
    />
    <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/30 to-black/20" />
  </div>

  {/* Clouds & Lanterns - Chỉ hiện desktop */}
  <div className="hidden md:block">
    <img
      src="/images/cloud.png"
      alt="Cloud top left"
      className="absolute top-0 left-0 w-100 h-100 opacity-90 pointer-events-none animate-cloud-left-right"
      style={{ animationDuration: "30s" }}
    />
    <img
      src="/images/cloud.png"
      alt="Cloud top right"
      className="absolute top-40 right-40 w-60 h-60 opacity-80 pointer-events-none animate-cloud-left-right"
      style={{ animationDuration: "30s", animationDelay: "10s" }}
    />
    <img
      src="/images/lantern.png"
      alt="Lantern"
      className="absolute right-40 w-70 h-70 pointer-events-none animate-cloud-left-right"
      style={{ animationDuration: "50s", animationDelay: "10s" }}
    />
    <img
      src="/images/cloud.png"
      alt="Cloud bottom left"
      className="absolute bottom-24 left-0 w-50 h-50 opacity-60 pointer-events-none animate-cloud-left-right"
      style={{ animationDuration: "80s", animationDelay: "5s" }}
    />
  </div>

  {/* Content Container */}
  <div className="relative z-10 flex min-h-screen flex-col">
    {/* Navigation */}
    <nav className="flex items-center justify-between px-6 py-6 md:px-12 lg:px-16">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-white/10 lg:hidden"
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Menu</span>
        </Button>
      </div>
    </nav>

    {/* Hero Content - Right Aligned */}
    <div className="flex flex-1 items-end justify-end px-6 pb-20 md:px-12 lg:pr-24 xl:pr-32">
      <div className="max-w-2xl space-y-6 text-right">
        <div className="flex items-center gap-8 pt-8">
          {/* Phone */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-lg font-semibold text-white">091 588 58 88</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm">
              <Phone className="h-5 w-5 text-white" />
            </div>
          </div>

          {/* Opening Hours */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-medium text-white">
                10h - 14h, 17h -22h
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/30 backdrop-blur-sm">
              <Clock className="h-5 w-5 text-white" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  {/* Tailwind Keyframes cho Clouds */}
  <style jsx>{`
    @keyframes cloudLeftRight {
      0% { transform: translateX(0); }
      50% { transform: translateX(100px); }
      100% { transform: translateX(0); }
    }
    .animate-cloud-left-right {
      animation: cloudLeftRight linear infinite;
    }
  `}</style>
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
                <a href="tel:0901234567">091 588 58 88</a>
              </Button>
            </div>
          </div>
        </section>
      
      <Footer />
    </>
  )
}
