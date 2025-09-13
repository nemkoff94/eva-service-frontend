// ~/eva-service-frontend/src/pages/ClientDashboard.jsx
import React, { useState, useEffect } from 'react';
import { CheckCircle, Clock, MapPin, Phone, MessageCircle, Edit, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import EditOrderModal from '../components/EditOrderModal';

const ClientDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingOrder, setEditingOrder] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }
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
      fetchOrders(); // Обновляем список заказов
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

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Приветствие */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
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

      {/* Активные заказы */}
      {loading ? (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        </div>
      ) : orders.length > 0 ? (
        orders.map(order => (
          <div key={order.id} className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Заказ #{order.id}</h2>
              <span className={`px-3 py-1 rounded-full text-sm ${
                order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                order.status === 'PROCESSING' ? 'bg-blue-100 text-blue-800' :
                order.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                'bg-red-100 text-red-800'
              }`}>
                {order.status === 'PENDING' && 'В обработке'}
                {order.status === 'PROCESSING' && 'В работе'}
                {order.status === 'COMPLETED' && 'Завершен'}
                {order.status === 'CANCELLED' && 'Отменен'}
              </span>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center">
                <MapPin className="w-5 h-5 text-gray-400 mr-3" />
                <span className="text-gray-600">{order.carLocation}</span>
              </div>
              
              {order.destination && (
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 text-gray-400 mr-3" />
                  <span className="text-gray-600">→ {order.destination}</span>
                </div>
              )}
              
              {order.wheelsLocked && (
                <div className="flex items-center">
                  <span className="text-sm text-red-600">• Колеса заблокированы</span>
                </div>
              )}
              
              <div className="flex items-center">
                <Clock className="w-5 h-5 text-gray-400 mr-3" />
                <span className="text-gray-600">
                  Создан: {new Date(order.createdAt).toLocaleString('ru-RU')}
                </span>
              </div>
            </div>

            {order.status === 'PENDING' && (
              <div className="pt-4 border-t border-gray-200">
                <div className="flex space-x-3">
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
              </div>
            )}
          </div>
        ))
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Активные заказы</h2>
          <p className="text-gray-600">У вас пока нет активных заказов.</p>
          <button 
            onClick={() => navigate('/')}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
          >
            Создать первый заказ
          </button>
        </div>
      )}

      {/* Контакты поддержки */}
      <div className="bg-gray-50 rounded-lg p-6">
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