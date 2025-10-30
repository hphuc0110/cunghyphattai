"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Card, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ShoppingCart, Flame } from "lucide-react"
import type { Product, ProductVariant } from "@/lib/types"
import { useCartStore } from "@/lib/cart-store"
import { useToast } from "@/hooks/use-toast"

interface ProductCardProps {
  product: Product
  backImage?: string
}

export function ProductCard({ product, backImage }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem)
  const { toast } = useToast()
  const [mounted, setMounted] = useState(false)
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    product.variants?.[0] || null
  )

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (product.variants && product.variants.length > 0 && !selectedVariant) {
      toast({
        title: "Lỗi",
        description: "Vui lòng chọn phân loại sản phẩm",
        variant: "destructive",
      })
      return
    }

    addItem({
      id: product.id,
      product,
      quantity: 1,
      variant: selectedVariant
        ? {
            id: selectedVariant.id,
            name: selectedVariant.name,
            price: selectedVariant.price,
          }
        : undefined,
    })

    toast({
      title: "Đã thêm vào giỏ hàng",
      description: `${product.name}${
        selectedVariant ? ` (${selectedVariant.name})` : ""
      } đã được thêm vào giỏ hàng`,
    })
  }

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price)

  const displayPrice = selectedVariant
    ? selectedVariant.price
    : product.price || 0

  const isMarketPrice =
    displayPrice === 0 || displayPrice === null || displayPrice === undefined

  return (
    <Card className="group h-full overflow-hidden rounded-2xl border border-gray-100 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl bg-white">
      {/* Hình ảnh sản phẩm */}
      <div
        className="relative w-full aspect-[4/5] overflow-hidden rounded-t-2xl bg-cover bg-center"
        style={backImage ? { backgroundImage: `url(${backImage})` } : {}}
      >
        <Image
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          width={400}
          height={500}
          className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
          decoding="async"
          fetchPriority="low"
        />

        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-black/5 to-transparent opacity-80" />

        {/* Badge "Hết hàng" */}
        {!product.available && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60">
            <Badge variant="secondary" className="text-sm font-semibold">
              Hết hàng
            </Badge>
          </div>
        )}

        {/* Badge "Nổi bật" */}
        {product.featured && (
          <Badge className="absolute left-3 top-3 bg-primary text-white font-semibold text-xs shadow-md">
            Nổi bật
          </Badge>
        )}

        {/* Badge "Độ cay" */}
        {Number(product.spicyLevel) > 0 && (
          <Badge
            variant="destructive"
            className="absolute right-3 top-3 gap-1 font-semibold text-xs shadow-md"
          >
            <Flame className="h-3 w-3" />
            {Number(product.spicyLevel) > 3 ? "Rất cay" : "Cay"}
          </Badge>
        )}
      </div>

      {/* Nội dung */}
      <CardFooter className="flex flex-col items-center text-center gap-3 px-3 py-4">
        {/* Tên sản phẩm */}
        <h3 className="!text-xs sm:!text-sm md:!text-base font-medium leading-snug line-clamp-2 text-gray-800 min-h-[2.5rem] text-center">
          {product.name}
        </h3>

        {/* Phân loại sản phẩm */}
        {product.variants && product.variants.length > 0 && (
          <>
            {mounted ? (
              <div className="w-full space-y-2">
                <p className="text-xs font-medium text-gray-600 mb-1">
                  Chọn phân loại:
                </p>
                <Select
                  value={selectedVariant?.id || selectedVariant?._id || ""}
                  onValueChange={(value) => {
                    const variant = product.variants?.find(
                      (v) => (v.id || v._id) === value
                    )
                    if (variant) {
                      const variantId = variant.id || variant._id
                      setSelectedVariant({ ...variant, id: variantId })
                    }
                  }}
                >
                  <SelectTrigger className="w-full h-8 text-xs">
                    <SelectValue placeholder="Chọn phân loại" />
                  </SelectTrigger>
                  <SelectContent>
                    {product.variants?.map((variant) => {
                      const variantId = variant.id || variant._id
                      return (
                        <SelectItem
                          key={variantId}
                          value={variantId}
                          disabled={!variant.available}
                          className="text-xs"
                        >
                          <div className="flex items-center justify-between w-full">
                            <span>{variant.name}</span>
                            <span
                              className={`ml-2 font-semibold ${
                                variant.price === 0 ||
                                variant.price === null ||
                                variant.price === undefined
                                  ? "text-orange-600"
                                  : "text-primary"
                              }`}
                            >
                              {variant.price === 0 ||
                              variant.price === null ||
                              variant.price === undefined
                                ? "Theo thời giá"
                                : formatPrice(variant.price)}
                            </span>
                          </div>
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <div className="space-y-2 w-full">
                <p className="text-xs font-medium text-gray-600 mb-1">
                  Chọn phân loại:
                </p>
                <div className="w-full h-8 bg-gray-100 rounded-md animate-pulse"></div>
              </div>
            )}
          </>
        )}

        {/* Giá và nút thêm */}
        <div className="flex flex-col items-center text-center gap-2 mt-auto w-full">
          {isMarketPrice ? (
            <span className="text-sm sm:text-base md:text-lg font-bold text-orange-600">
              Theo thời giá
            </span>
          ) : (
            <span className="text-sm sm:text-base md:text-lg font-bold text-primary">
              {formatPrice(displayPrice)}
            </span>
          )}

          <Button
            onClick={handleAddToCart}
            disabled={
              !product.available ||
              (product.variants && product.variants.length > 0 && !selectedVariant)
            }
            className="h-8 md:h-9 px-3 text-xs md:text-sm font-semibold gap-1.5 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-white shadow-md transition-all duration-200"
          >
            <ShoppingCart className="h-3 w-3 md:h-4 md:w-4" />
            <span className="hidden sm:inline">Thêm vào giỏ</span>
            <span className="sm:hidden">Thêm</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
