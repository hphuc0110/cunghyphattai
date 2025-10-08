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
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="border-b bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-16">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="mb-4 text-4xl font-bold text-balance md:text-5xl">Về Cung Hỷ Phát Tài</h1>
              <p className="text-lg text-muted-foreground text-pretty">
                Mang đến hương vị ẩm thực Trung Hoa chính gốc cho người Việt
              </p>
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-16">
          <div className="container">
            <div className="mx-auto max-w-3xl space-y-6 text-center">
              <h2 className="text-3xl font-bold text-balance">Câu Chuyện Của Chúng Tôi</h2>
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
        <section className="bg-muted/50 py-16">
          <div className="container">
            <div className="mb-12 text-center">
              <h2 className="mb-3 text-3xl font-bold text-balance">Giá Trị Cốt Lõi</h2>
              <p className="text-muted-foreground text-pretty">Những giá trị mà chúng tôi luôn hướng tới</p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {values.map((value) => {
                const Icon = value.icon
                return (
                  <Card key={value.title}>
                    <CardContent className="p-6 text-center">
                      <div className="mb-4 flex justify-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                          <Icon className="h-8 w-8 text-primary" />
                        </div>
                      </div>
                      <h3 className="mb-2 font-semibold">{value.title}</h3>
                      <p className="text-sm text-muted-foreground text-pretty">{value.description}</p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16">
          <div className="container">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="mb-4 text-3xl font-bold text-balance">Liên Hệ Với Chúng Tôi</h2>
              <p className="mb-8 text-muted-foreground text-pretty">
                Hãy đến và trải nghiệm hương vị ẩm thực Trung Hoa chính gốc tại Cung Hỷ Phát Tài
              </p>
              <div className="space-y-4 text-left">
                <div className="rounded-lg border p-4">
                  <div className="font-medium">Địa chỉ</div>
                  <div className="text-muted-foreground">47 Cửa Bắc, Ba Đình, Hà Nội</div>
                </div>
                <div className="rounded-lg border p-4">
                  <div className="font-medium">Điện thoại</div>
                  <div className="text-muted-foreground">
                    <a href="tel:091 588 58 88" className="hover:text-primary">
                      091 588 58 88
                    </a>
                  </div>
                </div>
                <div className="rounded-lg border p-4">
                  <div className="font-medium">Email</div>
                  <div className="text-muted-foreground">
                  <a
  href="https://www.facebook.com/share/1FjKZxNuiX/?mibextid=wwXIfr"
  target="_blank"
  rel="noopener noreferrer"
  className="hover:text-primary"
>
  https://www.facebook.com/share/1FjKZxNuiX/?mibextid=wwXIfr
</a>

                  </div>
                </div>
                <div className="rounded-lg border p-4">
                  <div className="font-medium">Giờ mở cửa</div>
                  <div className="text-muted-foreground">
                    <div>10h - 14h, 17h -22h</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
