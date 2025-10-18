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
              Điều Khoản Sử Dụng
            </h1>
            <p className="text-lg text-muted-foreground">
              Quy định về việc sử dụng dịch vụ và website của Cung Hỷ Phát Tài
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
                Chào mừng quý khách đến với <strong>Cung Hỷ Phát Tài</strong>. Khi truy cập và sử dụng website hoặc dịch vụ
                của chúng tôi, quý khách được xem là đã đọc, hiểu và đồng ý tuân thủ các điều khoản sử dụng này.
              </p>
            </div>

            {/* 2. Mục đích */}
            <div>
              <h2 className="text-2xl font-bold text-primary mb-3">2. Mục đích website</h2>
              <p>
                Website <strong>Cung Hỷ Phát Tài</strong> được xây dựng nhằm cung cấp thông tin về nhà hàng, thực đơn, ưu đãi và
                dịch vụ đặt món trực tuyến cho khách hàng. Chúng tôi không chịu trách nhiệm nếu thông tin bị sử dụng sai
                mục đích hoặc ngoài phạm vi cho phép.
              </p>
            </div>

            {/* 3. Quyền và nghĩa vụ của người dùng */}
            <div>
              <h2 className="text-2xl font-bold text-primary mb-3">3. Quyền và nghĩa vụ của người dùng</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Khách hàng có quyền truy cập, đặt món, và liên hệ với nhà hàng qua các kênh chính thức.</li>
                <li>Không được sao chép, chỉnh sửa, hoặc sử dụng trái phép nội dung, hình ảnh thuộc quyền sở hữu của nhà hàng.</li>
                <li>Không sử dụng website để phát tán thông tin sai lệch, gây ảnh hưởng đến uy tín của nhà hàng hoặc bên thứ ba.</li>
              </ul>
            </div>

            {/* 4. Quyền của nhà hàng */}
            <div>
              <h2 className="text-2xl font-bold text-primary mb-3">4. Quyền của nhà hàng</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Chúng tôi có quyền cập nhật, thay đổi, hoặc tạm ngừng cung cấp dịch vụ mà không cần thông báo trước.</li>
                <li>Nhà hàng có quyền từ chối phục vụ các yêu cầu không hợp lệ hoặc vi phạm quy định của chúng tôi.</li>
                <li>Chúng tôi có quyền điều chỉnh giá, thực đơn, chương trình khuyến mãi theo thời điểm mà không cần thông báo trước.</li>
              </ul>
            </div>

            {/* 5. Chính sách bảo mật */}
            <div>
              <h2 className="text-2xl font-bold text-primary mb-3">5. Chính sách bảo mật</h2>
              <p>
                Mọi thông tin cá nhân mà quý khách cung cấp (như tên, số điện thoại, địa chỉ) sẽ được bảo mật tuyệt đối và
                chỉ sử dụng cho mục đích phục vụ khách hàng. Chúng tôi không chia sẻ thông tin này với bất kỳ bên thứ ba nào
                nếu không có sự đồng ý của quý khách.
              </p>
            </div>

            {/* 6. Trách nhiệm pháp lý */}
            <div>
              <h2 className="text-2xl font-bold text-primary mb-3">6. Giới hạn trách nhiệm</h2>
              <p>
                Cung Hỷ Phát Tài không chịu trách nhiệm với các thiệt hại gián tiếp hoặc hậu quả phát sinh từ việc sử dụng
                website, bao gồm nhưng không giới hạn: lỗi truy cập, mất dữ liệu hoặc gián đoạn dịch vụ.
              </p>
            </div>

            {/* 7. Liên hệ */}
            <div>
              <h2 className="text-2xl font-bold text-primary mb-3">7. Liên hệ</h2>
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
              <h2 className="text-2xl font-bold text-primary mb-3">8. Hiệu lực của điều khoản</h2>
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
