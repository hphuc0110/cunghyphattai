/**
 * Simple in-memory image cache để tránh load lại ảnh đã load
 */
class ImageCache {
  private cache: Set<string> = new Set()
  private loadedImages: Map<string, boolean> = new Map()

  /**
   * Kiểm tra xem ảnh đã được load chưa
   */
  isLoaded(src: string): boolean {
    return this.loadedImages.get(src) === true
  }

  /**
   * Đánh dấu ảnh đã được load
   */
  markLoaded(src: string): void {
    this.loadedImages.set(src, true)
    this.cache.add(src)
  }

  /**
   * Kiểm tra xem ảnh đã được cache chưa (đang load hoặc đã load)
   */
  isCached(src: string): boolean {
    return this.cache.has(src)
  }

  /**
   * Clear cache (nếu cần)
   */
  clear(): void {
    this.cache.clear()
    this.loadedImages.clear()
  }
}

export const imageCache = new ImageCache()

