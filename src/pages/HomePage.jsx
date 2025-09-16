// ~/eva-service-frontend/src/pages/HomePage.jsx
import React, { useState, useRef } from 'react';
import { Phone, Clock, MapPin, Headphones, Star } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import OrderForm from '../components/OrderForm';
import PhotoCarousel from '../components/PhotoCarousel';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ServiceAreaMap from '../components/ServiceAreaMap';
import { Title, Meta } from 'react-head';

const HomePage = () => {
  const [showOrderForm, setShowOrderForm] = useState(false);
  const { loginClient } = useAuth();
  const navigate = useNavigate();
  const orderFormRef = useRef(null);

  const handleShowOrderForm = () => {
    setShowOrderForm(true);
    setTimeout(() => {
      orderFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleOrderSubmit = async (formData) => {
    try {
      const loginResult = await loginClient(formData.phone);
      
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
      alert(error.response?.data?.message || 'Произошла ошибка при создании заказа');
    }
  };

  return (
    <>
      {/* SEO через react-head */}
      <Title>Эвакуатор в Обнинске — Eva Service 24/7</Title>
      <Meta name="description" content="Круглосуточный эвакуатор в Обнинске, Балабаново и Малоярославце. Быстрая подача от 9 минут, современные эвакуаторы и круглосуточная поддержка." />
      <Meta name="keywords" content="эвакуатор Обнинск, вызвать эвакуатор, эвакуатор Балабаново, эвакуатор Малоярославец, эвакуатор круглосуточно" />
      <Meta property="og:title" content="Эвакуатор в Обнинске — Eva Service 24/7" />
      <Meta property="og:description" content="Быстрая подача эвакуатора от 9 минут. Работаем круглосуточно." />
      <Meta property="og:type" content="website" />
      <Meta property="og:url" content="https://evakuators24-7.ru" />

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
          
          <div className="flex flex-col sm:flex-row sm:justify-center sm:items-center gap-4 mb-8">
            <button 
              onClick={handleShowOrderForm}
              className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg"
            >
              Вызвать эвакуатор
            </button>
            
            <div className="flex flex-row justify-center items-center gap-3">
              <a
                href="tel:+79208730909"
                className="bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition-colors shadow-lg flex items-center gap-2"
                title="Позвонить"
              >
                <Phone size={24} />
                <span>+7 (920) 873-09-09</span>
              </a>
              <a
                href="https://wa.me/79208730909"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition-colors shadow-lg flex items-center gap-2"
                title="WhatsApp"
              >
                <FaWhatsapp size={24} />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Яндекс бейдж */}
          <div className="flex justify-center mb-8">
            <div className="scale-150 sm:scale-150 origin-top">
              <iframe 
                src="https://yandex.ru/sprav/widget/rating-badge/86375406367?type=award" 
                width="150" 
                height="50" 
                frameBorder="0"
                title="Рейтинг Яндекс"
                className="border-0"
              />
            </div>
          </div>
        </section>

        {/* Форма заказа */}
        {showOrderForm && (
          <section ref={orderFormRef} className="mb-16">
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

        {/* Остальная часть страницы (О нас, карусель, карта, отзывы) */}
        {/* ...оставляем без изменений для сохранения функционала... */}
      </div>
    </>
  );
};

export default HomePage;
