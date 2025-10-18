"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface InfiniteMovingCardsProps {
  items: {
    id: string | number
    content: React.ReactNode
  }[]
  speed?: "slow" | "normal" | "fast"
  duration?: number // Duration in milliseconds
  direction?: "left" | "right"
  pauseOnHover?: boolean
  className?: string
}

export function InfiniteMovingCards({
  items,
  speed = "slow",
  duration,
  direction = "left",
  pauseOnHover = true,
  className,
}: InfiniteMovingCardsProps) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const scrollerRef = React.useRef<HTMLUListElement>(null)

  // Clone các phần tử để tạo hiệu ứng vô tận
  React.useEffect(() => {
    if (scrollerRef.current) {
      const scrollerContent = Array.from(scrollerRef.current.children)
      scrollerContent.forEach((item) => {
        const duplicatedItem = item.cloneNode(true)
        scrollerRef.current?.appendChild(duplicatedItem)
      })
    }
  }, [items])

  const speedMap = {
    slow: "60s",
    normal: "40s",
    fast: "25s",
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-full overflow-hidden",
        pauseOnHover && "hover:[&>*]:[animation-play-state:paused]",
        className
      )}
    >
      <ul
        ref={scrollerRef}
        className={cn(
          "flex min-w-full gap-4 py-4 w-max",
          direction === "left"
            ? "animate-scroll-left"
            : "animate-scroll-right"
        )}
        style={{
          animationDuration: duration ? `${duration}ms` : speedMap[speed],
        }}
      >
        {items.map((item) => (
          <li key={item.id} className="shrink-0">
            {item.content}
          </li>
        ))}
      </ul>
    </div>
  )
}