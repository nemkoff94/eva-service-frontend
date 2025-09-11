// ~/eva-service-frontend/src/pages/HomePage.jsx
import React, { useState } from 'react';
import { Phone, MessageCircle, Clock, MapPin, Headphones } from 'lucide-react';
import OrderForm from '../components/OrderForm';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Добавляем импорт axios

const HomePage = () => {
  const [showOrderForm, setShowOrderForm] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleOrderSubmit = async (formData) => {
    try {
      // Сначала логиним пользователя
      const loginResult = await login(formData.phone);
      
      if (loginResult.success) {
        // Создаем заказ
        const orderResult = await axios.post('/api/orders', {
          carLocation: formData.carLocation,
          phone: formData.phone
        });
        
        if (orderResult.data) {
          console.log('Заказ создан:', orderResult.data);
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
            className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Вызвать эвакуатор
          </button>
          
          <div className="flex gap-3">
            <a
              href="tel:+79208730909"
              className="bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition-colors"
            >
              <Phone size={24} />
            </a>
            <a
              href="https://wa.me/79208730909"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition-colors"
            >
              <MessageCircle size={24} />
            </a>
          </div>
        </div>

        {/* Яндекс бейдж */}
        <div className="flex justify-center">
          <iframe 
            src="https://yandex.ru/sprav/widget/rating-badge/86375406367?type=award" 
            width="150" 
            height="50" 
            frameBorder="0"
            title="Рейтинг Яндекс"
            className="border-0"
          ></iframe>
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
        <div className="text-center">
          <Clock className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <h3 className="font-semibold text-lg mb-2">Время подачи</h3>
          <p className="text-gray-600">от 9 мин</p>
        </div>
        
        <div className="text-center">
          <MapPin className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <h3 className="font-semibold text-lg mb-2">Локации</h3>
          <p className="text-gray-600">Обнинск, Балабаново, Малоярославец</p>
        </div>
        
        <div className="text-center">
          <Headphones className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <h3 className="font-semibold text-lg mb-2">Поддержка</h3>
          <p className="text-gray-600">Круглосуточная поддержка</p>
        </div>
      </section>

      {/* Блок "Наша работа" - заглушка для слайдера */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">Наша работа</h2>
        <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center">
          <p className="text-gray-500">Здесь будет слайдер с фотографиями</p>
        </div>
      </section>
    </div>
  );
};

export default HomePage;