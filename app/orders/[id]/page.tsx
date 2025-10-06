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

        if (data.success) {
          setOrder(data.data)
        }
      } catch (error) {
        console.error("Failed to fetch order:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [params.id])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

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
        <main className="flex-1">
          <div className="container py-8">
            <div className="mx-auto max-w-4xl space-y-6">
              <div className="h-8 w-48 animate-pulse rounded bg-muted" />
              <div className="h-64 animate-pulse rounded-lg bg-muted" />
            </div>
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
          <div className="text-center">
            <h2 className="mb-2 text-2xl font-bold">Không tìm thấy đơn hàng</h2>
            <p className="text-muted-foreground">Đơn hàng này không tồn tại hoặc đã bị xóa</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const statusInfo = getStatusInfo(order.status)
  const StatusIcon = statusInfo.icon

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <div className="container py-8">
          <div className="mx-auto max-w-4xl">
            {/* Order Header */}
            <div className="mb-8">
              <div className="mb-4 flex items-center justify-between">
                <h1 className="text-3xl font-bold">Đơn Hàng #{order.id}</h1>
                <Badge className={`${statusInfo.color} gap-1 text-white`}>
                  <StatusIcon className="h-4 w-4" />
                  {statusInfo.label}
                </Badge>
              </div>
              <p className="text-muted-foreground">Đặt hàng lúc: {formatDate(order.createdAt)}</p>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              {/* Order Details */}
              <div className="lg:col-span-2 space-y-6">
                {/* Order Items */}
                <Card>
                  <CardHeader>
                    <CardTitle>Món Ăn</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {order.items.map((item, index) => (
                        <div key={item.product.id}>
                          {index > 0 && <Separator className="my-4" />}
                          <div className="flex justify-between">
                            <div className="flex-1">
                              <div className="font-medium">{item.product.name}</div>
                              <div className="text-sm text-muted-foreground">{item.product.nameEn}</div>
                              {item.specialInstructions && (
                                <div className="mt-1 text-sm text-muted-foreground">
                                  Ghi chú: {item.specialInstructions}
                                </div>
                              )}
                              <div className="mt-1 text-sm text-muted-foreground">Số lượng: {item.quantity}</div>
                            </div>
                            <div className="text-right">
                              <div className="font-semibold">{formatPrice(item.product.price * item.quantity)}</div>
                              <div className="text-sm text-muted-foreground">
                                {formatPrice(item.product.price)} x {item.quantity}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Delivery Info */}
                <Card>
                  <CardHeader>
                    <CardTitle>Thông Tin Giao Hàng</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">Người nhận</div>
                      <div>{order.customerName}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">Số điện thoại</div>
                      <div>{order.customerPhone}</div>
                    </div>
                    {order.customerEmail && (
                      <div>
                        <div className="text-sm font-medium text-muted-foreground">Email</div>
                        <div>{order.customerEmail}</div>
                      </div>
                    )}
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">Địa chỉ giao hàng</div>
                      <div>{order.deliveryAddress}</div>
                    </div>
                    {order.specialInstructions && (
                      <div>
                        <div className="text-sm font-medium text-muted-foreground">Ghi chú</div>
                        <div>{order.specialInstructions}</div>
                      </div>
                    )}
                    {order.estimatedDeliveryTime && (
                      <div>
                        <div className="text-sm font-medium text-muted-foreground">Thời gian giao dự kiến</div>
                        <div>{formatDate(order.estimatedDeliveryTime)}</div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <Card className="sticky top-20">
                  <CardHeader>
                    <CardTitle>Tổng Quan</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Tạm tính</span>
                        <span className="font-medium">{formatPrice(order.subtotal)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Phí giao hàng</span>
                        <span className="font-medium">
                          {order.deliveryFee === 0 ? (
                            <span className="text-green-600">Miễn phí</span>
                          ) : (
                            formatPrice(order.deliveryFee)
                          )}
                        </span>
                      </div>
                    </div>

                    <Separator />

                    <div className="flex justify-between">
                      <span className="font-semibold">Tổng cộng</span>
                      <span className="text-xl font-bold text-primary">{formatPrice(order.total)}</span>
                    </div>

                    <Separator />

                    <div>
                      <div className="mb-2 text-sm font-medium">Thanh toán</div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          {order.paymentMethod === "cash"
                            ? "Tiền mặt"
                            : order.paymentMethod === "card"
                              ? "Thẻ"
                              : "Chuyển khoản"}
                        </span>
                        <Badge variant={order.paymentStatus === "paid" ? "default" : "secondary"}>
                          {order.paymentStatus === "paid"
                            ? "Đã thanh toán"
                            : order.paymentStatus === "failed"
                              ? "Thất bại"
                              : "Chưa thanh toán"}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
