import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"   // ✅ import font mới
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "@/components/ui/toaster"
import { Suspense } from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "Cung Hỷ Phát Tài - Ẩm Thực Trung Hoa",
  description: "Nhà hàng ẩm thực Trung Hoa",
    generator: 'v0.app'
}

// ✅ setup font Inter
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
        className={`${inter.variable} font-sans bg-[#FAFAF5]`}  // dùng Inter thay cho GeistSans
      >
        <Suspense fallback={null}>
          {/* Container căn giữa và responsive */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {children}
          </div>
          <Toaster />
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}
