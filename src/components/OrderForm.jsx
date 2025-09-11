import React, { useState, useRef, useEffect } from 'react';
import { MapPin, Navigation, Phone } from 'lucide-react';

const OrderForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    carLocation: '',
    phone: ''
  });
  const [loadingLocation, setLoadingLocation] = useState(false);
  const mapRef = useRef(null);
  const placemarkRef = useRef(null);

  // Инициализация карты
  useEffect(() => {
    const interval = setInterval(() => {
      if (window.ymaps) {
        clearInterval(interval);
        window.ymaps.ready(initMap);
      }
    }, 100);

    function initMap() {
      const map = new window.ymaps.Map(mapRef.current, {
        center: [55.0963, 36.6136], // Обнинск
        zoom: 12,
        controls: ['zoomControl', 'fullscreenControl']
      });

      const placemark = new window.ymaps.Placemark(
        map.getCenter(),
        {},
        { draggable: true }
      );

      map.geoObjects.add(placemark);
      placemarkRef.current = placemark;

      // При перемещении пина обновляем carLocation
      placemark.events.add('dragend', async () => {
        const coords = placemark.geometry.getCoordinates();
        const location = await geocode(coords);
        setFormData(prev => ({ ...prev, carLocation: location }));
      });
    }

    return () => clearInterval(interval);
  }, []);

  // Обратное геокодирование координат
  const geocode = async (coords) => {
    try {
      const response = await fetch(
        `https://geocode-maps.yandex.ru/1.x/?apikey=463159bd-17b4-4bfe-a668-084bb1c51604&format=json&geocode=${lon},${lat}`
      );
      const data = await response.json();
      const address = data.response.GeoObjectCollection.featureMember[0]?.GeoObject?.metaDataProperty?.GeocoderMetaData?.text;
      return address || '';
    } catch (error) {
      console.error('Geocoding error:', error);
      return '';
    }
  };

  // Автоподстановка местоположения пользователя
  const handleDetectLocation = () => {
    if (!navigator.geolocation || !placemarkRef.current) return;
    setLoadingLocation(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const coords = placemark.geometry.getCoordinates();
        const location = await geocode([coords[1], coords[0]]);
        setFormData(prev => ({ ...prev, carLocation: location }));

        // Перемещаем пин и центр карты
        placemarkRef.current.geometry.setCoordinates(coords);
        placemarkRef.current.getMap().setCenter(coords, 14, { duration: 300 });
        setLoadingLocation(false);
      },
      (err) => {
        console.error(err);
        setLoadingLocation(false);
        alert('Не удалось определить местоположение');
      }
    );
  };

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
            onClick={handleDetectLocation}
          >
            <Navigation className="w-4 h-4 mr-1" />
            {loadingLocation ? 'Определяем...' : 'Определить местоположение'}
          </button>
        </div>

        {/* Карта */}
        <div ref={mapRef} className="w-full h-64 rounded-lg mt-4 border border-gray-300" />

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
