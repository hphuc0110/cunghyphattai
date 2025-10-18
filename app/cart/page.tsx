"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react"
import { useCartStore } from "@/lib/cart-store"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function CartPage() {
  const router = useRouter()
  const { items, updateQuantity, removeItem, getTotal } = useCartStore()

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price)
  }

  const subtotal = getTotal()
  const hasMarketPriceItems = items.some(item => {
    const itemPrice = item.variant?.price || item.product.price || 0
    return itemPrice === 0 || itemPrice === null || itemPrice === undefined
  })
  const deliveryFee = subtotal >= 200000 ? 0 : 20000
  const total = subtotal + deliveryFee

  if (items.length === 0) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <div className="mb-4 flex justify-center">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-muted">
                <ShoppingBag className="h-12 w-12 text-muted-foreground" />
              </div>
            </div>
            <h2 className="mb-2 text-2xl font-bold">Giỏ hàng trống</h2>
            <p className="mb-6 text-muted-foreground">Bạn chưa có món ăn nào trong giỏ hàng</p>
            <Button asChild>
              <Link href="/menu">Xem thực đơn</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <div className="container py-8">
          <h1 className="mb-8 text-3xl font-bold">Giỏ Hàng</h1>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    {items.map((item, index) => (
                      <div key={item.product.id}>
                        {index > 0 && <Separator className="my-6" />}
                        <div className="flex gap-4">
                          {/* Product Image */}
                          <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg">
                            <Image
                              src={item.product.image || "/placeholder.svg"}
                              alt={item.product.name}
                              fill
                              className="object-cover"
                            />
                          </div>

                          {/* Product Info */}
                          <div className="flex flex-1 flex-col gap-2">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <h3 className="font-semibold leading-tight">{item.product.name}</h3>
                                <p className="text-sm text-muted-foreground">{item.product.nameEn}</p>
                                {item.variant && (
                                  <p className="text-sm text-primary font-medium">{item.variant.name}</p>
                                )}
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive"
                                onClick={() => removeItem(item.id, item.variant?.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>

                            {item.specialInstructions && (
                              <p className="text-sm text-muted-foreground">Ghi chú: {item.specialInstructions}</p>
                            )}

                            <div className="flex items-center justify-between">
                              {/* Quantity Controls */}
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8 bg-transparent"
                                  onClick={() => updateQuantity(item.id, item.quantity - 1, item.variant?.id)}
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8 bg-transparent"
                                  onClick={() => updateQuantity(item.id, item.quantity + 1, item.variant?.id)}
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>

                              {/* Price */}
                              <div className="text-right">
                                {(() => {
                                  const itemPrice = item.variant?.price || item.product.price || 0
                                  const isMarketPrice = itemPrice === 0 || itemPrice === null || itemPrice === undefined
                                  
                                  if (isMarketPrice) {
                                    return (
                                      <>
                                        <div className="font-semibold text-orange-600">
                                          Theo thời giá
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                          x {item.quantity}
                                        </div>
                                      </>
                                    )
                                  } else {
                                    return (
                                      <>
                                        <div className="font-semibold text-primary">
                                          {formatPrice(itemPrice * item.quantity)}
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                          {formatPrice(itemPrice)} x {item.quantity}
                                        </div>
                                      </>
                                    )
                                  }
                                })()}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-20">
                <CardContent className="p-6">
                  <h2 className="mb-4 text-lg font-semibold">Tóm Tắt Đơn Hàng</h2>

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tạm tính</span>
                      <span className="font-medium">
                        {hasMarketPriceItems ? (
                          <span className="text-orange-600">Có món theo thời giá</span>
                        ) : (
                          formatPrice(subtotal)
                        )}
                      </span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Phí giao hàng</span>
                      <span className="font-medium">
                        {deliveryFee === 0 ? (
                          <span className="text-green-600">Miễn phí</span>
                        ) : (
                          formatPrice(deliveryFee)
                        )}
                      </span>
                    </div>

                    {subtotal < 200000 && (
                      <div className="rounded-lg bg-secondary/50 p-3 text-xs text-secondary-foreground">
                        Mua thêm {formatPrice(200000 - subtotal)} để được miễn phí ship
                      </div>
                    )}

                    <Separator />

                    <div className="flex justify-between">
                      <span className="font-semibold">Tổng cộng</span>
                      <span className="text-xl font-bold text-primary">
                        {hasMarketPriceItems ? (
                          <span className="text-orange-600">Theo thời giá</span>
                        ) : (
                          formatPrice(total)
                        )}
                      </span>
                    </div>
                  </div>

                  <Button className="mt-6 w-full gap-2" size="lg" onClick={() => router.push("/checkout")}>
                    Thanh toán
                    <ArrowRight className="h-4 w-4" />
                  </Button>

                  <Button variant="outline" className="mt-3 w-full bg-transparent" asChild>
                    <Link href="/menu">Tiếp tục mua hàng</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
