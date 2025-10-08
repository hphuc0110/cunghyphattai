"use client"

import type React from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Flame } from "lucide-react"
import type { Product } from "@/lib/types"
import { useCartStore } from "@/lib/cart-store"
import { useToast } from "@/hooks/use-toast"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem)
  const { toast } = useToast()

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem(product, 1)
    toast({
      title: "Đã thêm vào giỏ hàng",
      description: `${product.name} đã được thêm vào giỏ hàng`,
    })
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price)
  }

  return (
    <Link href={`/products/${product.id}`}>
      <Card className="group h-full overflow-hidden transition-all hover:shadow-lg">
        <CardContent className="p-0">
          <div className="relative aspect-square overflow-hidden">
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
            />
            {!product.available && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <Badge variant="secondary" className="text-xs md:text-sm font-semibold">
                  Hết hàng
                </Badge>
              </div>
            )}
            {product.featured && (
              <Badge className="absolute left-2 top-2 bg-secondary text-secondary-foreground font-semibold text-xs">
                Nổi bật
              </Badge>
            )}
{Number(product.spicyLevel) > 0 && (
  <Badge variant="destructive" className="absolute right-2 top-2 gap-1 font-semibold text-xs">
    <Flame className="h-3 w-3" />
    {Number(product.spicyLevel) > 3 ? "Rất cay" : "Cay"}
  </Badge>
)}

          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-start gap-3 md:gap-3.5 p-3 md:p-4">
          <div className="w-full">
            <h3 className="text-sm md:text-base font-bold leading-tight text-balance line-clamp-2">{product.name}</h3>
            <p className="text-xs md:text-sm text-muted-foreground font-medium mt-0.5 line-clamp-1">{product.nameEn}</p>
          </div>
          <p className="line-clamp-2 text-xs md:text-sm text-muted-foreground text-pretty leading-relaxed min-h-[2rem] md:min-h-[2.5rem]">
            {product.description}
          </p>
          <div className="flex w-full flex-col gap-2.5 md:gap-3">
            <div className="flex items-center justify-between">
              <span className="text-base md:text-lg lg:text-xl font-bold text-primary">
                {formatPrice(product.price)}
              </span>
            </div>
            <Button
              size="default"
              onClick={handleAddToCart}
              disabled={!product.available}
              className="w-full gap-2 font-semibold h-9 md:h-10 text-sm"
            >
              <ShoppingCart className="h-3.5 w-3.5 md:h-4 md:w-4" />
              Thêm vào giỏ
            </Button>
          </div>
        </CardFooter>
      </Card>
    </Link>
  )
}
