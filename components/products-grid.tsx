"use client"

import { memo, useMemo } from "react"
import { ProductCard } from "@/components/product-card"
import type { Product } from "@/lib/types"

interface ProductsGridProps {
  products: Product[]
  backImage: string
}

// Memoize từng card item để tránh re-render
const ProductCardItem = memo(
  ({ product, backImage, priority, index }: { product: Product; backImage: string; priority: boolean; index: number }) => (
    <div
      key={product.id}
      className="transition-transform duration-300 hover:-translate-y-2 hover:scale-[1.01]"
    >
      <ProductCard
        product={product}
        backImage={backImage}
        priority={priority}
        index={index}
      />
    </div>
  ),
  (prevProps, nextProps) => {
    // Chỉ re-render nếu product thay đổi
    return (
      prevProps.product.id === nextProps.product.id &&
      prevProps.product.image === nextProps.product.image &&
      prevProps.product.name === nextProps.product.name &&
      prevProps.product.available === nextProps.product.available &&
      prevProps.product.price === nextProps.product.price &&
      prevProps.backImage === nextProps.backImage &&
      prevProps.priority === nextProps.priority
    )
  },
)

ProductCardItem.displayName = "ProductCardItem"

export function ProductsGrid({ products, backImage }: ProductsGridProps) {
  // Memoize products để tránh re-render khi props không đổi
  const memoizedProducts = useMemo(() => products, [products])

  return (
    <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
      {memoizedProducts.map((product, index) => (
        <ProductCardItem
          key={product.id}
          product={product}
          backImage={backImage}
          priority={index < 4}
          index={index}
        />
      ))}
    </div>
  )
}

// Memoize toàn bộ grid để tránh re-render
export const MemoizedProductsGrid = memo(
  ProductsGrid,
  (prevProps, nextProps) => {
    // Chỉ re-render nếu products list thay đổi
    if (prevProps.products.length !== nextProps.products.length) return false
    
    // Kiểm tra từng product có thay đổi không
    const productsChanged = prevProps.products.some(
      (prevProduct, index) => {
        const nextProduct = nextProps.products[index]
        return (
          !nextProduct ||
          prevProduct.id !== nextProduct.id ||
          prevProduct.image !== nextProduct.image ||
          prevProduct.name !== nextProduct.name ||
          prevProduct.available !== nextProduct.available ||
          prevProduct.price !== nextProduct.price
        )
      }
    )
    
    return !productsChanged && prevProps.backImage === nextProps.backImage
  },
)

MemoizedProductsGrid.displayName = "MemoizedProductsGrid"

