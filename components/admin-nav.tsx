"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, ShoppingBag, Package, Home } from "lucide-react"
import { Button } from "@/components/ui/button"

export function AdminNav() {
  const pathname = usePathname()

  const navItems = [
    {
      title: "Tổng Quan",
      href: "/admin",
      icon: LayoutDashboard,
    },
    {
      title: "Đơn Hàng",
      href: "/admin/orders",
      icon: ShoppingBag,
    },
    {
      title: "Sản Phẩm",
      href: "/admin/products",
      icon: Package,
    },
    {
      title: "Danh Mục",
      href: "/admin/categories",
      icon: LayoutDashboard,
    },
  ]

  return (
    <div className="flex h-full flex-col border-r bg-muted/50">
      <div className="border-b p-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
            <span className="text-xl font-bold text-primary-foreground">恭</span>
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold leading-none text-primary">Admin</span>
            <span className="text-xs text-muted-foreground">Cung Hỷ Phát Tài</span>
          </div>
        </Link>
      </div>

      <nav className="flex-1 space-y-2 p-4">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive ? "default" : "ghost"}
                className={cn("w-full justify-start gap-2", !isActive && "hover:bg-muted")}
              >
                <Icon className="h-4 w-4" />
                {item.title}
              </Button>
            </Link>
          )
        })}
      </nav>

      <div className="border-t p-4">
        <Button variant="outline" className="w-full gap-2 bg-transparent" asChild>
          <Link href="/">
            <Home className="h-4 w-4" />
            Về Trang Chủ
          </Link>
        </Button>
      </div>
    </div>
  )
}
