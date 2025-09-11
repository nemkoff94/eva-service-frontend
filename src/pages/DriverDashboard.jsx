// ~/eva-service-frontend/src/pages/DriverDashboard.jsx
import React, { useState, useEffect } from 'react';
import { 
  Truck, 
  MapPin, 
  Clock, 
  Phone, 
  Navigation, 
  RefreshCw,
  Plus,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import axios from 'axios';

const DriverDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    fetchOrders();
    // Polling каждые 30 секунд для обновлений
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('/api/driver/orders');
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching driver orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      setUpdating(orderId);
      await axios.patch(`/api/driver/orders/${orderId}/status`, { status });
      fetchOrders(); // Обновляем список
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Ошибка при обновлении статуса');
    } finally {
      setUpdating(null);
    }
  };

  const addTimeToETA = async (orderId, minutes) => {
    try {
      setUpdating(orderId);
      await axios.patch(`/api/driver/orders/${orderId}/add-time`, { minutes });
      fetchOrders(); // Обновляем список
      alert(`Добавлено ${minutes} минут к времени прибытия`);
    } catch (error) {
      console.error('Error adding time to ETA:', error);
      alert('Ошибка при обновлении времени');
    } finally {
      setUpdating(null);
    }
  };

  const openYandexMaps = (location) => {
    const encodedLocation = encodeURIComponent(location);
    window.open(`https://yandex.ru/maps/?text=${encodedLocation}`, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Загрузка заказов...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Заголовок */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Панель водителя</h1>
            <p className="text-gray-600">Ваши текущие заказы</p>
          </div>
          <button
            onClick={fetchOrders}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Обновить
          </button>
        </div>
      </div>

      {/* Список заказов */}
      <div className="space-y-6">
        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <Truck className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Нет активных заказов</h2>
            <p className="text-gray-600">Ожидайте назначения новых заказов</p>
          </div>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Заказ #{order.id}</h2>
                  <div className="flex items-center mt-1">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      order.status === 'DRIVER_ASSIGNED' 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {order.status === 'DRIVER_ASSIGNED' ? 'Назначен' : 'В пути к клиенту'}
                    </span>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-sm text-gray-600">
                    {new Date(order.createdAt).toLocaleString('ru-RU')}
                  </div>
                  {order.eta && (
                    <div className="text-sm font-medium text-green-600">
                      Прибытие: {new Date(order.eta).toLocaleTimeString('ru-RU')}
                    </div>
                  )}
                </div>
              </div>

              {/* Информация о заказе */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center">
                  <Phone className="w-5 h-5 text-gray-400 mr-3" />
                  <span className="text-gray-900">{order.client.phone}</span>
                </div>
                
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 text-gray-400 mr-3" />
                  <span className="text-gray-900">{order.carLocation}</span>
                </div>
                
                {order.destination && (
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 text-gray-400 mr-3" />
                    <span className="text-gray-600">→ {order.destination}</span>
                  </div>
                )}
              </div>

              {/* Действия */}
              <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => openYandexMaps(order.carLocation)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 flex items-center"
                >
                  <Navigation className="w-4 h-4 mr-2" />
                  Проложить маршрут
                </button>
                
                {order.status === 'DRIVER_ASSIGNED' && (
                  <button
                    onClick={() => updateOrderStatus(order.id, 'DRIVER_ON_THE_WAY')}
                    disabled={updating === order.id}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 flex items-center disabled:opacity-50"
                  >
                    {updating === order.id ? (
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <CheckCircle className="w-4 h-4 mr-2" />
                    )}
                    Выехал к клиенту
                  </button>
                )}
                
                {order.status === 'DRIVER_ON_THE_WAY' && order.eta && (
                  <button
                    onClick={() => addTimeToETA(order.id, 10)}
                    disabled={updating === order.id}
                    className="bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-yellow-700 flex items-center disabled:opacity-50"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    +10 мин к времени
                  </button>
                )}
                
                <button
                  onClick={() => window.open(`tel:${order.client.phone}`)}
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-700 flex items-center"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Позвонить
                </button>
              </div>

              {/* Предупреждение о заблокированных колесах */}
              {order.wheelsLocked && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center">
                    <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                    <span className="text-red-800 font-medium">Колеса заблокированы!</span>
                  </div>
                  <p className="text-red-600 text-sm mt-1">
                    Требуется специальное оборудование для эвакуации
                  </p>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Инструкция */}
      {orders.length > 0 && (
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">Инструкция:</h3>
          <ul className="text-blue-800 text-sm space-y-1">
            <li>• Нажмите "Проложить маршрут" для навигации в Яндекс Картах</li>
            <li>• "Выехал к клиенту" - меняет статус заказа</li>
            <li>• "+10 мин" - добавляет время к ETA при задержке</li>
            <li>• "Позвонить" - прямой звонок клиенту</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default DriverDashboard;