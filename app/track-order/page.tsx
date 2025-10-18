"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { Search, Loader2 } from "lucide-react"

export default function TrackOrderPage() {
  const router = useRouter()
  const { toast } = useToast()

  const [loading, setLoading] = useState(false)
  const [orderId, setOrderId] = useState("")
  const [phone, setPhone] = useState("")

  const handleTrackById = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!orderId.trim()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập mã đơn hàng",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      const response = await fetch(`/api/orders/${orderId}`)
      const data = await response.json()

      if (data.success) {
        router.push(`/orders/${orderId}`)
      } else {
        toast({
          title: "Không tìm thấy",
          description: "Không tìm thấy đơn hàng với mã này",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể tra cứu đơn hàng",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleTrackByPhone = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!phone.trim()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập số điện thoại",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      const response = await fetch(`/api/orders?phone=${phone}`)
      const data = await response.json()

      if (data.success && data.data.length > 0) {
        // Navigate to the most recent order
        router.push(`/orders/${data.data[0].id}`)
      } else {
        toast({
          title: "Không tìm thấy",
          description: "Không tìm thấy đơn hàng với số điện thoại này",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể tra cứu đơn hàng",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <div className="container py-8">
          <div className="mx-auto max-w-2xl">
            <div className="mb-8 text-center">
              <h1 className="mb-3 text-3xl font-bold text-balance">Theo Dõi Đơn Hàng</h1>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Tra Cứu Đơn Hàng</CardTitle>
                <CardDescription>Chọn phương thức tra cứu phù hợp với bạn</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="order-id" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="order-id">Mã đơn hàng</TabsTrigger>
                    <TabsTrigger value="phone">Số điện thoại</TabsTrigger>
                  </TabsList>

                  <TabsContent value="order-id" className="mt-6">
                    <form onSubmit={handleTrackById} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="orderId">Mã đơn hàng</Label>
                        <Input
                          id="orderId"
                          placeholder="ORD-001"
                          value={orderId}
                          onChange={(e) => setOrderId(e.target.value)}
                          required
                        />
                        <p className="text-sm text-muted-foreground">
                          Mã đơn hàng được gửi qua SMS sau khi đặt hàng thành công
                        </p>
                      </div>
                      <Button type="submit" className="w-full gap-2" disabled={loading}>
                        {loading ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Đang tra cứu...
                          </>
                        ) : (
                          <>
                            <Search className="h-4 w-4" />
                            Tra cứu
                          </>
                        )}
                      </Button>
                    </form>
                  </TabsContent>

                  <TabsContent value="phone" className="mt-6">
                    <form onSubmit={handleTrackByPhone} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Số điện thoại</Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="091 588 58 88"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          required
                        />
                        <p className="text-sm text-muted-foreground">Nhập số điện thoại đã dùng để đặt hàng</p>
                      </div>
                      <Button type="submit" className="w-full gap-2" disabled={loading}>
                        {loading ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Đang tra cứu...
                          </>
                        ) : (
                          <>
                            <Search className="h-4 w-4" />
                            Tra cứu
                          </>
                        )}
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Help Section */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Cần hỗ trợ?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>Nếu bạn gặp vấn đề khi tra cứu đơn hàng, vui lòng liên hệ:</p>
                <div className="space-y-1">
                  <p>
                    <strong>Hotline:</strong>{" "}
                    <a href="tel:091 588 58 88" className="text-primary hover:underline">
                      091 588 58 88
                    </a>
                  </p>
                  <p>
                    <strong>Facebook:</strong>{" "}
                    <a href="https://www.facebook.com/share/1FjKZxNuiX/?mibextid=wwXIfr" className="text-primary hover:underline">
                      https://www.facebook.com/share/1FjKZxNuiX/?mibextid=wwXIfr
                    </a>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
