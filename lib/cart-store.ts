"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { CartItem, Product } from "./types"

interface CartStore {
  items: CartItem[]
  initialize: () => void
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void
  removeItem: (id: string, variantId?: string) => void
  updateQuantity: (id: string, quantity: number, variantId?: string) => void
  updateInstructions: (id: string, instructions: string, variantId?: string) => void
  clearCart: () => void
  getTotal: () => number
  getItemCount: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      // Initialize with validation
      initialize: () => {
        const state = get()
        const validItems = state.items.filter(item => 
          item && 
          item.product && 
          typeof item.quantity === 'number' && 
          item.quantity > 0
        )
        
        if (validItems.length !== state.items.length) {
          console.warn('Removed invalid cart items:', state.items.length - validItems.length)
          set({ items: validItems })
        }
      },

      addItem: (newItem) => {
        set((state) => {
          // Validate the new item before adding
          if (!newItem || !newItem.product) {
            console.error('Invalid item being added to cart:', newItem)
            return state
          }

          const existingItemIndex = state.items.findIndex(
            (item) => item.id === newItem.id && item.variant?.id === newItem.variant?.id,
          )

          if (existingItemIndex > -1) {
            // Item exists, increase quantity
            const updatedItems = [...state.items]
            updatedItems[existingItemIndex].quantity += newItem.quantity || 1
            return { items: updatedItems }
          }

          // New item, add to cart
          return {
            items: [...state.items, { ...newItem, quantity: newItem.quantity || 1 }],
          }
        })
      },

      removeItem: (id, variantId) => {
        set((state) => ({
          items: state.items.filter((item) => !(item.id === id && item.variant?.id === variantId)),
        }))
      },

      updateQuantity: (id, quantity, variantId) => {
        if (quantity <= 0) {
          get().removeItem(id, variantId)
          return
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.id === id && item.variant?.id === variantId ? { ...item, quantity } : item,
          ),
        }))
      },

      updateInstructions: (id, instructions, variantId) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id && item.variant?.id === variantId
              ? { ...item, specialInstructions: instructions }
              : item,
          ),
        }))
      },

      clearCart: () => {
        set({ items: [] })
        // Also clear localStorage to prevent corrupted data
        localStorage.removeItem('cart-storage')
      },

      getTotal: () => {
        return get().items.reduce((total, item) => {
          // Add safety checks for item and product
          if (!item || !item.product) {
            console.warn('Invalid cart item:', item)
            return total
          }
          
          const price = item.variant?.price || item.product.price || 0
          return total + price * item.quantity
        }, 0)
      },

      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0)
      },
    }),
    {
      name: "cart-storage",
    },
  ),
)
