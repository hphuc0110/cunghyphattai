import Link from "next/link"
import { Phone, Mail, MapPin, Clock, Facebook } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t bg-[#FAFAF5]">
      {/* ✅ Container đồng bộ toàn trang */}
      <div className="w-full max-w-[1500px] xl:max-w-[1600px] mx-auto px-6 sm:px-8 md:px-10 lg:px-16 xl:px-24 py-12">
        <div className="grid gap-10 sm:gap-12 md:grid-cols-2 lg:grid-cols-4">
          
          {/* About */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
                <span className="text-xl font-bold text-primary-foreground">恭</span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-primary">Cung Hỷ Phát Tài</span>
                <span className="text-xs text-muted-foreground">Ẩm Thực Trung Hoa</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Mang đến hương vị ẩm thực Trung Hoa chính gốc với các món ăn truyền thống
              được chế biến từ nguyên liệu tươi ngon nhất.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <h3 className="mb-4 font-semibold text-[#E11B22] uppercase tracking-wide">
              Liên Kết
            </h3>
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
              <li>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <h3 className="mb-4 font-semibold text-[#E11B22] uppercase tracking-wide">
              Liên Hệ
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                <a href="tel:0915885888" className="text-muted-foreground hover:text-primary">
                  091 588 58 88
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Facebook className="h-4 w-4 text-primary" />
                <a
                  href="https://www.facebook.com/share/1FjKZxNuiX/?mibextid=wwXIfr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary"
                >
                  Facebook
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">47 Cửa Bắc, Ba Đình, Hà Nội</span>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <h3 className="mb-4 font-semibold text-[#E11B22] uppercase tracking-wide">
              Chính sách
            </h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Link href="/dieu-khoan" className="text-muted-foreground transition-colors hover:text-primary">
                  Điều Khoản Sử Dụng
                </Link>
              </li>
              <li className="flex items-center gap-2">
                <Link href="/hoan-huy" className="text-muted-foreground transition-colors hover:text-primary">
                  Chính Sách Hoàn Hủy
                </Link>
              </li>
              <li className="flex items-center gap-2">
                <Link href="/bao-mat" className="text-muted-foreground transition-colors hover:text-primary">
                  Chính Sách Bảo Mật
                </Link>
              </li>
            </ul> 
          </div>
        </div>

        {/* Bottom line */}
        <div className="mt-10 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Cung Hỷ Phát Tài. Công Ty Cổ Phần Thực Phẩm Đông Lào. Mã số doanh nghiệp: 0110547042 Do Sở Tài Chính Thành Phố Hà Nội cấp ngày 16/06/2025.</p>
        </div>
      </div>
    </footer>
  )
}
