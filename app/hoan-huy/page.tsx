import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#fffaf5]">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative border-b bg-gradient-to-br from-primary/20 via-background/20 to-secondary/20 py-24">
          <div className="container relative z-10 text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold text-primary mb-4">
             Chính Sách Hoàn Hủy
            </h1>
            <p className="text-lg text-muted-foreground">
              Quy định về việc hoàn hủy đơn hàng của Cung Hỷ Phát Tài
            </p>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-20 bg-white text-justify ">
          <div className="container mx-auto max-w-4xl space-y-10 text-muted-foreground text-pretty leading-relaxed">
            {/* 1. Giới thiệu */}
            <div>
              <h2 className="text-2xl font-bold text-primary mb-3">1. Giới thiệu</h2>
              <p>
              Nhà hàng Trung Hoa <strong>Cung Hỷ Phát Tài</strong> luôn mong muốn mang đến trải nghiệm ẩm thực
          tốt nhất cho quý khách. Chính sách hoàn hủy dưới đây được áp dụng nhằm đảm bảo quyền lợi
          của khách hàng cũng như quy trình phục vụ chuyên nghiệp, minh bạch.  </p>
            </div>

            {/* 2. Mục đích */}
            <div>
            <h2 className="text-2xl font-bold text-primary mb-3">
              2. Chính sách hủy đặt bàn / đặt món
            </h2>
            <ul className="list-disc pl-5 space-y-2 text-gray-700">
              <li>Quý khách có thể hủy đơn trong vòng <strong>20 phút</strong> kể từ khi đặt mà không bị tính phí.</li>
              <li>Nếu nhà hàng đã chuẩn bị hoặc chế biến món, chúng tôi không thể hoàn tiền.</li>
              <li>Trường hợp quý khách không đến mà không báo trước, đơn hàng sẽ bị xem là hủy không hợp lệ.</li>
            </ul>
          </div>

            {/* 3. Quyền và nghĩa vụ của người dùng */}
            <div>
            <h2 className="text-2xl font-bold text-primary mb-3">
               3. Chính sách hoàn tiền
            </h2>
            <ul className="list-disc pl-5 space-y-2 text-gray-700">
              <li>Hoàn <strong>100% giá trị đơn hàng</strong> nếu lỗi từ phía nhà hàng.</li>
              <li>Tiền hoàn theo phương thức thanh toán ban đầu trong <strong>7 – 14 ngày làm việc</strong>.</li>
              <li>Với thanh toán tiền mặt, khách hàng có thể nhận lại trực tiếp trong ngày.</li>
            </ul>
          </div>

          <div>
              <h2 className="text-2xl font-bold text-primary mb-3">4. Liên hệ</h2>
              <p>
                Nếu quý khách có bất kỳ thắc mắc nào liên quan đến các điều khoản trên, vui lòng liên hệ với chúng tôi qua:
              </p>
              <ul className="list-disc pl-6 mt-3 space-y-1">
                <li>📍 Địa chỉ: 47 Cửa Bắc, Ba Đình, Hà Nội</li>
                <li>📞 Điện thoại: <a href="tel:0915885888" className="text-primary hover:underline">091 588 58 88</a></li>
                <li>🌐 Facebook:{" "}
                  <a
                    href="https://www.facebook.com/share/1FjKZxNuiX/?mibextid=wwXIfr"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline break-all"
                  >
                    www.facebook.com/CungHyPhatTai
                  </a>
                </li>
              </ul>
            </div>

            {/* 8. Hiệu lực */}
            <div>
              <h2 className="text-2xl font-bold text-primary mb-3">5. Hiệu lực của điều khoản</h2>
              <p>
                Các điều khoản này có hiệu lực kể từ ngày được đăng tải trên website và có thể được cập nhật, sửa đổi mà
                không cần thông báo trước. Quý khách nên thường xuyên kiểm tra để nắm được thông tin mới nhất.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
