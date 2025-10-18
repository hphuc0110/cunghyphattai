"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface TextGenerateEffectProps {
  text: string
  className?: string
  duration?: number
  delay?: number
}

export function TextGenerateEffect({ text, className, duration = 50, delay = 0 }: TextGenerateEffectProps) {
  const [displayedText, setDisplayedText] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    // Reset when text changes
    setDisplayedText("")
    setCurrentIndex(0)

    const startTimeout = setTimeout(() => {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => {
          if (prev >= text.length) {
            clearInterval(interval)
            return prev
          }
          setDisplayedText(text.slice(0, prev + 1))
          return prev + 1
        })
      }, duration)

      return () => clearInterval(interval)
    }, delay)

    return () => clearTimeout(startTimeout)
  }, [text, duration, delay])

  return (
    <span className={cn("inline-block", className)}>
      {displayedText}
      {currentIndex < text.length && <span className="animate-pulse">|</span>}
    </span>
  )
}
