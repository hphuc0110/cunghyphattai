"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useCart } from "@/lib/cart-context"
import { ordersApi } from "@/lib/api"

export function CheckoutForm() {
  const router = useRouter()
  const { items, total, clearCart } = useCart()

  const [formData, setFormData] = useState({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    deliveryAddress: "",
    paymentMethod: "cash",
    specialInstructions: "",
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const orderData = {
        ...formData,
        items: items.map((item) => ({
          product: { _id: item.id },
          quantity: item.quantity,
          specialInstructions: item.specialInstructions,
          variant: item.variant,
        })),
        deliveryFee: 20000,
      }

      const response = await ordersApi.create(orderData)

      if (!response.success) {
        setError(response.error || "Failed to create order")
        setLoading(false)
        return
      }

      // Clear cart and redirect to success page
      clearCart()
      router.push(`/order-success?orderId=${response.data.orderId}`)
    } catch (error) {
      console.error("[v0] Error creating order:", error)
      setError("An error occurred. Please try again.")
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <div className="bg-destructive/10 text-destructive p-4 rounded-lg">{error}</div>}

      {/* ... existing form fields ... */}

      <Card>
        <CardHeader>
          <CardTitle>Thông tin khách hàng</CardTitle>
          <CardDescription>Vui lòng điền đầy đủ thông tin</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="customerName">Họ và tên *</Label>
            <Input
              id="customerName"
              name="customerName"
              value={formData.customerName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="customerPhone">Số điện thoại *</Label>
            <Input
              id="customerPhone"
              name="customerPhone"
              type="tel"
              value={formData.customerPhone}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="customerEmail">Email</Label>
            <Input
              id="customerEmail"
              name="customerEmail"
              type="email"
              value={formData.customerEmail}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="deliveryAddress">Địa chỉ giao hàng *</Label>
            <Textarea
              id="deliveryAddress"
              name="deliveryAddress"
              value={formData.deliveryAddress}
              onChange={handleChange}
              required
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Phương thức thanh toán</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={formData.paymentMethod}
            onValueChange={(value) => setFormData({ ...formData, paymentMethod: value })}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="cash" id="cash" />
              <Label htmlFor="cash">Tiền mặt khi nhận hàng</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="bank_transfer" id="bank_transfer" />
              <Label htmlFor="bank_transfer">Chuyển khoản ngân hàng</Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Ghi chú</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            name="specialInstructions"
            placeholder="Ghi chú đặc biệt cho đơn hàng..."
            value={formData.specialInstructions}
            onChange={handleChange}
          />
        </CardContent>
      </Card>

      <Button type="submit" size="lg" className="w-full" disabled={loading || items.length === 0}>
        {loading ? "Đang xử lý..." : `Đặt hàng - ${total.toLocaleString("vi-VN")}đ`}
      </Button>
    </form>
  )
}
