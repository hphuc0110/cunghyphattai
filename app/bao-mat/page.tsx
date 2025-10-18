import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function PrivacyPolicyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#fffaf5]">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative border-b bg-gradient-to-br from-primary/20 via-background/20 to-secondary/20 py-24">
          <div className="container relative z-10 text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold text-primary mb-4">
             Chính Sách Bảo Mật Thông Tin Khách Hàng
            </h1>
            <p className="text-lg text-muted-foreground">
              Quy định về việc bảo mật thông tin khách hàng của Cung Hỷ Phát Tài
            </p>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-20 bg-white text-justify ">
          <div className="container mx-auto max-w-4xl space-y-10 text-muted-foreground text-pretty leading-relaxed">
            {/* 1. Giới thiệu */}
            <div>
              <h2 className="text-2xl font-bold text-primary mb-3">1. Thông tin thu thập</h2>
              <p>
              Nhà hàng Trung Hoa <strong>Cung Hỷ Phát Tài</strong> tôn trọng và cam kết bảo vệ quyền riêng tư của khách hàng.
              Chính sách này giải thích cách chúng tôi thu thập, sử dụng, và bảo vệ thông tin cá nhân của quý khách khi
              sử dụng dịch vụ của nhà hàng.  </p>
            </div>

            {/* 2. Mục đích */}
            <div>
            <h2 className="text-2xl font-bold text-primary mb-3">
            2. Mục đích sử dụng thông tin
            </h2>
            <ul className="list-disc pl-5 space-y-2 text-gray-700">
              <li>Chúng tôi thu thập thông tin cá nhân từ khách hàng khi đặt món hoặc đặt bàn trực tuyến, bao gồm: tên, số điện thoại, địa chỉ email và phương thức thanh toán.</li>
              <li>Thông tin được sử dụng để xử lý đơn hàng, cung cấp dịch vụ và liên hệ khách hàng khi cần thiết.</li>
              <li>Chúng tôi không bán, chia sẻ hoặc tiết lộ thông tin cá nhân cho bên thứ ba ngoại trừ trường hợp được quý khách cho phép hoặc yêu cầu.</li>
            </ul>
          </div>

            {/* 3. Quyền và nghĩa vụ của người dùng */}
            <div>
            <h2 className="text-2xl font-bold text-primary mb-3">
               3. Bảo mật thông tin
            </h2>
            <ul className="list-disc pl-5 space-y-2 text-gray-700">
              <li>Thông tin cá nhân được bảo mật và chỉ sử dụng cho mục đích phục vụ khách hàng.</li>
              <li>Chúng tôi không chia sẻ thông tin cá nhân với bên thứ ba ngoại trừ trường hợp được quý khách cho phép hoặc yêu cầu.</li>
            </ul>
          </div>

          <div>
              <h2 className="text-2xl font-bold text-primary mb-3">4. Chia sẻ thông tin</h2>
              <p>
                Chúng tôi không chia sẻ thông tin cá nhân với bên thứ ba ngoại trừ trường hợp được quý khách cho phép hoặc yêu cầu.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-primary mb-3">5. Thông tin liên hệ</h2>
              <p>
                Nếu quý khách có bất kỳ thắc mắc nào liên quan đến bảo mật thông tin cá nhân, vui lòng liên hệ với chúng tôi qua:
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
              <h2 className="text-2xl font-bold text-primary mb-3">6. Hiệu lực của chính sách</h2>
              <p>
                Chính sách này có hiệu lực kể từ ngày được đăng tải trên website và có thể được cập nhật, sửa đổi mà
                không cần thông báo trước. Quý khách nên thường xuyên kiểm tra để nắm được thông tin mới nhất. Chúng tôi có quyền thay đổi chính sách này mà không cần thông báo trước.         
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
