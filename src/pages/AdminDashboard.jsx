// ~/eva-service-frontend/src/pages/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Truck, 
  Package, 
  RefreshCw, 
  Edit, 
  MapPin, 
  Clock, 
  Phone,
  Filter,
  Search
} from 'lucide-react';
import axios from 'axios';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    activeDrivers: 0
  });

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      if (activeTab === 'orders') {
        const response = await axios.get('/api/admin/orders');
        setOrders(response.data);
      } else if (activeTab === 'users') {
        const response = await axios.get('/api/admin/users');
        setUsers(response.data);
      } else if (activeTab === 'drivers') {
        const response = await axios.get('/api/admin/drivers');
        setDrivers(response.data);
      }

      // Загружаем статистику
      const statsResponse = await axios.get('/api/admin/stats');
      setStats(statsResponse.data);

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      await axios.patch(`/api/admin/orders/${orderId}`, { status });
      fetchData(); // Обновляем данные
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Загрузка...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Заголовок и статистика */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Панель администратора</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <Package className="w-8 h-8 text-blue-600 mr-4" />
              <div>
                <p className="text-2xl font-bold">{stats.totalOrders}</p>
                <p className="text-gray-600">Всего заказов</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <Clock className="w-8 h-8 text-yellow-600 mr-4" />
              <div>
                <p className="text-2xl font-bold">{stats.pendingOrders}</p>
                <p className="text-gray-600">Ожидают обработки</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <Truck className="w-8 h-8 text-green-600 mr-4" />
              <div>
                <p className="text-2xl font-bold">{stats.activeDrivers}</p>
                <p className="text-gray-600">Активных водителей</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Навигация */}
      <div className="bg-white rounded-lg shadow-md mb-6">
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-6 py-3 font-medium text-sm ${
              activeTab === 'orders'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Package className="w-4 h-4 inline mr-2" />
            Заказы
          </button>
          
          <button
            onClick={() => setActiveTab('users')}
            className={`px-6 py-3 font-medium text-sm ${
              activeTab === 'users'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Users className="w-4 h-4 inline mr-2" />
            Пользователи
          </button>
          
          <button
            onClick={() => setActiveTab('drivers')}
            className={`px-6 py-3 font-medium text-sm ${
              activeTab === 'drivers'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Truck className="w-4 h-4 inline mr-2" />
            Водители
          </button>
        </div>
      </div>

      {/* Контент */}
      <div className="bg-white rounded-lg shadow-md p-6">
        {activeTab === 'orders' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Управление заказами</h2>
              <div className="flex space-x-2">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Поиск заказов..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button className="px-4 py-2 border border-gray-300 rounded-md flex items-center">
                  <Filter className="w-4 h-4 mr-2" />
                  Фильтр
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Клиент
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Местоположение
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Статус
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Дата
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Действия
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{order.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center">
                          <Phone className="w-4 h-4 mr-2 text-gray-400" />
                          {order.client.phone}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                          {order.carLocation}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                          className="text-sm px-2 py-1 rounded border focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="PENDING">Ожидание</option>
                          <option value="PROCESSING">В обработке</option>
                          <option value="DRIVER_ASSIGNED">Водитель назначен</option>
                          <option value="DRIVER_ON_THE_WAY">В пути</option>
                          <option value="COMPLETED">Завершен</option>
                          <option value="CANCELLED">Отменен</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(order.createdAt).toLocaleString('ru-RU')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900">
                          <Edit className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div>
            <h2 className="text-xl font-semibold mb-6">Пользователи</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {users.map((user) => (
                <div key={user.id} className="border rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <Phone className="w-4 h-4 mr-2 text-gray-400" />
                    <span className="font-medium">{user.phone}</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    Роль: {user.role === 'ADMIN' ? 'Администратор' : user.role === 'DRIVER' ? 'Водитель' : 'Клиент'}
                  </div>
                  <div className="text-sm text-gray-600">
                    Зарегистрирован: {new Date(user.createdAt).toLocaleDateString('ru-RU')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'drivers' && (
          <div>
            <h2 className="text-xl font-semibold mb-6">Водители</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {drivers.map((driver) => (
                <div key={driver.id} className="border rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <Truck className="w-4 h-4 mr-2 text-gray-400" />
                    <span className="font-medium">{driver.name}</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    Телефон: {driver.user.phone}
                  </div>
                  <div className="text-sm text-gray-600">
                    ID: {driver.id}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;