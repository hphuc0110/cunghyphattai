"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import HeroSection from "@/components/hero-section"
import { ArrowRight, Star, Clock, Truck } from "lucide-react"
import { products } from "@/lib/data"
import type { Category } from "@/lib/types"


export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([])
  const featuredProducts = products.filter((p) => p.featured).slice(0, 8)

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch("/api/categories")
        const data = await response.json()
        if (data.success) {
          setCategories(data.data)
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error)
      }
    }
    fetchCategories()
  }, [])

  useEffect(() => {
    // Fallback: if redirected after payment, mark order paid in case callback hasn't updated yet
    const url = new URL(window.location.href)
    const payment = url.searchParams.get("payment")
    const orderId = url.searchParams.get("orderId")
    if (payment === "success" && orderId) {
      ;(async () => {
        try {
          await fetch(`/api/orders/${orderId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ paymentStatus: "paid" }),
          })
        } catch {}
        // Clean query params
        url.searchParams.delete("payment")
        url.searchParams.delete("orderId")
        window.history.replaceState({}, "", `${url.pathname}${url.search}`)
      })()
    }
  }, [])

  return (
    <>
      <Header />
      <HeroSection />


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
