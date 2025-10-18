"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Flame } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import type { Product, ProductVariant } from "@/lib/types"

interface MenuCardProps {
  product: Product
}

export function MenuCard({ product }: MenuCardProps) {
  const { addItem } = useCart()
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    product.variants && product.variants.length > 0 ? product.variants[0] : null,
  )

  const productId = product.id

  const handleAddToCart = () => {
    if (product.variants && product.variants.length > 0 && !selectedVariant) return

    addItem({
      id: productId,
      product: product,
      quantity: 1,
      variant: selectedVariant
        ? {
            id: selectedVariant.id,
            name: selectedVariant.name,
            price: selectedVariant.price,
          }
        : undefined,
    })
  }

  const displayPrice = selectedVariant ? selectedVariant.price : (product.price || 0)

  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-lg">
      <div className="relative h-48 w-full">
        <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
        {product.featured && <Badge className="absolute right-2 top-2 bg-primary">Đặc biệt</Badge>}
      </div>

      <CardHeader>
        {/* Title responsive */}
        <CardTitle className="font-serif text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 leading-snug">
          {product.name}
        </CardTitle>

        {/* English name nhỏ hơn và nhẹ hơn */}
        <CardDescription className="text-xs sm:text-sm text-gray-500">{product.nameEn}</CardDescription>
      </CardHeader>

      <CardContent>
        <p className="mb-4 text-sm text-muted-foreground">{product.description}</p>

        {product.spicyLevel && product.spicyLevel > 0 && (
          <div className="mb-2 flex items-center gap-1">
            {Array.from({ length: product.spicyLevel }).map((_, i) => (
              <Flame key={i} className="h-4 w-4 fill-destructive text-destructive" />
            ))}
          </div>
        )}

        {product.variants && product.variants.length > 0 && (
          <div className="mb-4 space-y-2">
            <Label className="text-sm font-medium">Chọn loại:</Label>
            <RadioGroup
              value={selectedVariant?.id}
              onValueChange={(value) => {
                const variant = product.variants?.find((v) => v.id === value)
                setSelectedVariant(variant || null)
              }}
            >
              {product.variants.map((variant) => (
                <div key={variant.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={variant.id} id={`variant-${variant.id}`} disabled={!variant.available} />
                  <Label
                    htmlFor={`variant-${variant.id}`}
                    className="flex flex-1 cursor-pointer items-center justify-between text-sm"
                  >
                    <span>{variant.name}</span>
                    <span className="font-semibold text-primary">{variant.price.toLocaleString("vi-VN")}đ</span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        )}

        {displayPrice > 0 && (
          <p className="text-xl sm:text-2xl font-bold text-primary">{displayPrice.toLocaleString("vi-VN")}đ</p>
        )}
      </CardContent>

      <CardFooter>
        <Button
          onClick={handleAddToCart}
          className="w-full"
          disabled={!product.available || (product.variants && product.variants.length > 0 && !selectedVariant)}
        >
          {product.available ? "Thêm vào giỏ" : "Hết hàng"}
        </Button>
      </CardFooter>
    </Card>
  )
}
