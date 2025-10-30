"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import type { Product, ProductVariant, Category } from "@/lib/types"
import Image from "next/image"
import { Search, Plus, Pencil, Trash2, X } from "lucide-react"

export default function AdminProductsPage() {
  const { toast } = useToast()
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [uploading, setUploading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string>("")
  const [formData, setFormData] = useState({
    name: "",
    nameEn: "",
    description: "",
    price: "",
    categoryId: "",
    image: "",
    featured: false,
    available: true,
  })
  const [variants, setVariants] = useState<ProductVariant[]>([])
  const [newVariant, setNewVariant] = useState({ name: "", price: "" })

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [searchQuery])

  async function fetchProducts() {
    try {
      const params = new URLSearchParams()
      if (searchQuery) {
        params.append("search", searchQuery)
      }

      const response = await fetch(`/api/products?${params.toString()}`)
      const data = await response.json()
      if (data.success) {
        setProducts(data.data)
      }
    } catch (error) {
      console.error("Failed to fetch products:", error)
    } finally {
      setLoading(false)
    }
  }

  async function fetchCategories() {
    try {
      const response = await fetch("/api/categories")
      const data = await response.json()
      if (data.success) {
        setCategories(data.data)
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (variants.length === 0 && !formData.price) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập giá hoặc thêm phân loại sản phẩm",
        variant: "destructive",
      })
      return
    }

    if (!formData.name || !formData.categoryId) {
      toast({
        title: "Lỗi",
        description: "Vui lòng điền đầy đủ thông tin bắt buộc",
        variant: "destructive",
      })
      return
    }

    try {
      const token = localStorage.getItem("auth-token")
      if (!token) {
        toast({
          title: "Lỗi",
          description: "Vui lòng đăng nhập lại",
          variant: "destructive",
        })
        return
      }

      const url = editingProduct ? `/api/products/${editingProduct.id}` : "/api/products"
      const method = editingProduct ? "PATCH" : "POST"

      console.log("[v0] Submitting product:", { url, method, formData, variants })

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name,
          nameEn: formData.nameEn || formData.name,
          description: formData.description || formData.name,
          descriptionEn: formData.description || formData.name,
          ...(formData.price && formData.price.trim() !== "" && !isNaN(Number.parseFloat(formData.price)) && { price: Number.parseFloat(formData.price) }),
          variants: variants.length > 0 ? variants : undefined,
          category: formData.categoryId,
          image: formData.image || "/placeholder.svg?height=500&width=500",
          featured: formData.featured,
          available: formData.available,
        }),
      })

      const data = await response.json()
      console.log("[v0] Response:", data)

      if (!data.success) {
        throw new Error(data.error || "Failed to save product")
      }

      toast({
        title: editingProduct ? "Cập nhật thành công" : "Thêm thành công",
        description: editingProduct ? "Sản phẩm đã được cập nhật" : "Sản phẩm mới đã được thêm vào danh sách",
      })

      setIsDialogOpen(false)
      resetForm()
      fetchProducts()
    } catch (error: any) {
      console.error("[v0] Error saving product:", error)
      toast({
        title: "Lỗi",
        description: error.message || "Có lỗi xảy ra khi lưu sản phẩm",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (productId: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa món này?")) {
      return
    }

    try {
      const token = localStorage.getItem("auth-token")
      if (!token) {
        toast({
          title: "Lỗi",
          description: "Vui lòng đăng nhập lại",
          variant: "destructive",
        })
        return
      }

      console.log("[v0] Deleting product:", productId)

      const response = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()
      console.log("[v0] Delete response:", data)

      if (!data.success) {
        throw new Error(data.error || "Failed to delete product")
      }

      toast({
        title: "Xóa thành công",
        description: "Sản phẩm đã được xóa khỏi danh sách",
      })

      fetchProducts()
    } catch (error: any) {
      console.error("[v0] Error deleting product:", error)
      toast({
        title: "Lỗi",
        description: error.message || "Không thể xóa sản phẩm",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      nameEn: product.nameEn || "",
      description: product.description,
      price: product.price !== undefined && product.price !== null ? product.price.toString() : "",
      categoryId: product.categoryId,
      image: product.image,
      featured: product.featured,
      available: product.available,
    })
    setImagePreview(product.image)
    setVariants(product.variants || [])
    setIsDialogOpen(true)
  }

  const resetForm = () => {
    setEditingProduct(null)
    setFormData({
      name: "",
      nameEn: "",
      description: "",
      price: "",
      categoryId: "",
      image: "",
      featured: false,
      available: true,
    })
    setImagePreview("")
    setVariants([])
    setNewVariant({ name: "", price: "" })
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Lỗi",
        description: "Chỉ chấp nhận file JPG, PNG, hoặc WebP",
        variant: "destructive",
      })
      return
    }

    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      toast({
        title: "Lỗi",
        description: "Kích thước file phải nhỏ hơn 5MB",
        variant: "destructive",
      })
      return
    }

    setUploading(true)

    try {
      const token = localStorage.getItem("auth-token")
      if (!token) {
        toast({
          title: "Lỗi",
          description: "Vui lòng đăng nhập lại",
          variant: "destructive",
        })
        return
      }

      const uploadFormData = new FormData()
      uploadFormData.append("file", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: uploadFormData,
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || "Upload failed")
      }

      setFormData({ ...formData, image: data.url })
      setImagePreview(data.url)

      toast({
        title: "Thành công",
        description: "Ảnh đã được tải lên",
      })
    } catch (error: any) {
      console.error("[v0] Upload error:", error)
      toast({
        title: "Lỗi",
        description: error.message || "Không thể tải ảnh lên",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  const handleRemoveImage = () => {
    setFormData({ ...formData, image: "" })
    setImagePreview("")
  }

  const handleAddVariant = () => {
    if (!newVariant.name || newVariant.price.trim() === "" || isNaN(Number.parseFloat(newVariant.price))) {
      toast({
        title: "Lỗi",
        description: "Vui lòng điền đầy đủ thông tin phân loại",
        variant: "destructive",
      })
      return
    }

    const variant: ProductVariant = {
      id: Date.now().toString(),
      name: newVariant.name,
      price: Number.parseFloat(newVariant.price),
      available: true,
    }

    setVariants([...variants, variant])
    setNewVariant({ name: "", price: "" })
  }

  const handleRemoveVariant = (variantId: string) => {
    setVariants(variants.filter((v) => v.id !== variantId))
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price)
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">Quản Lý Sản Phẩm</h1>
        <p className="text-muted-foreground">Thêm, sửa, xóa món ăn trong menu</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>Danh Sách Sản Phẩm ({products.length})</CardTitle>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Tìm sản phẩm..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Dialog
                open={isDialogOpen}
                onOpenChange={(open) => {
                  setIsDialogOpen(open)
                  if (!open) resetForm()
                }}
              >
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Thêm Món Mới
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>{editingProduct ? "Chỉnh Sửa Món Ăn" : "Thêm Món Ăn Mới"}</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Tên món (Tiếng Việt) *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Gà quay Bắc Kinh"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="nameEn">Tên món (Tiếng Anh)</Label>
                      <Input
                        id="nameEn"
                        value={formData.nameEn}
                        onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                        placeholder="Peking Duck"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Mô tả</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Mô tả chi tiết về món ăn..."
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="price">Giá mặc định (VNĐ) {variants.length === 0 && "*"}</Label>
                      <Input
                        id="price"
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        placeholder="150000"
                        required={variants.length === 0}
                        disabled={variants.length > 0}
                      />
                      <p className="text-xs text-muted-foreground">
                        {variants.length > 0
                          ? "Giá sẽ được lấy từ phân loại đã chọn"
                          : "Giá này sẽ được dùng nếu không có phân loại"}
                      </p>
                    </div>

                    <div className="space-y-3 rounded-lg border p-4">
                      <div className="flex items-center justify-between">
                        <Label className="text-base">Phân loại sản phẩm (tùy chọn)</Label>
                        <Badge variant="secondary">{variants.length} phân loại</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Thêm các lựa chọn khác nhau cho món ăn (VD: Xửng 3, Xửng 6)
                      </p>

                      {variants.length > 0 && (
                        <div className="space-y-2">
                          {variants.map((variant) => (
                            <div key={variant.id} className="flex items-center justify-between rounded-md border p-3">
                              <div>
                                <p className="font-medium">{variant.name}</p>
                                <p className="text-sm text-muted-foreground">{formatPrice(variant.price)}</p>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveVariant(variant.id)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="flex gap-2">
                        <Input
                          placeholder="Tên phân loại (VD: Xửng 3)"
                          value={newVariant.name}
                          onChange={(e) => setNewVariant({ ...newVariant, name: e.target.value })}
                        />
                        <Input
                          type="number"
                          placeholder="Giá"
                          value={newVariant.price}
                          onChange={(e) => setNewVariant({ ...newVariant, price: e.target.value })}
                          className="w-32"
                        />
                        <Button type="button" variant="outline" onClick={handleAddVariant}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category">Danh mục *</Label>
                      <Select
                        value={formData.categoryId}
                        onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn danh mục" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id}>
                              {cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="image">Hình ảnh món ăn</Label>

                      {imagePreview ? (
                        <div className="relative">
                          <div className="relative aspect-video overflow-hidden rounded-lg border">
                            <Image
                              src={imagePreview || "/placeholder.svg"}
                              alt="Preview"
                              fill
                              className="object-cover"
                            />
                          </div>
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute right-2 top-2"
                            onClick={handleRemoveImage}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Input
                            id="image"
                            type="file"
                            accept="image/jpeg,image/jpg,image/png,image/webp"
                            onChange={handleImageUpload}
                            disabled={uploading}
                            className="flex-1"
                          />
                          {uploading && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                              Đang tải...
                            </div>
                          )}
                        </div>
                      )}

                      <p className="text-xs text-muted-foreground">Chấp nhận file JPG, PNG, WebP. Tối đa 5MB</p>
                    </div>

                    <div className="flex items-center gap-4">
                      <label className="flex cursor-pointer items-center gap-2">
                        <input
                          type="checkbox"
                          checked={formData.featured}
                          onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                          className="h-4 w-4"
                        />
                        <span className="text-sm">Món nổi bật</span>
                      </label>

                      <label className="flex cursor-pointer items-center gap-2">
                        <input
                          type="checkbox"
                          checked={formData.available}
                          onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                          className="h-4 w-4"
                        />
                        <span className="text-sm">Còn hàng</span>
                      </label>
                    </div>

                    <div className="flex gap-2 pt-4">
                      <Button type="submit" className="flex-1">
                        {editingProduct ? "Cập Nhật" : "Thêm Món"}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setIsDialogOpen(false)
                          resetForm()
                        }}
                      >
                        Hủy
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 animate-pulse rounded-lg bg-muted" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <p className="py-8 text-center text-muted-foreground">Không tìm thấy sản phẩm nào</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <Card key={product.id}>
                  <CardContent className="p-4">
                    <div className="relative mb-3 aspect-square overflow-hidden rounded-lg">
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                      {!product.available && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                          <Badge variant="secondary">Hết hàng</Badge>
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <div>
                        <h3 className="font-semibold leading-tight">{product.name}</h3>
                        <p className="text-sm text-muted-foreground">{product.nameEn}</p>
                      </div>
                      {product.variants && product.variants.length > 0 ? (
                        <div className="space-y-1">
                          <Badge variant="outline" className="text-xs">
                            {product.variants.length} phân loại
                          </Badge>
                          <div className="text-sm text-muted-foreground">
                            {product.variants.map((v) => (
                              <div key={v.id}>
                                {v.name}: {formatPrice(v.price)}
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-primary">{formatPrice(product.price)}</span>
                          <Badge variant={product.available ? "default" : "secondary"}>
                            {product.available ? "Còn hàng" : "Hết hàng"}
                          </Badge>
                        </div>
                      )}
                      {product.featured && <Badge className="bg-secondary text-secondary-foreground">Nổi bật</Badge>}

                      <div className="flex gap-2 pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 gap-2 bg-transparent"
                          onClick={() => handleEdit(product)}
                        >
                          <Pencil className="h-3 w-3" />
                          Sửa
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 gap-2 bg-transparent text-destructive hover:bg-destructive hover:text-destructive-foreground"
                          onClick={() => handleDelete(product.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                          Xóa
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
