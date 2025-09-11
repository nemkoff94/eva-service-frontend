// ~/eva-service-frontend/src/components/OrderForm.jsx
import React, { useState } from 'react';
import { MapPin, Navigation, Phone } from 'lucide-react';

const OrderForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    carLocation: '',
    phone: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Оформление заказа</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="carLocation" className="block text-sm font-medium text-gray-700 mb-2">
            <MapPin className="w-4 h-4 inline mr-1" />
            Местоположение автомобиля
          </label>
          <input
            type="text"
            id="carLocation"
            name="carLocation"
            placeholder="Введите адрес или выберите на карте"
            required
            value={formData.carLocation}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="button"
            className="mt-2 text-sm text-blue-600 hover:text-blue-700 flex items-center"
          >
            <Navigation className="w-4 h-4 mr-1" />
            Определить местоположение
          </button>
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
            <Phone className="w-4 h-4 inline mr-1" />
            Номер телефона
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            placeholder="+7 (900) 123-45-67"
            required
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Продолжить оформление
        </button>
      </form>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600 text-center">
          Возникли вопросы? Звоните{' '}
          <a href="tel:+79208730909" className="text-blue-600 hover:text-blue-700">
            +7 (920) 873-09-09
          </a>{' '}
          или пишите в{' '}
          <a 
            href="https://wa.me/79208730909" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-green-600 hover:text-green-700"
          >
            WhatsApp
          </a>
        </p>
      </div>
    </div>
  );
};

export default OrderForm;