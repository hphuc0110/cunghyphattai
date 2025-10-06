"use client"

import { useState, useEffect } from "react"
import { MenuCard } from "./menu-card"
import { productsApi } from "@/lib/api"

interface MenuSectionProps {
  category: string
  title: string
  titleEn: string
}

export function MenuSection({ category, title, titleEn }: MenuSectionProps) {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await productsApi.getAll({ category })
        if (response.success) {
          setProducts(response.data)
        }
      } catch (error) {
        console.error("[v0] Error fetching products:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [category])

  if (loading) {
    return (
      <section id={category} className="py-16">
        <div className="container">
          <h2 className="font-serif text-3xl md:text-4xl mb-8 text-center">{title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (products.length === 0) {
    return null
  }

  return (
    <section id={category} className="py-16">
      <div className="container">
        <h2 className="font-serif text-3xl md:text-4xl mb-8 text-center">{title}</h2>
        <p className="text-center text-muted-foreground mb-12">{titleEn}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <MenuCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}
