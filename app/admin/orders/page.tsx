"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import type { Order, OrderStatus } from "@/lib/types"
import Link from "next/link"
import { Eye } from "lucide-react"

export default function AdminOrdersPage() {
  const { toast } = useToast()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all")

  useEffect(() => {
    fetchOrders()
  }, [])

  async function fetchOrders() {
    try {
      const response = await fetch("/api/orders")
      const data = await response.json()
      if (data.success) {
        setOrders(data.data)
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Cập nhật thành công",
          description: "Trạng thái đơn hàng đã được cập nhật",
        })
        fetchOrders()
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật trạng thái đơn hàng",
        variant: "destructive",
      })
    }
  }

  const getStatusBadgeVariant = (status: OrderStatus) => {
    const variants: Record<OrderStatus, "default" | "secondary" | "destructive" | "outline"> = {
      pending: "secondary",
      confirmed: "default",
      preparing: "default",
      ready: "default",
      delivering: "default",
      completed: "outline",
      cancelled: "destructive",
    }
    return variants[status]
  }

  const getStatusLabel = (status: OrderStatus) => {
    const labels: Record<OrderStatus, string> = {
      pending: "Chờ xác nhận",
      confirmed: "Đã xác nhận",
      preparing: "Đang chuẩn bị",
      ready: "Sẵn sàng",
      delivering: "Đang giao",
      completed: "Hoàn thành",
      cancelled: "Đã hủy",
    }
    return labels[status]
  }

  const filteredOrders = statusFilter === "all" ? orders : orders.filter((order) => order.status === statusFilter)

  const pendingCount = orders.filter((o) => o.status === "pending").length
  const deliveringCount = orders.filter((o) => o.status === "delivering").length
  const completedCount = orders.filter((o) => o.status === "completed").length

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">Quản Lý Đơn Hàng</h1>
        <p className="text-muted-foreground">Xem và cập nhật trạng thái đơn hàng</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh Sách Đơn Hàng ({filteredOrders.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={statusFilter} onValueChange={(v) => setStatusFilter(v as OrderStatus | "all")} className="mb-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">Tất cả ({orders.length})</TabsTrigger>
              <TabsTrigger value="pending">Chờ xử lý ({pendingCount})</TabsTrigger>
              <TabsTrigger value="delivering">Đang giao ({deliveringCount})</TabsTrigger>
              <TabsTrigger value="completed">Hoàn tất ({completedCount})</TabsTrigger>
            </TabsList>
          </Tabs>

          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-20 animate-pulse rounded-lg bg-muted" />
              ))}
            </div>
          ) : filteredOrders.length === 0 ? (
            <p className="py-8 text-center text-muted-foreground">
              {statusFilter === "all" ? "Chưa có đơn hàng nào" : "Không có đơn hàng nào"}
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="pb-3 text-left font-medium">Mã đơn</th>
                    <th className="pb-3 text-left font-medium">Khách hàng</th>
                    <th className="pb-3 text-left font-medium">Thời gian</th>
                    <th className="pb-3 text-right font-medium">Tổng tiền</th>
                    <th className="pb-3 text-left font-medium">Trạng thái</th>
                    <th className="pb-3 text-right font-medium">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="border-b last:border-0">
                      <td className="py-4">
                        <div className="font-medium">#{order.id}</div>
                      </td>
                      <td className="py-4">
                        <div>{order.customerName}</div>
                        <div className="text-sm text-muted-foreground">{order.customerPhone}</div>
                      </td>
                      <td className="py-4">
                        <div className="text-sm">{formatDate(order.createdAt)}</div>
                      </td>
                      <td className="py-4 text-right">
                        <div className="font-semibold">{formatPrice(order.total)}</div>
                      </td>
                      <td className="py-4">
                        <Select
                          value={order.status}
                          onValueChange={(value) => handleStatusChange(order.id, value as OrderStatus)}
                        >
                          <SelectTrigger className="w-40">
                            <SelectValue>
                              <Badge variant={getStatusBadgeVariant(order.status)}>
                                {getStatusLabel(order.status)}
                              </Badge>
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Chờ xác nhận</SelectItem>
                            <SelectItem value="confirmed">Đã xác nhận</SelectItem>
                            <SelectItem value="preparing">Đang chuẩn bị</SelectItem>
                            <SelectItem value="ready">Sẵn sàng</SelectItem>
                            <SelectItem value="delivering">Đang giao</SelectItem>
                            <SelectItem value="completed">Hoàn thành</SelectItem>
                            <SelectItem value="cancelled">Đã hủy</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="py-4 text-right">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/orders/${order.id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
