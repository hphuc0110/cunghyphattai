"use client"

import { useEffect } from "react"
import { useCartStore } from "@/lib/cart-store"

// Hook to initialize cart store and validate data
export function useCartInitializer() {
  const initialize = useCartStore((state) => state.initialize)

  useEffect(() => {
    // Initialize and validate cart data on mount
    initialize()
  }, [initialize])
}
