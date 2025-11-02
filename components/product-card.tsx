"use client"

import { useState, useEffect, memo, useRef } from "react"
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
import { imageCache } from "@/lib/image-cache"

interface ProductCardProps {
  product: Product
  backImage?: string
  priority?: boolean // Ưu tiên load cho ảnh đầu tiên
  index?: number // Index trong grid để xác định priority
}

function ProductCardComponent({ product, backImage, priority = false, index = 0 }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem)
  const { toast } = useToast()
  const [mounted, setMounted] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  // Sử dụng useRef để persist shouldLoad state và tránh re-render
  const shouldLoadRef = useRef(priority || imageCache.isLoaded(product.image || ""))
  const [shouldLoad, setShouldLoad] = useState(priority || imageCache.isLoaded(product.image || ""))
  const imgRef = useRef<HTMLDivElement>(null)
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    product.variants?.[0] || null
  )

  useEffect(() => {
    setMounted(true)
  }, [])

  // Intersection Observer cho lazy loading thông minh - chỉ chạy một lần
  useEffect(() => {
    if (priority || shouldLoad) {
      // Nếu đã priority hoặc shouldLoad, không cần observer
      if (priority) setShouldLoad(true)
      return
    }

    if (!imgRef.current) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !shouldLoadRef.current) {
            shouldLoadRef.current = true
            setShouldLoad(true)
            observer.disconnect()
          }
        })
      },
      {
        rootMargin: "150px", // Tăng lên để load sớm hơn
        threshold: 0.01, // Trigger khi 1% ảnh visible
      },
    )

    const currentRef = imgRef.current
    observer.observe(currentRef)

    return () => {
      observer.disconnect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Chỉ chạy một lần khi mount

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
        ref={imgRef}
        className="relative w-full aspect-[4/5] overflow-hidden rounded-t-2xl bg-cover bg-center bg-gray-100"
        style={backImage ? { backgroundImage: `url(${backImage})` } : {}}
      >
        {shouldLoad || shouldLoadRef.current ? (
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            width={300}
            height={375}
            className={`object-cover w-full h-full transition-opacity duration-300 group-hover:scale-110 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
            loading={priority ? "eager" : "lazy"}
            decoding="async"
            fetchPriority={priority ? "high" : "auto"}
            sizes="(max-width: 640px) 180px, (max-width: 1024px) 240px, 300px"
            quality={priority ? 75 : 60}
            onLoad={() => {
              setImageLoaded(true)
              shouldLoadRef.current = true
              // Cache ảnh đã load để không load lại
              if (product.image) {
                imageCache.markLoaded(product.image)
              }
            }}
            onError={() => {
              // Fallback nếu ảnh lỗi
              setImageLoaded(true)
              shouldLoadRef.current = true
              if (product.image) {
                imageCache.markLoaded(product.image)
              }
            }}
          />
        ) : (
          <div className="w-full h-full bg-gray-200 animate-pulse" />
        )}

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

// Memoize component để tránh re-render không cần thiết
// Chỉ re-render nếu các props quan trọng thay đổi
export const ProductCard = memo(ProductCardComponent, (prevProps, nextProps) => {
  // Return true nếu props giống nhau (không cần re-render)
  // Return false nếu props khác nhau (cần re-render)
  
  // Quick check - nếu là cùng product object, không re-render
  if (prevProps.product === nextProps.product && prevProps.backImage === nextProps.backImage && prevProps.priority === nextProps.priority) {
    return true
  }
  
  // Deep comparison cho các trường quan trọng
  const productChanged = 
    prevProps.product.id !== nextProps.product.id ||
    prevProps.product.image !== nextProps.product.image ||
    prevProps.product.name !== nextProps.product.name ||
    prevProps.product.available !== nextProps.product.available ||
    prevProps.product.price !== nextProps.product.price ||
    prevProps.product.featured !== nextProps.product.featured ||
    prevProps.product.spicyLevel !== nextProps.product.spicyLevel
  
  // Chỉ so sánh variants nếu có
  const variantsChanged = 
    (prevProps.product.variants?.length || 0) !== (nextProps.product.variants?.length || 0) ||
    (prevProps.product.variants && nextProps.product.variants &&
      prevProps.product.variants.some((v, i) => {
        const nextV = nextProps.product.variants?.[i]
        return !nextV || v.id !== nextV.id || v.name !== nextV.name || v.price !== nextV.price
      }))
  
  // Props khác
  const otherPropsChanged = 
    prevProps.backImage !== nextProps.backImage ||
    prevProps.priority !== nextProps.priority
  
  // Chỉ re-render nếu có thay đổi
  return !productChanged && !variantsChanged && !otherPropsChanged
})
