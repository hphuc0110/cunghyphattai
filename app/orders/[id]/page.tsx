"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CheckCircle2, Clock, Package, Truck, XCircle } from "lucide-react"
import type { Order } from "@/lib/types"

export default function OrderDetailPage() {
  const params = useParams()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchOrder() {
      try {
        const response = await fetch(`/api/orders/${params.id}`)
        const data = await response.json()

        if (data.success) setOrder(data.data)
      } catch (error) {
        console.error("Failed to fetch order:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [params.id])

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price)

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })

  const getStatusInfo = (status: Order["status"]) => {
    const statusMap = {
      pending: { label: "Chờ xác nhận", color: "bg-yellow-500", icon: Clock },
      confirmed: { label: "Đã xác nhận", color: "bg-blue-500", icon: CheckCircle2 },
      preparing: { label: "Đang chuẩn bị", color: "bg-purple-500", icon: Package },
      ready: { label: "Sẵn sàng", color: "bg-green-500", icon: CheckCircle2 },
      delivering: { label: "Đang giao", color: "bg-blue-600", icon: Truck },
      completed: { label: "Hoàn thành", color: "bg-green-600", icon: CheckCircle2 },
      cancelled: { label: "Đã hủy", color: "bg-red-500", icon: XCircle },
    }
    return statusMap[status]
  }

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="h-8 w-48 animate-pulse rounded bg-muted" />
            <div className="h-64 w-80 animate-pulse rounded-xl bg-muted" />
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex flex-1 items-center justify-center">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-foreground">Không tìm thấy đơn hàng</h2>
            <p className="text-muted-foreground">
              Đơn hàng này không tồn tại hoặc đã bị xóa.
            </p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const statusInfo = getStatusInfo(order.status)
  const StatusIcon = statusInfo.icon

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Header />

      <main className="flex-1">
        <div className="container py-10">
          <div className="mx-auto max-w-5xl space-y-8">
            {/* Header đơn hàng */}
            <div className="rounded-2xl bg-white p-6 shadow-sm border">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h1 className="text-2xl font-bold tracking-tight">
                  Đơn hàng #{order.id}
                </h1>
                <Badge className={`${statusInfo.color} text-white px-3 py-1.5 text-sm gap-1`}>
                  <StatusIcon className="h-4 w-4" />
                  {statusInfo.label}
                </Badge>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Đặt hàng lúc: {formatDate(order.createdAt)}
              </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
              {/* Chi tiết món ăn + giao hàng */}
              <div className="space-y-8 lg:col-span-2">
                <Card className="shadow-md border">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">Món ăn đã đặt</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {order.items.map((item, index) => (
                      <div key={index}>
                        {index > 0 && <Separator className="my-4" />}
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <div className="font-medium text-base">
                              {(item.product as any)?.name || item.productName}
                            </div>
                            {(item as any)?.product?.nameEn && (
                              <div className="text-sm text-muted-foreground">
                                {(item.product as any).nameEn}
                              </div>
                            )}
                            {item.specialInstructions && (
                              <div className="text-sm text-muted-foreground italic">
                                Ghi chú: {item.specialInstructions}
                              </div>
                            )}
                            <div className="text-sm text-muted-foreground">
                              Số lượng: {item.quantity}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">
                              {formatPrice(
                                ((item as any)?.product?.price || item.productPrice) *
                                  item.quantity
                              )}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {formatPrice((item as any)?.product?.price || item.productPrice)} ×{" "}
                              {item.quantity}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="shadow-md border rounded-xl overflow-hidden">
  <CardHeader className="bg-gray-50 border-b py-3 px-5">
    <CardTitle className="text-lg font-semibold flex items-center gap-2">
      🚚 Thông tin giao hàng
    </CardTitle>
  </CardHeader>

  <CardContent className="divide-y divide-gray-100 px-5 py-4 text-sm">
    <div className="py-2">
      <p className="text-muted-foreground font-medium">Người nhận</p>
      <p className="font-semibold text-2xl">{order.customerName}</p>
    </div>

    <div className="py-2">
      <p className="text-muted-foreground font-medium">Số điện thoại</p>
      <p className="font-semibold text-2xl">{order.customerPhone}</p>
    </div>

    {order.customerEmail && (
      <div className="py-2">
        <p className="text-muted-foreground font-medium">Email</p>
        <p className="font-semibold text-2xl">{order.customerEmail}</p>
      </div>
    )}

    <div className="py-2">
      <p className="text-muted-foreground font-medium ">Địa chỉ giao hàng</p>
      <p className="font-semibold leading-relaxed text-2xl">{order.deliveryAddress}</p>
    </div>

    {order.specialInstructions && (
      <div className="py-2">
        <p className="text-muted-foreground font-medium">Ghi chú</p>
        <p className="italic text-gray-700">{order.specialInstructions}</p>
      </div>
    )}
  </CardContent>
</Card>

              </div>

              {/* Tổng quan đơn hàng */}
              <Card className="shadow-md border sticky top-24 h-fit">
  <CardHeader>
    <CardTitle className="text-lg font-semibold">Tổng quan đơn hàng</CardTitle>
  </CardHeader>

  <CardContent className="space-y-4">
    {/* Tổng tạm tính */}
    <div className="space-y-2 text-sm">
      <div className="flex justify-between">
        <span className="text-muted-foreground">Tạm tính</span>
        <span>{formatPrice(order.subtotal)}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">Phí giao hàng</span>
        <span>
          {order.deliveryFee === 0 ? (
            <span className="text-green-600 font-medium">Miễn phí</span>
          ) : (
            formatPrice(order.deliveryFee)
          )}
        </span>
      </div>
    </div>

    <Separator />

    {/* Tổng cộng */}
    <div className="flex justify-between items-center">
      <span className="font-semibold">Tổng cộng</span>
      <span className="text-xl font-bold text-primary">
        {formatPrice(order.total)}
      </span>
    </div>

    <Separator />

    {/* Hình thức thanh toán */}
    <div className="text-sm">
      <p className="font-medium text-muted-foreground mb-1">
        Hình thức thanh toán
      </p>

      <div className="flex items-center justify-between">
        {order.paymentMethod === "cash" ? (
          <div className="flex items-center justify-center w-full gap-2">
            <span className="text-lg">💵</span>
            <span>Tiền mặt</span>
          </div>
        ) : (
          <div className="flex items-center justify-center w-full gap-2">
            <img
              src="/images/zalopay.png"
              alt="ZaloPay"
              className="h-16 w-16 object-contain"
            />
            <span>ZaloPay</span>
          </div>
        )}
      </div>
    </div>
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
