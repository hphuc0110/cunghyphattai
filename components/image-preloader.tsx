"use client"

import { useEffect } from "react"

interface ImagePreloaderProps {
  images: string[]
}

/**
 * Preload critical images để tăng tốc load
 */
export function ImagePreloader({ images }: ImagePreloaderProps) {
  useEffect(() => {
    // Preload first 4 critical images để giảm tải
    const criticalImages = images.slice(0, 4)
    
    criticalImages.forEach((src) => {
      if (src) {
        const link = document.createElement("link")
        link.rel = "preload"
        link.as = "image"
        link.href = src
        link.setAttribute("fetchpriority", "high")
        document.head.appendChild(link)
      }
    })

    // Cleanup
    return () => {
      criticalImages.forEach((src) => {
        if (src) {
          const links = document.head.querySelectorAll(`link[href="${src}"]`)
          links.forEach((link) => link.remove())
        }
      })
    }
  }, [images])

  return null
}

