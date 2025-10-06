"use client"

import Image from "next/image"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Flame } from "lucide-react"
import { useCart } from "@/lib/cart-context"

interface MenuCardProps {
  product: any
}

export function MenuCard({ product }: MenuCardProps) {
  const { addItem } = useCart()

  const productId = product._id || product.id

  const handleAddToCart = () => {
    addItem({
      id: productId,
      name: product.name,
      nameEn: product.nameEn,
      price: product.price,
      image: product.image,
      quantity: 1,
    })
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48 w-full">
        <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
        {product.featured && <Badge className="absolute top-2 right-2 bg-primary">Đặc biệt</Badge>}
      </div>
      <CardHeader>
        <CardTitle className="font-serif">{product.name}</CardTitle>
        <CardDescription className="text-sm">{product.nameEn}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">{product.description}</p>
        {product.spicyLevel > 0 && (
          <div className="flex items-center gap-1 mb-2">
            {Array.from({ length: product.spicyLevel }).map((_, i) => (
              <Flame key={i} className="h-4 w-4 text-destructive fill-destructive" />
            ))}
          </div>
        )}
        <p className="text-2xl font-bold text-primary">{product.price.toLocaleString("vi-VN")}đ</p>
      </CardContent>
      <CardFooter>
        <Button onClick={handleAddToCart} className="w-full" disabled={!product.available}>
          {product.available ? "Thêm vào giỏ" : "Hết hàng"}
        </Button>
      </CardFooter>
    </Card>
  )
}
