// ~/eva-service-frontend/src/pages/HomePage.jsx
import React, { useState } from 'react';
import { Phone, MessageCircle, Clock, MapPin, Headphones, Star, Users } from 'lucide-react';
import OrderForm from '../components/OrderForm';
import PhotoCarousel from '../components/PhotoCarousel';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const HomePage = () => {
  const [showOrderForm, setShowOrderForm] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleOrderSubmit = async (formData) => {
    try {
      const loginResult = await login(formData.phone);
      
      if (loginResult.success) {
        const orderResult = await axios.post('/api/orders', {
          carLocation: formData.carLocation,
          phone: formData.phone
        });
        
        if (orderResult.data) {
          navigate('/client');
        }
      } else {
        alert('Ошибка входа: ' + loginResult.error);
      }
    } catch (error) {
      console.error('Order submission error:', error);
      alert('Произошла ошибка при создании заказа. Попробуйте еще раз.');
    }
  };

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero блок */}
        <section className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Эвакуатор круглосуточно
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Частные услуги эвакуации в Обнинске. Круглосуточный заказ, быстрая подача, 
            работа с любыми расстояниями.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <button 
              onClick={() => setShowOrderForm(true)}
              className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg"
            >
              Вызвать эвакуатор
            </button>
            
            <div className="flex gap-3">
              <a
                href="tel:+79208730909"
                className="bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition-colors shadow-lg"
                title="Позвонить"
              >
                <Phone size={24} />
              </a>
              <a
                href="https://wa.me/79208730909"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition-colors shadow-lg"
                title="WhatsApp"
              >
                <MessageCircle size={24} />
              </a>
            </div>
          </div>

          {/* Яндекс бейдж */}
          <div className="flex justify-center mb-8">
            <iframe 
              src="https://yandex.ru/sprav/widget/rating-badge/86375406367?type=award" 
              width="150" 
              height="50" 
              frameBorder="0"
              title="Рейтинг Яндекс"
              className="border-0"
            />
          </div>
        </section>

        {/* Форма заказа */}
        {showOrderForm && (
          <section className="mb-16">
            <OrderForm onSubmit={handleOrderSubmit} />
          </section>
        )}

        {/* Преимущества */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="text-center p-6 bg-white rounded-lg shadow-md">
            <Clock className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">Оперативное время подачи</h3>
            <p className="text-gray-600">от 9 минут</p>
            <p className="text-sm text-gray-500 mt-1">Быстрее всех в городе</p>
          </div>
          
          <div className="text-center p-6 bg-white rounded-lg shadow-md">
            <MapPin className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">Широкая зона обслуживания</h3>
            <p className="text-gray-600">Обнинск, Балабаново, Малоярославец</p>
            <p className="text-sm text-gray-500 mt-1">и все ближайшие города</p>
          </div>
          
          <div className="text-center p-6 bg-white rounded-lg shadow-md">
            <Headphones className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">Поддержка</h3>
            <p className="text-gray-600">Круглосуточно на связи</p>
            <p className="text-sm text-gray-500 mt-1">Консультация 24/7</p>
          </div>
        </section>

        {/* Блок "О нас" */}
        <section className="mb-16">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Почему выбирают нас?</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4 text-blue-600">Eva Service — надежность и скорость</h3>
                <p className="text-gray-700 mb-4">
                  Более 5 лет мы предоставляем качественные услуги эвакуации в Обнинске и области. 
                  Наш приоритет — ваша безопасность и комфорт в любой ситуации.
                </p>
                <p className="text-gray-700 mb-4">
                  Современный парк эвакуаторов, профессиональные водители и круглосуточная диспетчерская служба 
                  гарантируют оперативное решение ваших проблем на дороге.
                </p>
                <div className="flex items-center space-x-4 mt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">500+</div>
                    <div className="text-sm text-gray-600">Успешных перевозок</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">24/7</div>
                    <div className="text-sm text-gray-600">Работаем без выходных</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">5.0</div>
                    <div className="text-sm text-gray-600">Средний рейтинг</div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-center">
                <div className="bg-blue-50 p-6 rounded-lg">
                  <div className="flex items-center mb-4">
                    <Star className="w-6 h-6 text-yellow-400 fill-current" />
                    <Star className="w-6 h-6 text-yellow-400 fill-current" />
                    <Star className="w-6 h-6 text-yellow-400 fill-current" />
                    <Star className="w-6 h-6 text-yellow-400 fill-current" />
                    <Star className="w-6 h-6 text-yellow-400 fill-current" />
                    <span className="ml-2 text-lg font-semibold">5.0/5</span>
                  </div>
                  <p className="text-gray-700 italic">
                    "Быстро приехали, аккуратно погрузили. Цена соответствовала озвученной. 
                    Рекомендую всем — лучший эвакуатор в Обнинске!"
                  </p>
                  <p className="text-gray-600 mt-2">— Иван, клиент</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Карусель с фото работ */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Наша работа</h2>
          <PhotoCarousel />
        </section>

        {/* Отзывы с Яндекс Карт */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Отзывы клиентов</h2>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div 
              style={{ 
                width: '100%', 
                height: '600px', 
                overflow: 'hidden', 
                position: 'relative',
                borderRadius: '8px'
              }}
            >
              <iframe 
                style={{
                  width: '100%',
                  height: '100%',
                  border: '1px solid #e6e6e6',
                  borderRadius: '8px',
                  boxSizing: 'border-box'
                }} 
                src="https://yandex.ru/maps-reviews-widget/86375406367?comments"
                title="Отзывы Яндекс Карт"
              />
              <a 
                href="https://yandex.ru/maps/org/eva_service/86375406367/" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{
                  boxSizing: 'border-box',
                  textDecoration: 'none',
                  color: '#b3b3b3',
                  fontSize: '10px',
                  fontFamily: 'YS Text, sans-serif',
                  padding: '0 20px',
                  position: 'absolute',
                  bottom: '8px',
                  width: '100%',
                  textAlign: 'center',
                  left: 0,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: 'block',
                  maxHeight: '14px',
                  whiteSpace: 'nowrap',
                  padding: '0 16px',
                  boxSizing: 'border-box'
                }}
              >
                Eva Service на карте Обнинска — Яндекс Карты
              </a>
            </div>
          </div>
        </section>
      </div>

      {/* Футер */}
      <Footer />
    </>
  );
};

export default HomePage;