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
  Search,
  Save,
  X,
  Eye,
  Trash2
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
  const [editingOrder, setEditingOrder] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [viewingOrder, setViewingOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

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
      alert('Ошибка при загрузке данных');
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
      alert('Ошибка при обновлении статуса');
    }
  };

  const handleEditOrder = (order) => {
    setEditingOrder(order);
    setEditFormData({
      status: order.status,
      driverId: order.driverId || '',
      eta: order.eta ? new Date(order.eta).toISOString().slice(0, 16) : ''
    });
  };

  const handleViewOrder = (order) => {
    setViewingOrder(order);
  };

  const handleSaveOrder = async () => {
    try {
      const response = await axios.patch(`/api/admin/orders/${editingOrder.id}`, editFormData);
      
      // Обновляем список заказов
      setOrders(prev => prev.map(order => 
        order.id === editingOrder.id ? response.data.order : order
      ));
      
      setEditingOrder(null);
      setEditFormData({});
      alert('Заказ успешно обновлен!');
    } catch (error) {
      console.error('Error saving order:', error);
      alert('Ошибка при сохранении заказа');
    }
  };

  const handleCancelEdit = () => {
    setEditingOrder(null);
    setEditFormData({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDeleteOrder = async (orderId) => {
    if (!confirm('Вы уверены, что хотите удалить этот заказ?')) return;

    try {
      await axios.delete(`/api/orders/${orderId}`);
      alert('Заказ успешно удален!');
      fetchData(); // Обновляем список
    } catch (error) {
      console.error('Error deleting order:', error);
      alert('Ошибка при удалении заказа');
    }
  };

  // Фильтрация заказов
  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.client.phone.includes(searchTerm) || 
                         order.carLocation.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Все статусы</option>
                  <option value="PENDING">Ожидание</option>
                  <option value="PROCESSING">В обработке</option>
                  <option value="DRIVER_ASSIGNED">Водитель назначен</option>
                  <option value="DRIVER_ON_THE_WAY">В пути</option>
                  <option value="COMPLETED">Завершен</option>
                  <option value="CANCELLED">Отменен</option>
                </select>
                <button 
                  onClick={fetchData}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Обновить
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
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
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
                          <span className="truncate max-w-xs">{order.carLocation}</span>
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button 
                          onClick={() => handleViewOrder(order)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                          title="Просмотреть детали"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleEditOrder(order)}
                          className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50"
                          title="Редактировать"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteOrder(order.id)}
                          className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                          title="Удалить"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {filteredOrders.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Package className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p>Заказы не найдены</p>
                </div>
              )}
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
                  {user.driver && (
                    <div className="text-sm text-gray-600 mt-1">
                      Водитель: {user.driver.name}
                    </div>
                  )}
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
                  <div className="text-sm text-gray-600">
                    Создан: {new Date(driver.user.createdAt).toLocaleDateString('ru-RU')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Модальное окно редактирования */}
      {editingOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Редактирование заказа #{editingOrder.id}</h2>
              <button
                onClick={handleCancelEdit}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Статус
                </label>
                <select
                  name="status"
                  value={editFormData.status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="PENDING">Ожидание</option>
                  <option value="PROCESSING">В обработке</option>
                  <option value="DRIVER_ASSIGNED">Водитель назначен</option>
                  <option value="DRIVER_ON_THE_WAY">В пути к клиенту</option>
                  <option value="COMPLETED">Завершен</option>
                  <option value="CANCELLED">Отменен</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Водитель
                </label>
                <select
                  name="driverId"
                  value={editFormData.driverId}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Не назначен</option>
                  {drivers.map(driver => (
                    <option key={driver.id} value={driver.id}>
                      {driver.name} ({driver.user.phone})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Время прибытия (ETA)
                </label>
                <input
                  type="datetime-local"
                  name="eta"
                  value={editFormData.eta}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={handleSaveOrder}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-center"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Сохранить
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md font-medium hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Отмена
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Модальное окно просмотра */}
      {viewingOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Заказ #{viewingOrder.id}</h2>
              <button
                onClick={() => setViewingOrder(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center">
                <Phone className="w-5 h-5 text-gray-400 mr-3" />
                <span className="text-gray-900">{viewingOrder.client.phone}</span>
              </div>
              
              <div className="flex items-center">
                <MapPin className="w-5 h-5 text-gray-400 mr-3" />
                <span className="text-gray-900">{viewingOrder.carLocation}</span>
              </div>
              
              {viewingOrder.destination && (
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 text-gray-400 mr-3" />
                  <span className="text-gray-600">→ {viewingOrder.destination}</span>
                </div>
              )}
              
              {viewingOrder.driver && (
                <div className="flex items-center">
                  <Truck className="w-5 h-5 text-gray-400 mr-3" />
                  <span className="text-gray-900">
                    Водитель: {viewingOrder.driver.name} ({viewingOrder.driver.user.phone})
                  </span>
                </div>
              )}
              
              <div className="flex items-center">
                <Clock className="w-5 h-5 text-gray-400 mr-3" />
                <span className="text-gray-600">
                  Создан: {new Date(viewingOrder.createdAt).toLocaleString('ru-RU')}
                </span>
              </div>
              
              {viewingOrder.eta && (
                <div className="flex items-center">
                  <Clock className="w-5 h-5 text-gray-400 mr-3" />
                  <span className="text-gray-600">
                    ETA: {new Date(viewingOrder.eta).toLocaleString('ru-RU')}
                  </span>
                </div>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200">
              <button
                onClick={() => {
                  setViewingOrder(null);
                  handleEditOrder(viewingOrder);
                }}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md font-medium hover:bg-blue-700"
              >
                Редактировать заказ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;