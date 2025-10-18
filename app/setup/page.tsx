"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle2, XCircle, Loader2, Database, User, Wifi, RefreshCw } from "lucide-react"

export default function SetupPage() {
  const [testResult, setTestResult] = useState<any>(null)
  const [testLoading, setTestLoading] = useState(false)

  const [seedResult, setSeedResult] = useState<any>(null)
  const [seedLoading, setSeedLoading] = useState(false)

  const [migrateResult, setMigrateResult] = useState<any>(null)
  const [migrateLoading, setMigrateLoading] = useState(false)

  const [adminForm, setAdminForm] = useState({
    name: "Admin",
    email: "admin@cunghyphattai.com",
    password: "Admin@123456",
  })
  const [adminResult, setAdminResult] = useState<any>(null)
  const [adminLoading, setAdminLoading] = useState(false)

  const testConnection = async () => {
    setTestLoading(true)
    setTestResult(null)
    try {
      const res = await fetch("/api/setup/test-connection")
      const data = await res.json()
      setTestResult(data)
    } catch (error: any) {
      setTestResult({ success: false, message: error.message })
    } finally {
      setTestLoading(false)
    }
  }

  const seedDatabase = async () => {
    setSeedLoading(true)
    setSeedResult(null)
    try {
      const res = await fetch("/api/setup/seed", { method: "POST" })
      const data = await res.json()
      setSeedResult(data)
    } catch (error: any) {
      setSeedResult({ success: false, message: error.message })
    } finally {
      setSeedLoading(false)
    }
  }

  const migrateCategories = async () => {
    setMigrateLoading(true)
    setMigrateResult(null)
    try {
      const token = localStorage.getItem("auth-token")
      if (!token) {
        setMigrateResult({ success: false, message: "Vui lòng đăng nhập admin trước" })
        return
      }

      const res = await fetch("/api/admin/migrate-categories", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const data = await res.json()
      setMigrateResult(data)
    } catch (error: any) {
      setMigrateResult({ success: false, message: error.message })
    } finally {
      setMigrateLoading(false)
    }
  }

  const createAdmin = async () => {
    setAdminLoading(true)
    setAdminResult(null)
    try {
      const res = await fetch("/api/setup/create-admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(adminForm),
      })
      const data = await res.json()
      setAdminResult(data)
    } catch (error: any) {
      setAdminResult({ success: false, message: error.message })
    } finally {
      setAdminLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Database Setup</h1>
          <p className="text-muted-foreground">Thiết lập database MongoDB cho website nhà hàng</p>
        </div>

        {/* Step 1: Test Connection */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Wifi className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>Bước 1: Kiểm tra kết nối MongoDB</CardTitle>
                <CardDescription>Đảm bảo MONGODB_URI đã được thêm vào Environment Variables</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={testConnection} disabled={testLoading} className="w-full">
              {testLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang kiểm tra...
                </>
              ) : (
                "Kiểm tra kết nối"
              )}
            </Button>

            {testResult && (
              <Alert variant={testResult.success ? "default" : "destructive"}>
                {testResult.success ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                <AlertDescription>
                  <div className="font-semibold">{testResult.message}</div>
                  {testResult.data && (
                    <div className="mt-2 text-sm space-y-1">
                      <div>Status: {testResult.data.status}</div>
                      <div>Database: {testResult.data.database}</div>
                      <div>Host: {testResult.data.host}</div>
                    </div>
                  )}
                  {testResult.error && <div className="mt-2 text-sm text-destructive">{testResult.error}</div>}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Step 2: Seed Database */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Database className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>Bước 2: Tạo Categories mới</CardTitle>
                <CardDescription>Tạo 13 categories mới trong database</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={seedDatabase} disabled={seedLoading} className="w-full">
              {seedLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang tạo...
                </>
              ) : (
                "Tạo Categories"
              )}
            </Button>

            {seedResult && (
              <Alert variant={seedResult.success ? "default" : "destructive"}>
                {seedResult.success ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                <AlertDescription>
                  <div className="font-semibold">{seedResult.message}</div>
                  {seedResult.data && (
                    <div className="mt-2 text-sm space-y-1">
                      <div>Categories: {seedResult.data.categories}</div>
                    </div>
                  )}
                  {seedResult.error && <div className="mt-2 text-sm text-destructive">{seedResult.error}</div>}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <RefreshCw className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>Bước 2.5: Cập nhật Category IDs cho Products</CardTitle>
                <CardDescription>
                  Nếu products không hiển thị đúng category, chạy migration này để cập nhật category IDs
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={migrateCategories} disabled={migrateLoading} className="w-full" variant="secondary">
              {migrateLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang cập nhật...
                </>
              ) : (
                "Cập nhật Category IDs"
              )}
            </Button>

            {migrateResult && (
              <Alert variant={migrateResult.success ? "default" : "destructive"}>
                {migrateResult.success ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                <AlertDescription>
                  <div className="font-semibold">{migrateResult.message}</div>
                  {migrateResult.updated !== undefined && (
                    <div className="mt-2 text-sm space-y-1">
                      <div>
                        Đã cập nhật: {migrateResult.updated}/{migrateResult.total} products
                      </div>
                      {migrateResult.errors && (
                        <div className="mt-2 text-xs text-destructive">
                          <div className="font-semibold">Lỗi:</div>
                          {migrateResult.errors.map((err: string, i: number) => (
                            <div key={i}>- {err}</div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                  {migrateResult.error && <div className="mt-2 text-sm text-destructive">{migrateResult.error}</div>}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Step 3: Create Admin */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>Bước 3: Tạo tài khoản Admin</CardTitle>
                <CardDescription>Tạo tài khoản admin đầu tiên để đăng nhập vào admin panel</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Tên</Label>
                <Input
                  id="name"
                  value={adminForm.name}
                  onChange={(e) => setAdminForm({ ...adminForm, name: e.target.value })}
                  placeholder="Admin"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={adminForm.email}
                  onChange={(e) => setAdminForm({ ...adminForm, email: e.target.value })}
                  placeholder="admin@cunghyphattai.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Mật khẩu</Label>
                <Input
                  id="password"
                  type="password"
                  value={adminForm.password}
                  onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })}
                  placeholder="Admin@123456"
                />
              </div>
            </div>

            <Button onClick={createAdmin} disabled={adminLoading} className="w-full">
              {adminLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang tạo...
                </>
              ) : (
                "Tạo tài khoản Admin"
              )}
            </Button>

            {adminResult && (
              <Alert variant={adminResult.success ? "default" : "destructive"}>
                {adminResult.success ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                <AlertDescription>
                  <div className="font-semibold">{adminResult.message}</div>
                  {adminResult.data && (
                    <div className="mt-2 text-sm space-y-1">
                      <div>Email: {adminResult.data.email}</div>
                      <div>Tên: {adminResult.data.name}</div>
                      <div>Role: {adminResult.data.role}</div>
                    </div>
                  )}
                  {adminResult.error && <div className="mt-2 text-sm text-destructive">{adminResult.error}</div>}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="border-primary/50 bg-primary/5">
          <CardHeader>
            <CardTitle>Bước tiếp theo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <div className="mt-0.5">1.</div>
              <div>
                Truy cập <code className="bg-muted px-1.5 py-0.5 rounded">/login</code> để đăng nhập
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="mt-0.5">2.</div>
              <div>Sử dụng email và password đã tạo ở bước 3</div>
            </div>
            <div className="flex items-start gap-2">
              <div className="mt-0.5">3.</div>
              <div>
                Sau khi đăng nhập, bạn sẽ được redirect đến{" "}
                <code className="bg-muted px-1.5 py-0.5 rounded">/admin</code>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="mt-0.5">4.</div>
              <div>Quản lý products và orders từ admin panel</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
