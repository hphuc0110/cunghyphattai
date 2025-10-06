// API client utilities

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || ""

// Get auth token from localStorage
function getAuthToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem("auth-token")
}

// Fetch with auth
async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = getAuthToken()

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
  })

  return response
}

// Products API
export const productsApi = {
  getAll: async (params?: {
    category?: string
    featured?: boolean
    search?: string
    page?: number
    limit?: number
  }) => {
    const searchParams = new URLSearchParams()
    if (params?.category) searchParams.set("category", params.category)
    if (params?.featured) searchParams.set("featured", "true")
    if (params?.search) searchParams.set("search", params.search)
    if (params?.page) searchParams.set("page", params.page.toString())
    if (params?.limit) searchParams.set("limit", params.limit.toString())

    const response = await fetch(`/api/products?${searchParams}`)
    return response.json()
  },

  getById: async (id: string) => {
    const response = await fetch(`/api/products/${id}`)
    return response.json()
  },

  create: async (data: any) => {
    const response = await fetchWithAuth("/api/products", {
      method: "POST",
      body: JSON.stringify(data),
    })
    return response.json()
  },

  update: async (id: string, data: any) => {
    const response = await fetchWithAuth(`/api/products/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    })
    return response.json()
  },

  delete: async (id: string) => {
    const response = await fetchWithAuth(`/api/products/${id}`, {
      method: "DELETE",
    })
    return response.json()
  },

  bulkUpdate: async (ids: string[], updates: any) => {
    const response = await fetchWithAuth("/api/products/bulk", {
      method: "PATCH",
      body: JSON.stringify({ ids, updates }),
    })
    return response.json()
  },

  bulkDelete: async (ids: string[]) => {
    const response = await fetchWithAuth("/api/products/bulk", {
      method: "DELETE",
      body: JSON.stringify({ ids }),
    })
    return response.json()
  },
}

// Categories API
export const categoriesApi = {
  getAll: async () => {
    const response = await fetch("/api/categories")
    return response.json()
  },

  create: async (data: any) => {
    const response = await fetchWithAuth("/api/categories", {
      method: "POST",
      body: JSON.stringify(data),
    })
    return response.json()
  },
}

// Orders API
export const ordersApi = {
  getAll: async (params?: {
    orderId?: string
    phone?: string
    status?: string
    paymentStatus?: string
    startDate?: string
    endDate?: string
    page?: number
    limit?: number
  }) => {
    const searchParams = new URLSearchParams()
    if (params?.orderId) searchParams.set("orderId", params.orderId)
    if (params?.phone) searchParams.set("phone", params.phone)
    if (params?.status) searchParams.set("status", params.status)
    if (params?.paymentStatus) searchParams.set("paymentStatus", params.paymentStatus)
    if (params?.startDate) searchParams.set("startDate", params.startDate)
    if (params?.endDate) searchParams.set("endDate", params.endDate)
    if (params?.page) searchParams.set("page", params.page.toString())
    if (params?.limit) searchParams.set("limit", params.limit.toString())

    const response = await fetchWithAuth(`/api/orders?${searchParams}`)
    return response.json()
  },

  getById: async (id: string) => {
    const response = await fetch(`/api/orders/${id}`)
    return response.json()
  },

  create: async (data: any) => {
    const response = await fetch("/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
    return response.json()
  },

  update: async (id: string, data: any) => {
    const response = await fetchWithAuth(`/api/orders/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    })
    return response.json()
  },

  updateStatus: async (id: string, status: string) => {
    const response = await fetchWithAuth(`/api/orders/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    })
    return response.json()
  },

  delete: async (id: string) => {
    const response = await fetchWithAuth(`/api/orders/${id}`, {
      method: "DELETE",
    })
    return response.json()
  },

  getStats: async (period = "today") => {
    const response = await fetchWithAuth(`/api/orders/stats?period=${period}`)
    return response.json()
  },
}

// Auth API
export const authApi = {
  register: async (data: { name: string; email: string; password: string; phone?: string }) => {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
    return response.json()
  },

  login: async (data: { email: string; password: string }) => {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
    return response.json()
  },

  getCurrentUser: async () => {
    const response = await fetchWithAuth("/api/auth/me")
    return response.json()
  },

  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth-token")
      localStorage.removeItem("user")
      document.cookie = "auth-token=; path=/; max-age=0"
    }
  },
}
