import React from 'react';
import { Helmet } from 'react-helmet';
import { CheckCircleIcon, HeartIcon, ShieldCheckIcon, TruckIcon } from '@heroicons/react/24/outline';

const About = () => {
  const features = [
    {
      icon: CheckCircleIcon,
      title: 'Chất lượng đảm bảo',
      description: 'Tất cả sản phẩm đều được kiểm tra chất lượng nghiêm ngặt trước khi đến tay khách hàng.'
    },
    {
      icon: HeartIcon,
      title: 'An toàn sức khỏe',
      description: 'Chúng tôi cam kết cung cấp những sản phẩm an toàn, tốt cho sức khỏe của bạn và gia đình.'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Thanh toán an toàn',
      description: 'Hệ thống thanh toán VietQR an toàn, bảo mật thông tin khách hàng tuyệt đối.'
    },
    {
      icon: TruckIcon,
      title: 'Giao hàng nhanh chóng',
      description: 'Giao hàng tận nơi, đảm bảo sản phẩm tươi ngon và chất lượng khi đến tay bạn.'
    }
  ];

  const team = [
    {
      name: 'Nguyễn Văn A',
      role: 'Giám đốc điều hành',
      image: '/team-1.jpg',
      description: 'Với hơn 10 năm kinh nghiệm trong ngành thực phẩm sạch.'
    },
    {
      name: 'Trần Thị B',
      role: 'Trưởng phòng Chất lượng',
      image: '/team-2.jpg',
      description: 'Chuyên gia kiểm soát chất lượng với bằng cấp quốc tế.'
    },
    {
      name: 'Lê Văn C',
      role: 'Trưởng phòng Marketing',
      image: '/team-3.jpg',
      description: 'Chuyên gia marketing với nhiều năm kinh nghiệm trong ngành F&B.'
    }
  ];

  return (
    <div>
      <Helmet>
        <title>Về chúng tôi - HN FOOD</title>
        <meta name="description" content="Tìm hiểu về HN FOOD - đơn vị cung cấp thực phẩm sạch và sản phẩm chăm sóc sức khỏe uy tín" />
      </Helmet>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Về HN FOOD
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto opacity-90">
            Chúng tôi cam kết mang đến những sản phẩm thực phẩm sạch, 
            an toàn và chất lượng cao nhất cho sức khỏe của bạn và gia đình
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Câu chuyện của chúng tôi
              </h2>
              <div className="w-20 h-1 bg-primary-600 mx-auto"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <img
                  src="/about-story.jpg"
                  alt="HN FOOD Story"
                  className="rounded-lg shadow-lg w-full"
                />
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  Khởi nguồn từ tình yêu với thực phẩm sạch
                </h3>
                <p className="text-gray-600 mb-4">
                  HN FOOD được thành lập với sứ mệnh mang đến những sản phẩm thực phẩm 
                  sạch, an toàn và chất lượng cao cho người tiêu dùng Việt Nam. 
                  Chúng tôi hiểu rằng sức khỏe là tài sản quý giá nhất của mỗi gia đình.
                </p>
                <p className="text-gray-600 mb-4">
                  Với đội ngũ chuyên gia giàu kinh nghiệm và hệ thống kiểm soát chất lượng 
                  nghiêm ngặt, chúng tôi tự tin mang đến những sản phẩm tốt nhất, 
                  từ thực phẩm hữu cơ đến các sản phẩm chăm sóc sức khỏe.
                </p>
                <p className="text-gray-600">
                  Đặc biệt, chúng tôi tiên phong trong việc áp dụng công nghệ thanh toán 
                  VietQR hiện đại, giúp khách hàng có trải nghiệm mua sắm thuận tiện và an toàn nhất.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Tại sao chọn HN FOOD?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Chúng tôi cam kết mang đến những giá trị tốt nhất cho khách hàng
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Đội ngũ của chúng tôi
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Những con người tận tâm đứng sau thành công của HN FOOD
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="text-center">
                <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4 overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=0ea5e9&color=fff&size=128`;
                    }}
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-1">
                  {member.name}
                </h3>
                <p className="text-primary-600 font-medium mb-2">
                  {member.role}
                </p>
                <p className="text-gray-600 text-sm">
                  {member.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Giá trị cốt lõi
            </h2>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Những nguyên tắc định hướng mọi hoạt động của chúng tôi
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-3">Chất lượng</h3>
              <p className="opacity-90">
                Cam kết cung cấp những sản phẩm chất lượng cao nhất, 
                được kiểm tra nghiêm ngặt.
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-3">Tin cậy</h3>
              <p className="opacity-90">
                Xây dựng niềm tin với khách hàng thông qua sự minh bạch 
                và dịch vụ tận tâm.
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-3">Đổi mới</h3>
              <p className="opacity-90">
                Không ngừng cải tiến và áp dụng công nghệ mới để phục vụ 
                khách hàng tốt hơn.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Liên hệ với chúng tôi
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Có câu hỏi hoặc cần hỗ trợ? Đội ngũ HN FOOD luôn sẵn sàng lắng nghe và hỗ trợ bạn.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
            >
              Liên hệ ngay
            </a>
            <a
              href="tel:0123456789"
              className="border-2 border-primary-600 text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-primary-600 hover:text-white transition-colors"
            >
              Gọi điện: 0123 456 789
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
