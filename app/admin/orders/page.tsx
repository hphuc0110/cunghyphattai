"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import type { Order, OrderStatus } from "@/lib/types"
import Link from "next/link"
import { Eye, Trash2 } from "lucide-react"

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
      if (data.success) setOrders(data.data)
    } catch (error) {
      console.error("Failed to fetch orders:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price)

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })
      const data = await response.json()
      if (data.success) {
        toast({ title: "Cập nhật thành công", description: "Trạng thái đơn hàng đã được cập nhật" })
        fetchOrders()
      } else throw new Error(data.error)
    } catch {
      toast({ title: "Lỗi", description: "Không thể cập nhật trạng thái đơn hàng", variant: "destructive" })
    }
  }

  const handleMarkCompleted = async (orderId: string) => handleStatusChange(orderId, "completed")

  const handleDelete = async (orderId: string) => {
    const ok = window.confirm(`Bạn có chắc muốn xóa đơn hàng #${orderId}?`)
    if (!ok) return
    try {
      const response = await fetch(`/api/orders/${orderId}`, { method: "DELETE" })
      const data = await response.json()
      if (data.success) {
        toast({ title: "Đã xóa đơn hàng", description: `#${orderId} đã được xóa` })
        fetchOrders()
      } else throw new Error(data.error || "Xóa thất bại")
    } catch {
      toast({ title: "Lỗi", description: "Không thể xóa đơn hàng", variant: "destructive" })
    }
  }

  const filteredOrders =
    statusFilter === "all"
      ? orders
      : statusFilter === ("completed" as OrderStatus)
      ? orders.filter((o) => o.status === "completed")
      : statusFilter === ("paid" as unknown as OrderStatus)
      ? orders.filter((o) => o.paymentStatus === "paid")
      : orders.filter((o) => o.status !== "completed" && o.paymentStatus !== "paid")

  const unpaidCount = orders.filter((o) => o.status !== "completed" && o.paymentStatus !== "paid").length
  const completedCount = orders.filter((o) => o.status === "completed").length

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold tracking-tight">Quản Lý Đơn Hàng</h1>
        <p className="text-muted-foreground">Xem và cập nhật trạng thái đơn hàng của khách hàng</p>
      </div>

      <Card>
        <CardHeader className="border-b bg-muted/30">
          <CardTitle className="text-lg font-semibold">Danh Sách Đơn Hàng ({filteredOrders.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={statusFilter} onValueChange={(v) => setStatusFilter(v as OrderStatus | "all")} className="mb-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">Tất cả ({orders.length})</TabsTrigger>
              <TabsTrigger value="unpaid">Chưa hoàn thành ({unpaidCount})</TabsTrigger>
              <TabsTrigger value="completed">Hoàn thành ({completedCount})</TabsTrigger>
            </TabsList>
          </Tabs>

          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-20 animate-pulse rounded-lg bg-muted" />
              ))}
            </div>
          ) : filteredOrders.length === 0 ? (
            <p className="py-8 text-center text-muted-foreground italic">
              {statusFilter === "all" ? "Chưa có đơn hàng nào" : "Không có đơn hàng phù hợp"}
            </p>
          ) : (
            <div className="overflow-x-auto rounded-md border">
              <table className="w-full text-sm">
                <thead className="bg-muted/40">
                  <tr className="border-b">
                    <th className="px-4 py-3 text-left font-semibold">Mã đơn</th>
                    <th className="px-4 py-3 text-left font-semibold">Khách hàng</th>
                    <th className="px-4 py-3 text-left font-semibold">Thời gian</th>
                    <th className="px-4 py-3 text-right font-semibold">Tổng tiền</th>
                    <th className="px-4 py-3 text-center font-semibold">Trạng thái</th>
                    <th className="px-4 py-3 text-right font-semibold">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr
                      key={(order as any).orderId}
                      className="border-b last:border-0 hover:bg-muted/20 transition-colors"
                    >
                      <td className="px-4 py-3 font-medium">#{(order as any).orderId}</td>
                      <td className="px-4 py-3">
                        <div className="font-medium">{order.customerName}</div>
                        <div className="text-xs text-muted-foreground">{order.customerPhone}</div>
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{formatDate(order.createdAt)}</td>
                      <td className="px-4 py-3 text-right font-semibold">{formatPrice(order.total)}</td>
                      <td className="px-4 py-3 text-center">
                        {order.status === "completed" ? (
                          <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
                            Hoàn thành
                          </Badge>
                        ) : order.paymentStatus === "paid" ? (
                          <Badge variant="default" className="bg-blue-600 text-white">
                            Đã thanh toán
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="bg-gray-200 text-gray-700">
                            Chưa hoàn thành
                          </Badge>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {order.status !== "completed" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleMarkCompleted((order as any).orderId)}
                            >
                              Hoàn thành
                            </Button>
                          )}

                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/orders/${(order as any).orderId}`} className="flex items-center gap-1">
                              <Eye className="h-4 w-4" />
                              <span>Xem</span>
                            </Link>
                          </Button>

                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete((order as any).orderId)}
                          >
                            <Trash2 className="h-4 w-4 opacity-70" />
                          </Button>
                        </div>
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
