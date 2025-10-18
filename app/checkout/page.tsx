"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { useCartStore } from "@/lib/cart-store"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

export default function CheckoutPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { items, getTotal, clearCart } = useCartStore()

  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    deliveryAddress: "",
    paymentMethod: "cash" as "cash" | "card" | "online",
    specialInstructions: "",
  })

  const subtotal = getTotal()
  const deliveryFee = subtotal >= 200000 ? 0 : 20000
  const total = subtotal + deliveryFee

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (items.length === 0) {
      toast({
        title: "Giỏ hàng trống",
        description: "Vui lòng thêm món ăn vào giỏ hàng",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          items,
          subtotal,
          deliveryFee,
          total,
        }),
      })

      const data = await response.json()

      if (data.success) {
        clearCart()
        toast({
          title: "Đặt hàng thành công!",
          description: `Mã đơn hàng: ${data.data.id}`,
        })
        router.push(`/orders/${data.data.id}`)
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể đặt hàng. Vui lòng thử lại.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <h2 className="mb-2 text-2xl font-bold">Giỏ hàng trống</h2>
            <p className="mb-6 text-muted-foreground">Vui lòng thêm món ăn vào giỏ hàng trước khi thanh toán</p>
            <Button onClick={() => router.push("/menu")}>Xem thực đơn</Button>
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
          <h1 className="mb-8 text-3xl font-bold">Thanh Toán</h1>

          <form onSubmit={handleSubmit}>
            <div className="grid gap-8 lg:grid-cols-3">
              {/* Checkout Form */}
              <div className="lg:col-span-2">
                <div className="space-y-6">
                  {/* Customer Information */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Thông Tin Khách Hàng</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="name">
                            Họ và tên <span className="text-destructive">*</span>
                          </Label>
                          <Input
                            id="name"
                            placeholder="Nguyễn Văn A"
                            required
                            value={formData.customerName}
                            onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">
                            Số điện thoại <span className="text-destructive">*</span>
                          </Label>
                          <Input
                            id="phone"
                            type="tel"
                            placeholder="091 588 58 88"
                            required
                            value={formData.customerPhone}
                            onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email (tùy chọn)</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="email@example.com"
                          value={formData.customerEmail}
                          onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Delivery Address */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Địa Chỉ Giao Hàng</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="address">
                          Địa chỉ chi tiết <span className="text-destructive">*</span>
                        </Label>
                        <Textarea
                          id="address"
                          placeholder="Số nhà, tên đường, phường/xã, quận/huyện, thành phố"
                          required
                          rows={3}
                          value={formData.deliveryAddress}
                          onChange={(e) => setFormData({ ...formData, deliveryAddress: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="instructions">Ghi chú giao hàng (tùy chọn)</Label>
                        <Textarea
                          id="instructions"
                          placeholder="Ví dụ: Gọi trước khi giao, để ở bảo vệ..."
                          rows={2}
                          value={formData.specialInstructions}
                          onChange={(e) => setFormData({ ...formData, specialInstructions: e.target.value })}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Payment Method */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Phương Thức Thanh Toán</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <RadioGroup
                        value={formData.paymentMethod}
                        onValueChange={(value) =>
                          setFormData({ ...formData, paymentMethod: value as "cash" | "card" | "online" })
                        }
                      >
                        <div className="flex items-center space-x-2 rounded-lg border p-4">
                          <RadioGroupItem value="cash" id="cash" />
                          <Label htmlFor="cash" className="flex-1 cursor-pointer">
                            <div className="font-medium">Tiền mặt</div>
                            <div className="text-sm text-muted-foreground">Thanh toán khi nhận hàng</div>
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2 rounded-lg border p-4">
                          <RadioGroupItem value="card" id="card" />
                          <Label htmlFor="card" className="flex-1 cursor-pointer">
                            <div className="font-medium">Thẻ tín dụng/ghi nợ</div>
                            <div className="text-sm text-muted-foreground">Thanh toán bằng thẻ khi nhận hàng</div>
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2 rounded-lg border p-4">
                          <RadioGroupItem value="online" id="online" />
                          <Label htmlFor="online" className="flex-1 cursor-pointer">
                            <div className="font-medium">Chuyển khoản</div>
                            <div className="text-sm text-muted-foreground">Chuyển khoản ngân hàng</div>
                          </Label>
                        </div>
                      </RadioGroup>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <Card className="sticky top-20">
                  <CardHeader>
                    <CardTitle>Đơn Hàng</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Order Items */}
                    <div className="space-y-3">
                      {items.map((item) => (
                        <div key={item.product.id} className="flex justify-between text-sm">
                          <div className="flex-1">
                            <div className="font-medium">{item.product.name}</div>
                            <div className="text-muted-foreground">x{item.quantity}</div>
                          </div>
                          <div className="font-medium">{formatPrice(item.product.price * item.quantity)}</div>
                        </div>
                      ))}
                    </div>

                    <Separator />

                    {/* Pricing */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Tạm tính</span>
                        <span className="font-medium">{formatPrice(subtotal)}</span>
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
                    </div>

                    <Separator />

                    <div className="flex justify-between">
                      <span className="font-semibold">Tổng cộng</span>
                      <span className="text-xl font-bold text-primary">{formatPrice(total)}</span>
                    </div>

                    <Button type="submit" className="w-full" size="lg" disabled={loading}>
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Đang xử lý...
                        </>
                      ) : (
                        "Đặt hàng"
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  )
}
