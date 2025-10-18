"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2 } from "lucide-react"
import { ordersApi } from "@/lib/api"

export default function OrderSuccessPage() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get("orderId")
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchOrder() {
      if (!orderId) {
        setLoading(false)
        return
      }

      try {
        const response = await ordersApi.getById(orderId)
        if (response.success) {
          setOrder(response.data)
        }
      } catch (error) {
        console.error("[v0] Error fetching order:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [orderId])

  if (loading) {
    return (
      <div className="container py-16">
        <div className="max-w-2xl mx-auto">
          <div className="h-64 bg-muted animate-pulse rounded-lg" />
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="container py-16">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="font-serif text-3xl mb-4">Không tìm thấy đơn hàng</h1>
          <Link href="/">
            <Button>Về trang chủ</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-16">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle2 className="h-16 w-16 text-green-500" />
            </div>
            <CardTitle className="font-serif text-3xl">Đặt hàng thành công!</CardTitle>
            <CardDescription>Cảm ơn bạn đã đặt hàng tại Cung Hỷ Phát Tài</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Mã đơn hàng</p>
              <p className="text-2xl font-bold">{order.orderId}</p>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold">Thông tin giao hàng</h3>
              <p>
                <span className="text-muted-foreground">Tên:</span> {order.customerName}
              </p>
              <p>
                <span className="text-muted-foreground">Số điện thoại:</span> {order.customerPhone}
              </p>
              <p>
                <span className="text-muted-foreground">Địa chỉ:</span> {order.deliveryAddress}
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold">Chi tiết đơn hàng</h3>
              {order.items.map((item: any, index: number) => (
                <div key={index} className="flex justify-between">
                  <span>
                    {item.productName} x {item.quantity}
                  </span>
                  <span>{(item.productPrice * item.quantity).toLocaleString("vi-VN")}đ</span>
                </div>
              ))}
              <div className="flex justify-between pt-2 border-t">
                <span>Phí giao hàng</span>
                <span>{order.deliveryFee.toLocaleString("vi-VN")}đ</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t">
                <span>Tổng cộng</span>
                <span className="text-primary">{order.total.toLocaleString("vi-VN")}đ</span>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm">
                Đơn hàng của bạn đang được xử lý. Chúng tôi sẽ liên hệ với bạn sớm nhất để xác nhận đơn hàng.
              </p>
            </div>

            <div className="flex gap-4">
              <Link href="/" className="flex-1">
                <Button variant="outline" className="w-full bg-transparent">
                  Về trang chủ
                </Button>
              </Link>
              <Link href="/menu" className="flex-1">
                <Button className="w-full">Tiếp tục đặt hàng</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
