// Product types
export interface Product {
  id: string
  name: string
  nameEn: string
  description: string
  descriptionEn: string
  price: number
  variants?: ProductVariant[]
  image: string
  category: string
  categoryId: string // Keep for backward compatibility
  featured: boolean
  available: boolean
  spicyLevel?: number // 0-5
  tags: string[]
}

export interface ProductVariant {
  id: string
  name: string // e.g., "Xửng 3", "Xửng 6"
  price: number
  available: boolean
}

// Category types
export interface Category {
  id: string
  name: string
  nameEn: string
  description: string
  image: string
  order: number
}

// Cart types
export interface CartItem {
  id: string
  product: Product
  quantity: number
  specialInstructions?: string
  variant?: {
    id: string
    name: string
    price: number
  }
}

// Order types
export type OrderStatus = "pending" | "confirmed" | "preparing" | "ready" | "delivering" | "completed" | "cancelled"

export interface Order {
  id: string
  orderId: string
  customerName: string
  customerPhone: string
  customerEmail?: string
  deliveryAddress: string
  items: CartItem[]
  subtotal: number
  deliveryFee: number
  total: number
  status: OrderStatus
  paymentMethod: "cash" | "card" | "online"
  paymentStatus: "pending" | "paid" | "failed"
  specialInstructions?: string
  createdAt: string
  updatedAt: string
  estimatedDeliveryTime?: string
}

// User types (for future authentication)
export interface User {
  id: string
  name: string
  email: string
  phone: string
  addresses: Address[]
  orders: string[] // order IDs
  createdAt: string
}

export interface Address {
  id: string
  label: string // 'home', 'work', etc.
  street: string
  district: string
  city: string
  isDefault: boolean
}
