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
import { Minus, Plus, ShoppingCart, Flame, ArrowLeft } from "lucide-react"
import type { Product } from "@/lib/types"
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

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`/api/products/${params.id}`)
        const data = await res.json()
        if (data.success) {
          setProduct(data.data)
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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price)
  }

  const handleAddToCart = () => {
    if (!product) return

    addItem(product, quantity, specialInstructions)
    toast({
      title: "Đã thêm vào giỏ hàng",
      description: `${quantity} x ${product.name} đã được thêm vào giỏ hàng`,
    })
    router.push("/cart")
  }

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          <div className="container py-8">
            <div className="grid gap-8 lg:grid-cols-2">
              <div className="aspect-square animate-pulse rounded-lg bg-muted" />
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

  if (!product) {
    return null
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <div className="container py-8">
          {/* Back Button */}
          <Button variant="ghost" className="mb-6 gap-2" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
            Quay lại
          </Button>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Product Image */}
            <div className="relative aspect-square overflow-hidden rounded-lg">
              <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
              {!product.available && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <Badge variant="secondary" className="text-lg">
                    Hết hàng
                  </Badge>
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="flex flex-col gap-6">
            <div>
            <div className="mb-3 flex flex-wrap items-center gap-2">
    {product.featured && (
      <Badge className="bg-secondary text-secondary-foreground">Nổi bật</Badge>
    )}

    {product.spicyLevel && product.spicyLevel > 0 && (
      <Badge variant="destructive" className="gap-1">
        <Flame className="h-3 w-3" />
        {product.spicyLevel > 3 ? "Rất cay" : "Cay"}
      </Badge>
    )}
    {Array.isArray(product.tags) && product.tags.length > 0 &&
      product.tags.map((tag: string) => (
        <Badge key={tag} variant="outline">
          {tag}
        </Badge>
      ))
    }
  </div>

  <h1 className="mb-2 text-3xl font-bold text-balance md:text-4xl">{product.name}</h1>
  <p className="text-lg text-muted-foreground">{product.nameEn}</p>
</div>

              <Card>
                <CardContent className="p-6">
                  <p className="text-muted-foreground text-pretty">{product.description}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{product.descriptionEn}</p>
                </CardContent>
              </Card>

              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-primary">{formatPrice(product.price)}</span>
                <span className="text-sm text-muted-foreground">/ phần</span>
              </div>

              {/* Quantity Selector */}
              <div>
                <label className="mb-2 block text-sm font-medium">Số lượng</label>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={!product.available}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center text-lg font-semibold">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
                    disabled={!product.available}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Special Instructions */}
              <div>
                <label className="mb-2 block text-sm font-medium">Ghi chú đặc biệt (tùy chọn)</label>
                <Textarea
                  placeholder="Ví dụ: Không hành, ít cay, thêm rau..."
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  disabled={!product.available}
                  rows={3}
                />
              </div>

              {/* Add to Cart */}
              <div className="flex flex-col gap-3">
                <Button size="lg" className="gap-2" onClick={handleAddToCart} disabled={!product.available}>
                  <ShoppingCart className="h-5 w-5" />
                  Thêm vào giỏ hàng - {formatPrice(product.price * quantity)}
                </Button>
                {!product.available && (
                  <p className="text-center text-sm text-muted-foreground">Món này hiện hết hàng</p>
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
