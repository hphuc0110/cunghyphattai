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
import { useToast } from "@/hooks/use-toast"
import type { Category } from "@/lib/types"
import Image from "next/image"
import { Plus, Pencil, Trash2, X, GripVertical } from "lucide-react"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

function SortableCategory({
  category,
  onEdit,
  onDelete,
}: {
  category: Category
  onEdit: (cat: Category) => void
  onDelete: (id: string) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: category.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <Card ref={setNodeRef} style={style} className="overflow-hidden">
      <CardContent className="p-0">
        <div className="relative aspect-[2/3] overflow-hidden">
          <Image
            src={category.image || "/placeholder.svg?height=450&width=300"}
            alt={category.name}
            fill
            className="object-cover"
          />
          <div className="absolute left-2 top-2 flex gap-2">
            <Badge variant="secondary" className="gap-1 cursor-grab" {...attributes} {...listeners}>
              <GripVertical className="h-3 w-3" />
              {category.order}
            </Badge>
          </div>
        </div>
        <div className="space-y-3 p-4">
          <div>
            <h3 className="font-semibold leading-tight">{category.name}</h3>
            <p className="text-sm text-muted-foreground">{category.nameEn}</p>
          </div>
          <p className="line-clamp-2 text-sm text-muted-foreground">{category.description}</p>

          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 gap-2 bg-transparent"
              onClick={() => onEdit(category)}
            >
              <Pencil className="h-3 w-3" />
              Sửa
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1 gap-2 bg-transparent text-destructive hover:bg-destructive hover:text-destructive-foreground"
              onClick={() => onDelete(category.id)}
            >
              <Trash2 className="h-3 w-3" />
              Xóa
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function AdminCategoriesPage() {
  const { toast } = useToast()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [uploading, setUploading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string>("")
  const [formData, setFormData] = useState({
    name: "",
    nameEn: "",
    description: "",
    image: "",
    order: "",
  })

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  useEffect(() => {
    fetchCategories()
  }, [])

  async function fetchCategories() {
    try {
      const response = await fetch("/api/categories")
      const data = await response.json()
      if (data.success) {
        setCategories(data.data)
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event

    if (!over || active.id === over.id) {
      return
    }

    const oldIndex = categories.findIndex((cat) => cat.id === active.id)
    const newIndex = categories.findIndex((cat) => cat.id === over.id)

    const newCategories = arrayMove(categories, oldIndex, newIndex)

    const updatedCategories = newCategories.map((cat, index) => ({
      ...cat,
      order: index + 1,
    }))

    setCategories(updatedCategories)

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

      const response = await fetch("/api/categories/reorder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          categories: updatedCategories.map((cat) => ({ id: cat.id, order: cat.order })),
        }),
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || "Failed to reorder categories")
      }

      toast({
        title: "Thành công",
        description: "Đã cập nhật thứ tự danh mục",
      })
    } catch (error: any) {
      console.error("Error reordering categories:", error)
      toast({
        title: "Lỗi",
        description: error.message || "Có lỗi xảy ra khi sắp xếp danh mục",
        variant: "destructive",
      })
      fetchCategories()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.nameEn || !formData.description) {
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

      const url = editingCategory ? `/api/categories/${editingCategory.id}` : "/api/categories"
      const method = editingCategory ? "PATCH" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name,
          nameEn: formData.nameEn,
          description: formData.description,
          image: formData.image || "/placeholder.svg?height=450&width=300",
          ...(formData.order && { order: Number.parseInt(formData.order) }),
        }),
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || "Failed to save category")
      }

      toast({
        title: editingCategory ? "Cập nhật thành công" : "Thêm thành công",
        description: editingCategory ? "Danh mục đã được cập nhật" : "Danh mục mới đã được thêm",
      })

      setIsDialogOpen(false)
      resetForm()
      fetchCategories()
    } catch (error: any) {
      console.error("Error saving category:", error)
      toast({
        title: "Lỗi",
        description: error.message || "Có lỗi xảy ra khi lưu danh mục",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (categoryId: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa danh mục này?")) {
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

      const response = await fetch(`/api/categories/${categoryId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || "Failed to delete category")
      }

      toast({
        title: "Xóa thành công",
        description: "Danh mục đã được xóa",
      })

      fetchCategories()
    } catch (error: any) {
      console.error("Error deleting category:", error)
      toast({
        title: "Lỗi",
        description: error.message || "Có lỗi xảy ra khi xóa danh mục",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (category: Category) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      nameEn: category.nameEn,
      description: category.description,
      image: category.image,
      order: category.order.toString(),
    })
    setImagePreview(category.image)
    setIsDialogOpen(true)
  }

  const resetForm = () => {
    setEditingCategory(null)
    // Auto-assign order for new categories
    const nextOrder = categories.length > 0 ? Math.max(...categories.map(cat => cat.order)) + 1 : 1
    setFormData({
      name: "",
      nameEn: "",
      description: "",
      image: "",
      order: nextOrder.toString(),
    })
    setImagePreview("")
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
      console.error("Upload error:", error)
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

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">Quản Lý Danh Mục</h1>
        <p className="text-muted-foreground">Thêm, sửa, xóa danh mục món ăn và kéo thả để sắp xếp thứ tự</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>Danh Sách Danh Mục ({categories.length})</CardTitle>
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
                  Thêm Danh Mục Mới
                </Button>
              </DialogTrigger>
              <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>{editingCategory ? "Chỉnh Sửa Danh Mục" : "Thêm Danh Mục Mới"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Tên danh mục (Tiếng Việt) *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="MÓN CHIÊN"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="nameEn">Tên danh mục (Tiếng Anh) *</Label>
                    <Input
                      id="nameEn"
                      value={formData.nameEn}
                      onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                      placeholder="Fried Dishes"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Mô tả *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Các món chiên giòn rụm, vàng ươm hấp dẫn"
                      rows={3}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="order">Thứ tự hiển thị *</Label>
                    <Input
                      id="order"
                      type="number"
                      value={formData.order}
                      onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                      placeholder="1"
                      required
                    />
                    <p className="text-xs text-muted-foreground">Số thứ tự càng nhỏ sẽ hiển thị càng trước</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="image">Hình ảnh danh mục (300x450px)</Label>

                    {imagePreview ? (
                      <div className="relative">
                        <div className="relative aspect-[2/3] w-full max-w-[200px] overflow-hidden rounded-lg border">
                          <Image src={imagePreview || "/placeholder.svg"} alt="Preview" fill className="object-cover" />
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
                        <p className="mt-2 text-xs text-muted-foreground">
                          Tỷ lệ 2:3 (300x450px) - Ảnh sẽ được tối ưu cho web
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
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
                        <p className="text-xs text-muted-foreground">
                          Chấp nhận JPG, PNG, WebP. Tối đa 5MB. Khuyến nghị 300x450px (tỷ lệ 2:3)
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button type="submit" className="flex-1">
                      {editingCategory ? "Cập Nhật" : "Thêm Danh Mục"}
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
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-80 animate-pulse rounded-lg bg-muted" />
              ))}
            </div>
          ) : categories.length === 0 ? (
            <p className="py-8 text-center text-muted-foreground">Chưa có danh mục nào</p>
          ) : (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={categories.map((cat) => cat.id)} strategy={verticalListSortingStrategy}>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {categories.map((category) => (
                    <SortableCategory
                      key={category.id}
                      category={category}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
