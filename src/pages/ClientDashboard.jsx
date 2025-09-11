import React, { useState, useEffect } from 'react';
import { CheckCircle, Clock, MapPin, Phone, MessageCircle, Edit, Trash2, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import EditOrderModal from '../components/EditOrderModal';

const emergencyTips = [
  {
    title: 'Поломка на трассе',
    text: 'Оставайтесь в безопасном месте, включите аварийку и вызовите эвакуатор.'
  },
  {
    title: 'ДТП',
    text: 'Не двигайте автомобиль, пока не зафиксируете ДТП и не вызовете эвакуатор.'
  },
  {
    title: 'Блокировка колес',
    text: 'Если автомобиль с заблокированными колесами, сообщите это диспетчеру — эвакуатор приедет с оборудованием.'
  }
];

const ClientDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingOrder, setEditingOrder] = useState(null);
  const [showNotification, setShowNotification] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' }); // прокрутка вверх
    fetchOrders();
  }, [user, navigate]);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('/api/orders/my-orders');
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateOrder = (updatedOrder) => {
    setOrders(prev => prev.map(order => 
      order.id === updatedOrder.id ? updatedOrder : order
    ));
  };

  const handleCancelOrder = async (orderId) => {
    if (!confirm('Вы уверены, что хотите отменить заказ?')) return;
    try {
      await axios.patch(`/api/orders/${orderId}`, { status: 'CANCELLED' });
      fetchOrders();
    } catch (error) {
      console.error('Error cancelling order:', error);
      alert('Ошибка при отмене заказа');
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Загрузка...</p>
        </div>
      </div>
    );
  }

  const activeOrders = orders.filter(o => o.status === 'PENDING' || o.status === 'PROCESSING');
  const lastActiveOrder = activeOrders[activeOrders.length - 1]; // последний активный
  const historyOrders = orders.filter(o => o.id !== lastActiveOrder?.id);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Уведомление о принятой заявке */}
      {showNotification && lastActiveOrder && (
        <div className="relative bg-blue-50 border-l-4 border-blue-500 text-blue-700 p-4 rounded-lg">
          <p>
            Ваша заявка принята и находится в обработке. Наши специалисты свяжутся с вами в течение нескольких минут. 
            Пока вы ждете звонка, вы можете дополнить информацию о заказе кнопкой «Дополнить данные».
          </p>
          <button
            onClick={() => setShowNotification(false)}
            className="absolute top-2 right-2 text-blue-600 hover:text-blue-800"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Личный кабинет */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Личный кабинет</h1>
        <p className="text-gray-600">Добро пожаловать, {user.phone}!</p>
        {user.defaultPassword && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-blue-600 mr-2" />
              <span className="text-sm text-blue-800">
                Ваш пароль для входа: <strong>{user.defaultPassword}</strong>
              </span>
            </div>
            <p className="text-xs text-blue-600 mt-1">
              Вы можете изменить его в настройках профиля
            </p>
          </div>
        )}
      </div>

      {/* Последний активный заказ */}
      {lastActiveOrder && (
        <div className="bg-white rounded-lg shadow-md p-6 border-2 border-blue-400">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Заказ #{lastActiveOrder.id}</h2>
            <span className={`px-3 py-1 rounded-full text-sm ${
                lastActiveOrder.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                lastActiveOrder.status === 'PROCESSING' ? 'bg-blue-100 text-blue-800' :
                'bg-green-100 text-green-800'
            }`}>
              {lastActiveOrder.status === 'PENDING' && 'В обработке'}
              {lastActiveOrder.status === 'PROCESSING' && 'В работе'}
              {lastActiveOrder.status === 'COMPLETED' && 'Завершен'}
            </span>
          </div>
          <div className="space-y-3 mb-4">
            <div className="flex items-center">
              <MapPin className="w-5 h-5 text-gray-400 mr-3" />
              <span className="text-gray-600">{lastActiveOrder.carLocation}</span>
            </div>
            {lastActiveOrder.destination && (
              <div className="flex items-center">
                <MapPin className="w-5 h-5 text-gray-400 mr-3" />
                <span className="text-gray-600">→ {lastActiveOrder.destination}</span>
              </div>
            )}
            {lastActiveOrder.wheelsLocked && (
              <div className="flex items-center">
                <span className="text-sm text-red-600">• Колеса заблокированы</span>
              </div>
            )}
            <div className="flex items-center">
              <Clock className="w-5 h-5 text-gray-400 mr-3" />
              <span className="text-gray-600">
                Создан: {new Date(lastActiveOrder.createdAt).toLocaleString('ru-RU')}
              </span>
            </div>
          </div>
          {lastActiveOrder.status === 'PENDING' && (
            <div className="pt-4 border-t border-gray-200">
              <div className="flex space-x-3">
                <button 
                  onClick={() => setEditingOrder(lastActiveOrder)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 flex items-center"
                >
                  <Edit size={16} className="mr-2" />
                  Дополнить данные
                </button>
                <button 
                  onClick={() => handleCancelOrder(lastActiveOrder.id)}
                  className="border border-red-300 text-red-600 px-4 py-2 rounded-lg text-sm hover:bg-red-50 flex items-center"
                >
                  <Trash2 size={16} className="mr-2" />
                  Отменить заказ
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Рекомендации по экстренным ситуациям */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {emergencyTips.map((tip, index) => (
          <div key={index} className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-2">{tip.title}</h3>
            <p className="text-gray-700 text-sm">{tip.text}</p>
          </div>
        ))}
      </div>

      {/* История заказов */}
      {historyOrders.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">История заказов</h2>
          {historyOrders.map(order => (
            <div key={order.id} className="bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900">Заказ #{order.id}</h3>
                <span className={`px-2 py-1 rounded-full text-sm ${
                  order.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                  order.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                  order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {order.status === 'COMPLETED' && 'Завершен'}
                  {order.status === 'CANCELLED' && 'Отменен'}
                  {order.status === 'PENDING' && 'В обработке'}
                  {order.status === 'PROCESSING' && 'В работе'}
                </span>
              </div>
              <div className="text-gray-600 text-sm mb-2">
                <div>Местоположение: {order.carLocation}</div>
                {order.destination && <div>→ {order.destination}</div>}
                {order.wheelsLocked && <div>• Колеса заблокированы</div>}
                <div>Создан: {new Date(order.createdAt).toLocaleString('ru-RU')}</div>
              </div>

        {/* Кнопки управления для активного заказа */}
        {order.status === 'PENDING' && (
          <div className="flex space-x-3 mt-2">
            <button
              onClick={() => setEditingOrder(order)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 flex items-center"
            >
              <Edit size={16} className="mr-2" />
              Дополнить данные
            </button>
            <button
              onClick={() => handleCancelOrder(order.id)}
              className="border border-red-300 text-red-600 px-4 py-2 rounded-lg text-sm hover:bg-red-50 flex items-center"
            >
              <Trash2 size={16} className="mr-2" />
              Отменить заказ
            </button>
          </div>
        )}
      </div>
    ))}
  </div>
)}

      {/* Контакты поддержки */}
      <div className="bg-gray-50 rounded-lg p-6 mt-8">
        <h3 className="font-semibold text-gray-900 mb-4">Поддержка</h3>
        <div className="space-y-2">
          <a href="tel:+79208730909" className="flex items-center text-blue-600 hover:text-blue-700">
            <Phone className="w-4 h-4 mr-2" />
            +7 (920) 873-09-09
          </a>
          <a 
            href="https://wa.me/79208730909" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center text-green-600 hover:text-green-700"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Написать в WhatsApp
          </a>
        </div>
      </div>

      {/* Модальное окно редактирования */}
      {editingOrder && (
        <EditOrderModal
          order={editingOrder}
          onClose={() => setEditingOrder(null)}
          onUpdate={handleUpdateOrder}
        />
      )}
    </div>
  );
};

export default ClientDashboard;
