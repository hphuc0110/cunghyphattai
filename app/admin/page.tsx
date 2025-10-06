"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DollarSign, ShoppingBag, Package, TrendingUp, Flame } from "lucide-react"
import type { Order, Product } from "@/lib/types"

type TimePeriod = "day" | "week" | "month"

export default function AdminDashboardPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [timePeriod, setTimePeriod] = useState<TimePeriod>("day")

  useEffect(() => {
    async function fetchData() {
      try {
        const [ordersRes, productsRes] = await Promise.all([fetch("/api/orders"), fetch("/api/products")])

        const ordersData = await ordersRes.json()
        const productsData = await productsRes.json()

        if (ordersData.success) {
          setOrders(ordersData.data)
        }
        if (productsData.success) {
          setProducts(productsData.data)
        }
      } catch (error) {
        console.error("Failed to fetch data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price)
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const todayOrders = orders.filter((order) => {
    const orderDate = new Date(order.createdAt)
    orderDate.setHours(0, 0, 0, 0)
    return orderDate.getTime() === today.getTime()
  })

  const getRevenueByPeriod = (period: TimePeriod) => {
    const now = new Date()
    const startDate = new Date()

    switch (period) {
      case "day":
        startDate.setHours(0, 0, 0, 0)
        break
      case "week":
        startDate.setDate(now.getDate() - 7)
        break
      case "month":
        startDate.setMonth(now.getMonth() - 1)
        break
    }

    const filteredOrders = orders.filter((order) => new Date(order.createdAt) >= startDate)

    return filteredOrders.reduce((sum, order) => sum + order.total, 0)
  }

  const getTopProducts = () => {
    const productSales: Record<string, { product: Product; count: number }> = {}

    orders.forEach((order) => {
      order.items.forEach((item) => {
        const product = products.find((p) => p.id === item.productId)
        if (product) {
          if (!productSales[item.productId]) {
            productSales[item.productId] = { product, count: 0 }
          }
          productSales[item.productId].count += item.quantity
        }
      })
    })

    return Object.values(productSales)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
  }

  const totalRevenue = getRevenueByPeriod(timePeriod)
  const totalOrders = orders.length
  const pendingOrders = orders.filter((o) => o.status === "pending" || o.status === "confirmed").length
  const topProducts = getTopProducts()

  const stats = [
    {
      title: "Đơn Hàng Hôm Nay",
      value: todayOrders.length.toString(),
      icon: ShoppingBag,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Đơn Đang Xử Lý",
      value: pendingOrders.toString(),
      icon: Package,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
    },
    {
      title: "Tổng Đơn Hàng",
      value: totalOrders.toString(),
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
  ]

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">Tổng Quan</h1>
        <p className="text-muted-foreground">Xem tổng quan về hoạt động kinh doanh</p>
      </div>

      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 animate-pulse rounded-lg bg-muted" />
          ))}
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {stats.map((stat) => {
              const Icon = stat.icon
              return (
                <Card key={stat.title}>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                    <div className={`rounded-full p-2 ${stat.bgColor}`}>
                      <Icon className={`h-4 w-4 ${stat.color}`} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Revenue Card with Tabs */}
          <Card className="mt-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="rounded-full bg-green-100 p-2">
                    <DollarSign className="h-4 w-4 text-green-600" />
                  </div>
                  <CardTitle>Doanh Thu</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs value={timePeriod} onValueChange={(v) => setTimePeriod(v as TimePeriod)}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="day">Hôm Nay</TabsTrigger>
                  <TabsTrigger value="week">7 Ngày</TabsTrigger>
                  <TabsTrigger value="month">30 Ngày</TabsTrigger>
                </TabsList>
                <TabsContent value={timePeriod} className="mt-4">
                  <div className="text-3xl font-bold text-green-600">{formatPrice(totalRevenue)}</div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {timePeriod === "day" && "Doanh thu hôm nay"}
                    {timePeriod === "week" && "Doanh thu 7 ngày qua"}
                    {timePeriod === "month" && "Doanh thu 30 ngày qua"}
                  </p>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            {/* Top Selling Products */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Flame className="h-5 w-5 text-orange-500" />
                  <CardTitle>Top Món Bán Chạy</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                {topProducts.length === 0 ? (
                  <p className="text-center text-muted-foreground">Chưa có dữ liệu</p>
                ) : (
                  <div className="space-y-4">
                    {topProducts.map(({ product, count }, index) => (
                      <div key={product.id} className="flex items-center gap-4">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">{product.name}</div>
                          <div className="text-sm text-muted-foreground">{formatPrice(product.price)}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">{count}</div>
                          <div className="text-sm text-muted-foreground">đã bán</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Orders */}
            <Card>
              <CardHeader>
                <CardTitle>Đơn Hàng Gần Đây</CardTitle>
              </CardHeader>
              <CardContent>
                {orders.length === 0 ? (
                  <p className="text-center text-muted-foreground">Chưa có đơn hàng nào</p>
                ) : (
                  <div className="space-y-4">
                    {orders.slice(0, 5).map((order) => (
                      <div key={order.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                        <div>
                          <div className="font-medium">#{order.id}</div>
                          <div className="text-sm text-muted-foreground">{order.customerName}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">{formatPrice(order.total)}</div>
                          <div className="text-sm text-muted-foreground capitalize">{order.status}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  )
}
