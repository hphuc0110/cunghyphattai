"use client"

import { TextGenerateEffect } from "./text-generate-effect"
import { useEffect, useState } from "react"

interface HeroElement {
  id: string
  x: number
  y: number
  width: number
  height: number
  alt: string
  text?: string
  extension?: string
  hoverEffect?: string
  floatAnimation?: boolean
  floatDelay?: number
  duration?: number
  centered?: boolean
  zIndex?: number
  depth?: number
  opacity?: number
}

const heroElements: HeroElement[] = [
  {
    id: "background",
    x: 5,
    y: -20,
    width: 1200,
    height: 900,
    alt: "Background",
    extension: "png",
    zIndex: 8,
  },
  {
    id: "cloud",
    x: 5,
    y: -15,
    width: 300,
    height: 456,
    alt: "Cloud",
    extension: "png",
    hoverEffect: "group-hover:scale-110 group-hover:rotate-2",
    floatAnimation: true,
    zIndex: 2,
  },
  {
    id: "cloud2",
    x: 0,
    y: -15,
    width: 1400,
    height: 1300,
    alt: "Cloud",
    extension: "png",
    hoverEffect: "group-hover:scale-110 group-hover:rotate-2",
    floatAnimation: true,
    zIndex: 2,
    opacity: 0.8,
  },
  {
    id: "phao",
    x: 20,
    y: -75,
    width: 1200,
    height: 1200,
    alt: "Firework",
    extension: "png",
    hoverEffect: "group-hover:scale-110 group-hover:-rotate-2",
    floatAnimation: true,
    floatDelay: 0.2,
    zIndex: 3,
  },
  {
    id: "phao2",
    x: 14,
    y: -70,
    width: 1200,
    height: 1200,
    alt: "Firework",
    extension: "png",
    hoverEffect: "group-hover:scale-110 group-hover:-rotate-2",
    floatAnimation: true,
    floatDelay: 0.2,
    zIndex: 3,
  },
  {
    id: "lixi",
    x: 55,
    y: 45,
    width: 192,
    height: 256,
    alt: "Envelopes",
    extension: "png",
    hoverEffect: "group-hover:scale-110 group-hover:rotate-2",
    floatAnimation: true,
    opacity: 0.6,
    zIndex: 1,
  },
  {
    id: "food",
    x: 5,
    y: 55,
    width: 192,
    height: 256,
    alt: "Food",
    extension: "png",
    floatAnimation: true,
    opacity: 0.6,
    zIndex: 4,
  },
  {
    id: "lantern",
    x: 75,
    y: -15,
    width: 300,
    height: 300,
    alt: "Lantern",
    extension: "png",
    floatAnimation: true,
    zIndex: 8,
  },
  {
    id: "meo",
    x: 10,
    y: 40,
    width: 300,
    height: 400,
    alt: "Cat",
    extension: "png",
    opacity: 0.8,
    floatAnimation: true,
    zIndex: 8,
  },
  {
    id: "vang",
    x: 30,
    y: 10,
    width: 300,
    height: 400,
    alt: "Gold",
    extension: "png",
    floatAnimation: true,
    zIndex: 1,
    opacity: 0.6,
  },
  {
    id: "dongxu",
    x: 60,
    y: 20,
    width: 150,
    height: 200,
    alt: "Coin",
    extension: "png",
    floatAnimation: true,
    opacity: 0.6,
    zIndex: 4,
  },
]

export default function HeroSection() {
  const [mounted, setMounted] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [backgroundImage, setBackgroundImage] = useState("/images/back.jpg")

  // 👇 Kiểm tra kích thước màn hình
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.matchMedia("(max-width: 768px)").matches
      setIsMobile(mobile)
      setBackgroundImage(
        mobile ? "/images/back-mobile.jpg" : "/images/back.jpg"
      )
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    setMounted(true)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  return (
    <section className="relative min-h-screen w-full overflow-hidden flex items-center justify-center">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <img
          src={backgroundImage}
          alt="Background"
          className="w-full h-full object-cover transition-all duration-700 ease-in-out"
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Layered elements (ẩn trên mobile) */}
      {!isMobile && (
        <div className="relative w-full h-screen perspective-1000">
          {heroElements.map((element, index) => {
            const leftStyle = element.centered
              ? "50%"
              : element.x > 100
              ? `${element.x}px`
              : `${element.x}%`

            const topStyle = element.centered
              ? "50%"
              : element.y > 100
              ? `${element.y}px`
              : `${element.y}%`

            return (
              <div
                key={`${element.id}-${index}`}
                className={`absolute group transition-all ${
                  element.centered ? "-translate-x-1/2 -translate-y-1/2" : ""
                } ${mounted ? "opacity-100" : "opacity-0"}`}
                style={{
                  left: leftStyle,
                  top: topStyle,
                  width: element.width,
                  height: element.height,
                  zIndex: element.zIndex ?? 1,
                  transform: `translateZ(${element.depth ?? 0}px)`,
                  animation: mounted
                    ? `fadeInUp 0.8s ease-out ${index * 0.1}s forwards`
                    : "none",
                }}
              >
                <div
                  className="relative w-full h-full transform transition duration-700 ease-in-out"
                  style={{
                    opacity: element.opacity ?? 1,
                    animation: element.floatAnimation
                      ? `float 3s ease-in-out ${
                          element.floatDelay || 0
                        }s infinite`
                      : "none",
                  }}
                >
                  <img
                    src={`/images/${element.id}.${element.extension ?? "png"}`}
                    alt={element.alt}
                    className={`w-full h-full object-contain drop-shadow-2xl transition-transform duration-700 ease-in-out group-hover:brightness-110 ${
                      element.hoverEffect ?? "group-hover:scale-105"
                    }`}
                  />
                  {element.text && (
                    <div className="absolute -top-8 left-0 text-white text-sm font-mono opacity-0 group-hover:opacity-100 transition-opacity whitespace-pre-line">
                      <TextGenerateEffect
                        text={element.text}
                        duration={30}
                        delay={200}
                      />
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-15px);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style>
    </section>
  )
}
