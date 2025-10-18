import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Award, Heart, Users, Clock } from "lucide-react"

export default function AboutPage() {
  const values = [
    {
      icon: Award,
      title: "Chất Lượng Hàng Đầu",
      description: "Cam kết sử dụng nguyên liệu tươi ngon nhất, chế biến theo công thức truyền thống",
    },
    {
      icon: Heart,
      title: "Phục Vụ Tận Tâm",
      description: "Đội ngũ nhân viên nhiệt tình, chu đáo, luôn đặt khách hàng lên hàng đầu",
    },
    {
      icon: Users,
      title: "Đầu Bếp Chuyên Nghiệp",
      description: "Đội ngũ đầu bếp giàu kinh nghiệm, được đào tạo bài bản tại Trung Quốc",
    },
    {
      icon: Clock,
      title: "Giao Hàng Nhanh Chóng",
      description: "Cam kết giao hàng trong 30-45 phút, đảm bảo món ăn nóng hổi",
    },
  ]

  return (
    <div className="flex min-h-screen flex-col bg-[#fffaf5]">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative border-b bg-gradient-to-br from-primary/20 via-background/20 to-secondary/20 py-24">
          <div className="container relative z-10">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="mb-4 text-4xl font-extrabold text-primary md:text-5xl">
                Về Cung Hỷ Phát Tài
              </h1>
              <p className="text-lg text-muted-foreground text-pretty">
                Mang đến hương vị ẩm thực Trung Hoa chính gốc cho người Việt
              </p>
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-20 bg-white">
          <div className="container">
            <div className="mx-auto max-w-3xl space-y-6 text-center">
              <h2 className="text-3xl font-bold text-primary">Câu Chuyện Của Chúng Tôi</h2>
              <div className="space-y-4 text-muted-foreground text-pretty">
                <p>
                  Cung Hỷ Phát Tài được thành lập với mong muốn mang đến cho thực khách những món ăn Trung Hoa chính
                  gốc, được chế biến theo công thức truyền thống từ các vùng miền khác nhau của Trung Quốc.
                </p>
                <p>
                  Với đội ngũ đầu bếp giàu kinh nghiệm, được đào tạo bài bản, chúng tôi tự hào giữ gìn và phát huy những
                  tinh hoa ẩm thực Trung Hoa, từ món gà vịt quay giòn rụm, dimsum hấp tươi ngon, đến các món mì xào thơm
                  phức và lẩu đậm đà.
                </p>
                <p>
                  Chúng tôi cam kết sử dụng nguyên liệu tươi ngon nhất, chế biến cẩn thận từng món ăn để mang đến cho
                  quý khách những trải nghiệm ẩm thực tuyệt vời nhất.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 bg-gradient-to-r from-red-50 via-yellow-50 to-red-50">
          <div className="container">
            <div className="mb-12 text-center">
              <h2 className="mb-3 text-3xl font-bold text-primary">Giá Trị Cốt Lõi</h2>
              <p className="text-muted-foreground text-pretty">Những giá trị mà chúng tôi luôn hướng tới</p>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {values.map((value) => {
                const Icon = value.icon
                return (
                  <Card
                    key={value.title}
                    className="transform rounded-xl border shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                  >
                    <CardContent className="p-6 text-center">
                      <div className="mb-4 flex justify-center">
                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/20">
                          <Icon className="h-10 w-10 text-primary" />
                        </div>
                      </div>
                      <h3 className="mb-2 text-lg font-semibold text-primary">{value.title}</h3>
                      <p className="text-sm text-muted-foreground text-pretty">{value.description}</p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-24 bg-gradient-to-br from-red-50 via-yellow-50 to-red-50 relative overflow-hidden">
  {/* Optional decorative element */}
  <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-red-100 opacity-20 blur-3xl"></div>
  <div className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full bg-yellow-100 opacity-20 blur-3xl"></div>

  <div className="container relative z-10">
    <div className="mx-auto max-w-2xl text-center">
      <h2 className="mb-4 text-3xl md:text-4xl font-extrabold text-red-600">
        Liên Hệ Với Chúng Tôi
      </h2>
      <p className="mb-12 text-muted-foreground text-lg md:text-xl">
        Hãy đến và trải nghiệm hương vị ẩm thực Trung Hoa chính gốc tại Cung Hỷ Phát Tài
      </p>
      <div className="grid gap-8 sm:grid-cols-2">
        {[
          {
            title: "Địa chỉ",
            content: "47 Cửa Bắc, Ba Đình, Hà Nội",
            icon: "🏠",
          },
          {
            title: "Điện thoại",
            content: "091 588 58 88",
            icon: "📞",
            link: "tel:0915885888",
          },
          {
            title: "Facebook",
            content: "https://www.facebook.com/share/1FjKZxNuiX/?mibextid=wwXIfr",
            icon: "🌐",
            link: "https://www.facebook.com/share/1FjKZxNuiX/?mibextid=wwXIfr",
          },
          {
            title: "Giờ mở cửa",
            content: "10h - 14h, 17h - 22h",
            icon: "⏰",
          },
        ].map((item) => (
          <div
            key={item.title}
            className="flex flex-col items-center rounded-2xl border border-red-200 p-8 shadow-lg bg-white transition-transform duration-300 hover:scale-105 hover:shadow-2xl"
          >
            <div className="mb-4 text-4xl">{item.icon}</div>
            <div className="font-semibold text-lg mb-1 text-red-600">{item.title}</div>
            {item.link ? (
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-red-500 underline text-center break-all"
              >
                {item.content}
              </a>
            ) : (
              <div className="text-muted-foreground text-center">{item.content}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  </div>
</section>

      </main>

      <Footer />
    </div>
  )
}
