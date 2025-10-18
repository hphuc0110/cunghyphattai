"use client"

import Link from "next/link"
import { ShoppingCart, Menu, Phone, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCartStore } from "@/lib/cart-store"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useState } from "react"

export function Header() {
  const itemCount = useCartStore((state) => state.getItemCount())
  const [isOpen, setIsOpen] = useState(false)

  const navLinks = [
    { href: "/", label: "Trang Chủ" },
    { href: "/menu", label: "Thực Đơn" },
    { href: "/about", label: "Giới Thiệu" },
    { href: "/track-order", label: "Theo Dõi Đơn" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 md:h-20 items-center justify-between px-4 md:px-6">
{/* Logo */}
<Link href="/" className="flex items-center">
  <img
    src="/images/header-logo.png"
    alt="Logo Cung Hỷ Phát Tài"
    className="object-contain w-16 h-16 sm:w-24 sm:h-24 md:w-36 md:h-36 max-w-full"
  />
</Link>




        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2 md:gap-3">
          <Button variant="ghost" size="sm" className="hidden gap-2 md:flex" asChild>
            <a href="tel:091 588 58 88">
              <Phone className="h-4 w-4" />
              <span>091 588 58 88</span>
            </a>
          </Button>

          <Button variant="ghost" size="icon" className="relative h-10 w-10 md:h-11 md:w-11" asChild>
            <Link href="/cart">
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                  {itemCount}
                </span>
              )}
            </Link>
          </Button>

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="h-10 w-10">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full p-0 sm:max-w-full">
              {/* Header */}
              <div className="flex items-center justify-between border-b px-6 py-5">
                <Link href="/" className="flex items-center gap-2.5" onClick={() => setIsOpen(false)}>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary shrink-0">
                    <span className="text-xl font-bold text-primary-foreground">恭</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-base font-bold leading-none text-foreground">Cung Hỷ Phát Tài</span>
                    <span className="text-xs text-muted-foreground mt-0.5">Ẩm Thực Trung Hoa</span>
                  </div>
                </Link>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-10 w-10">
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Navigation Links */}
              <nav className="flex flex-col px-6 py-8">
                {navLinks.map((link, index) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="group flex items-center justify-between border-b py-5 transition-colors hover:text-primary"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <span className="text-2xl font-medium tracking-tight">{link.label}</span>
                    <svg
                      className="h-6 w-6 transition-transform group-hover:translate-x-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                ))}
              </nav>

              {/* Contact Info */}
              <div className="mt-auto border-t px-6 py-6">
                <a
                  href="tel:091 588 58 88"
                  className="flex items-center gap-3 text-lg font-medium hover:text-primary transition-colors"
                >
                  <Phone className="h-5 w-5" />
                  <span>091 588 58 88</span>
                </a>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
