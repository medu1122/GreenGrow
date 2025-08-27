import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Leaf, 
  Camera, 
  Brain, 
  Shield, 
  Zap, 
  Users, 
  BarChart3,
  MessageCircle,
  ArrowRight,
  CheckCircle,
  Star
} from 'lucide-react';

const Home = () => {
  const { user } = useAuth();

  const features = [
    {
      icon: Camera,
      title: 'Chụp ảnh thông minh',
      description: 'Chụp ảnh cây trồng và nhận kết quả phân tích ngay lập tức'
    },
    {
      icon: Brain,
      title: 'AI tiên tiến',
      description: 'Sử dụng công nghệ AI hiện đại để nhận diện cây và bệnh chính xác'
    },
    {
      icon: Shield,
      title: 'Bảo mật dữ liệu',
      description: 'Thông tin của bạn được bảo vệ an toàn và riêng tư'
    },
    {
      icon: Zap,
      title: 'Kết quả nhanh chóng',
      description: 'Nhận kết quả phân tích trong vài giây với độ chính xác cao'
    }
  ];

  const benefits = [
    'Nhận diện hơn 10,000 loài cây trồng',
    'Phát hiện 50+ loại bệnh phổ biến',
    'Hướng dẫn điều trị chi tiết',
    'AI Chat hỗ trợ 24/7',
    'Lưu trữ lịch sử phân tích',
    'Tích hợp thông tin thời tiết'
  ];

  const testimonials = [
    {
      name: 'Nguyễn Văn A',
      role: 'Nông dân',
      content: 'PlantAI giúp tôi phát hiện bệnh sớm và có hướng điều trị hiệu quả.',
      rating: 5
    },
    {
      name: 'Trần Thị B',
      role: 'Chủ vườn',
      content: 'Giao diện dễ sử dụng, kết quả chính xác. Rất hài lòng!',
      rating: 5
    },
    {
      name: 'Lê Văn C',
      role: 'Kỹ sư nông nghiệp',
      content: 'Công cụ hỗ trợ tuyệt vời cho việc chăm sóc cây trồng.',
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-green-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center">
                <Leaf className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Phân tích bệnh cây trồng
              <span className="text-primary-600"> bằng AI</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Sử dụng công nghệ AI tiên tiến để nhận diện cây trồng và phát hiện bệnh 
              từ hình ảnh với độ chính xác cao. Hỗ trợ tư vấn điều trị và chăm sóc.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                <Link
                  to="/analysis"
                  className="btn-primary text-lg px-8 py-3 flex items-center justify-center space-x-2"
                >
                  <Camera className="w-5 h-5" />
                  <span>Bắt đầu phân tích</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="btn-primary text-lg px-8 py-3 flex items-center justify-center space-x-2"
                  >
                    <span>Đăng ký miễn phí</span>
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                  <Link
                    to="/login"
                    className="btn-secondary text-lg px-8 py-3"
                  >
                    Đăng nhập
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Tính năng nổi bật
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Khám phá những tính năng độc đáo giúp việc chăm sóc cây trồng trở nên dễ dàng hơn
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="card text-center hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-6 h-6 text-primary-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Tại sao chọn PlantAI?
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                PlantAI cung cấp giải pháp toàn diện cho việc chăm sóc cây trồng, 
                từ nhận diện đến điều trị bệnh.
              </p>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-primary-600 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                      <BarChart3 className="w-6 h-6 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Phân tích chi tiết</h3>
                      <p className="text-sm text-gray-600">Kết quả chính xác đến 95%</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <MessageCircle className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">AI Chat hỗ trợ</h3>
                      <p className="text-sm text-gray-600">Tư vấn 24/7</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                      <Users className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Cộng đồng</h3>
                      <p className="text-sm text-gray-600">Chia sẻ kinh nghiệm</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Người dùng nói gì
            </h2>
            <p className="text-xl text-gray-600">
              Những đánh giá từ người dùng thực tế
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="card">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">"{testimonial.content}"</p>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Sẵn sàng bắt đầu?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Tham gia cùng hàng nghìn người dùng đang sử dụng PlantAI để chăm sóc cây trồng hiệu quả
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <Link
                to="/analysis"
                className="bg-white text-primary-600 hover:bg-gray-100 font-medium py-3 px-8 rounded-lg transition-colors text-lg"
              >
                Phân tích ngay
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="bg-white text-primary-600 hover:bg-gray-100 font-medium py-3 px-8 rounded-lg transition-colors text-lg"
                >
                  Đăng ký miễn phí
                </Link>
                <Link
                  to="/login"
                  className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-medium py-3 px-8 rounded-lg transition-colors text-lg"
                >
                  Đăng nhập
                </Link>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
