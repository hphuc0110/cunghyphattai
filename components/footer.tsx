import Link from "next/link"
import { Phone, Mail, MapPin, Clock } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t bg-muted/50">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* About */}
          <div>
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
                <span className="text-xl font-bold text-primary-foreground">恭</span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-primary">Cung Hỷ Phát Tài</span>
                <span className="text-xs text-muted-foreground">Ẩm Thực Trung Hoa</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Mang đến hương vị ẩm thực Trung Hoa chính gốc với các món ăn truyền thống được chế biến từ nguyên liệu
              tươi ngon nhất.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 font-semibold">Liên Kết</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-muted-foreground transition-colors hover:text-primary">
                  Trang Chủ
                </Link>
              </li>
              <li>
                <Link href="/menu" className="text-muted-foreground transition-colors hover:text-primary">
                  Thực Đơn
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted-foreground transition-colors hover:text-primary">
                  Giới Thiệu
                </Link>
              </li>
              <li>
                <Link href="/track-order" className="text-muted-foreground transition-colors hover:text-primary">
                  Theo Dõi Đơn Hàng
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 font-semibold">Liên Hệ</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <Phone className="mt-0.5 h-4 w-4 text-primary" />
                <div>
                  <a href="tel:091 588 58 88" className="text-muted-foreground hover:text-primary">
                    091 588 58 88
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="mt-0.5 h-4 w-4 text-primary" />
                <div>
                <a
  href="https://www.facebook.com/share/1FjKZxNuiX/?mibextid=wwXIfr"
  target="_blank"
  rel="noopener noreferrer"
  className="hover:text-primary"
>
 Facebook
</a>

                </div>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 text-primary" />
                <span className="text-muted-foreground">47 Cửa Bắc, Ba Đình, Hà Nội</span>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h3 className="mb-4 font-semibold">Giờ Mở Cửa</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <Clock className="mt-0.5 h-4 w-4 text-primary" />
                <div className="text-muted-foreground">
                  <div>10h - 14h, 17h -22h</div>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Cung Hỷ Phát Tài. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
