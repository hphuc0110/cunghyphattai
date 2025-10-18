"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Minus, Plus, ShoppingCart, Flame, ArrowLeft } from "lucide-react"
import type { Product, ProductVariant } from "@/lib/types"
import { useCartStore } from "@/lib/cart-store"
import { useToast } from "@/hooks/use-toast"

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const addItem = useCartStore((state) => state.addItem)

  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [specialInstructions, setSpecialInstructions] = useState("")
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null)

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`/api/products/${params.id}`)
        const data = await res.json()
        if (data.success) {
          setProduct(data.data)
          // Set default variant if product has variants
          if (data.data.variants && data.data.variants.length > 0) {
            setSelectedVariant(data.data.variants[0])
          }
        } else {
          toast({
            title: "Lỗi",
            description: "Không tìm thấy món ăn",
            variant: "destructive",
          })
          router.push("/menu")
        }
      } catch (error) {
        console.error("Failed to fetch product:", error)
        toast({
          title: "Lỗi",
          description: "Không thể tải thông tin món ăn",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [params.id, router, toast])

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price)

  const handleAddToCart = () => {
    if (!product) return
    
    // Check if product has variants but no variant is selected
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
      product: product,
      quantity: quantity,
      specialInstructions: specialInstructions,
      variant: selectedVariant ? {
        id: selectedVariant.id,
        name: selectedVariant.name,
        price: selectedVariant.price,
      } : undefined,
    })
    
    toast({
      title: "Đã thêm vào giỏ hàng",
      description: `${quantity} x ${product.name}${selectedVariant ? ` (${selectedVariant.name})` : ''} đã được thêm vào giỏ hàng`,
    })
    router.push("/cart")
  }

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-white">
        <Header />
        <main className="flex-1">
          <div className="container py-8">
            <div className="grid gap-8 lg:grid-cols-2">
              <div className="aspect-square animate-pulse rounded-2xl bg-muted" />
              <div className="space-y-4">
                <div className="h-8 w-3/4 animate-pulse rounded bg-muted" />
                <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
                <div className="h-24 animate-pulse rounded bg-muted" />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!product) return null

  return (
    <div className="flex min-h-screen flex-col bg-white text-gray-900">
      <Header />

      <main className="flex-1">
        <div className="container py-8">
          {/* Nút quay lại */}
          <Button
            variant="ghost"
            className="mb-6 gap-2 hover:translate-x-[-4px] transition-transform"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4" />
            Quay lại
          </Button>

          <div className="grid gap-10 lg:grid-cols-2">
            {/* Ảnh món ăn */}
            <div className="relative aspect-square overflow-hidden rounded-2xl shadow-md group bg-white">
  {/* Ảnh back cho tất cả card */}
  <Image
    src="/images/back-mon.jpg" // ảnh back chung cho tất cả card
    alt="Card back"
    fill
    className="object-cover opacity-90" // chỉnh opacity tuỳ ý
  />

  {/* Ảnh front */}
  <Image
    src={product.image || "/placeholder.svg"}
    alt={product.name}
    fill
    className="object-cover transition-transform duration-500 group-hover:scale-105 relative z-10"
  />

  {/* Badge hết hàng */}
  {!product.available && (
    <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-20">
      <Badge variant="secondary" className="text-lg px-4 py-2 rounded-full">
        Hết hàng
      </Badge>
    </div>
  )}
</div>


            {/* Thông tin sản phẩm */}
            <div className="flex flex-col gap-6">
              <div>
              <div className="mb-3 flex flex-wrap items-center gap-2">
              {/* Badge Nổi bật */}
                 {product.featured === true && (
                     <Badge className="bg-primary/15 text-primary font-medium">
                              Nổi bật
                       </Badge>
      )}

            {/* Badge Độ cay */}
            {typeof product.spicyLevel === "number" && product.spicyLevel > 0 && (
           <Badge variant="destructive" className="gap-1">
             <Flame className="h-3 w-3" />
             {product.spicyLevel > 3 ? "Rất cay" : "Cay"}
           </Badge>
          )}

          {/* Badge Tags */}
               {Array.isArray(product.tags) &&
                  product.tags.length > 0 &&
              product.tags.map((tag: string) => (
              <Badge key={tag} variant="outline">
              {tag}
           </Badge>
         ))}
    </div>


                <h1 className="text-3xl md:text-4xl font-bold text-balance">{product.name}</h1>
                <p className="text-lg text-muted-foreground italic">{product.nameEn}</p>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-primary">
                  {formatPrice(selectedVariant ? selectedVariant.price : (product.price || 0))}
                </span>
                <span className="text-sm text-muted-foreground">/ phần</span>
              </div>

              {/* Variant Selection */}
              {product.variants && product.variants.length > 0 && (
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Chọn phân loại:</Label>
                  <RadioGroup
                    value={selectedVariant?.id}
                    onValueChange={(value) => {
                      const variant = product.variants?.find((v) => v.id === value)
                      setSelectedVariant(variant || null)
                    }}
                  >
                    {product.variants.map((variant) => (
                      <div key={variant.id} className="flex items-center space-x-3">
                        <RadioGroupItem 
                          value={variant.id} 
                          id={`variant-${variant.id}`} 
                          disabled={!variant.available} 
                        />
                        <Label
                          htmlFor={`variant-${variant.id}`}
                          className="flex flex-1 cursor-pointer items-center justify-between text-sm"
                        >
                          <span>{variant.name}</span>
                          <span className="font-semibold text-primary">{formatPrice(variant.price)}</span>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              )}

              {/* Chọn số lượng */}
              <div>
                <label className="mb-2 block text-sm font-medium">Số lượng</label>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={!product.available}
                    className="border-gray-300 hover:bg-gray-100"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center text-lg font-semibold">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
                    disabled={!product.available}
                    className="border-gray-300 hover:bg-gray-100"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Ghi chú */}
              <div>
                <label className="mb-2 block text-sm font-medium">Ghi chú đặc biệt (tùy chọn)</label>
                <Textarea
                  placeholder="Ví dụ: Không hành, ít cay, thêm rau..."
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  disabled={!product.available}
                  rows={3}
                  className="resize-none border-gray-300 focus:ring-primary/40"
                />
              </div>

              {/* Nút thêm vào giỏ */}
              <div className="flex flex-col gap-3">
                <Button
                  size="lg"
                  className="gap-2 bg-primary hover:bg-primary/90 text-white shadow-md"
                  onClick={handleAddToCart}
                  disabled={!product.available || (product.variants && product.variants.length > 0 && !selectedVariant)}
                >
                  <ShoppingCart className="h-5 w-5" />
                  Thêm vào giỏ hàng – {formatPrice((selectedVariant ? selectedVariant.price : (product.price || 0)) * quantity)}
                </Button>
                {!product.available && (
                  <p className="text-center text-sm text-muted-foreground">
                    Món này hiện hết hàng
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
