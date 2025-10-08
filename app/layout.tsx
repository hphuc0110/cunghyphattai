import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "@/components/ui/toaster"
import { Suspense } from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "Cung Hỷ Phát Tài - Ẩm Thực Trung Hoa",
  description: "Nhà hàng ẩm thực Trung Hoa",
}

// ✅ Font Inter
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi">
      <body
        className={`${inter.variable} font-sans bg-[#FAFAF5] relative min-h-screen w-full overflow-x-hidden`}
      >
        {/* ✅ Hình nền chìm full màn hình với opacity 20% */}
        <div
          className="fixed inset-0 -z-10 opacity-90"
          style={{
            backgroundImage: "url('/images/back-chim.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            pointerEvents: "none",
          }}
        />

        {/* ✅ Nội dung chính, responsive và canh giữa */}
        <Suspense fallback={null}>
          <main className="relative z-10 flex flex-col min-h-screen w-full items-center justify-start px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-7xl">{children}</div>
          </main>
          <Toaster />
        </Suspense>

        <Analytics />
      </body>
    </html>
  )
}
