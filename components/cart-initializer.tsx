"use client"

import { useCartInitializer } from "@/hooks/use-cart-initializer"

export function CartInitializer({ children }: { children: React.ReactNode }) {
  useCartInitializer()
  return <>{children}</>
}
