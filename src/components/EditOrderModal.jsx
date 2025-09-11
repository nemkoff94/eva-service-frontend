// ~/eva-service-frontend/src/components/EditOrderModal.jsx
import React, { useState } from 'react';
import { X, MapPin, Save } from 'lucide-react';
import axios from 'axios';

const EditOrderModal = ({ order, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    destination: order.destination || '',
    wheelsLocked: order.wheelsLocked || false
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.patch(`/api/orders/${order.id}`, formData);
      onUpdate(response.data.order);
      onClose();
    } catch (error) {
      console.error('Error updating order:', error);
      alert('Ошибка при обновлении заказа');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Дополнить данные заказа</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="destination" className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin className="w-4 h-4 inline mr-1" />
              Место назначения
            </label>
            <input
              type="text"
              id="destination"
              name="destination"
              placeholder="Куда отвезти автомобиль?"
              value={formData.destination}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="wheelsLocked"
              name="wheelsLocked"
              checked={formData.wheelsLocked}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="wheelsLocked" className="ml-2 block text-sm text-gray-700">
              Заблокированы ли колеса?
            </label>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 flex items-center justify-center"
            >
              {loading ? (
                'Сохранение...'
              ) : (
                <>
                  <Save size={16} className="mr-2" />
                  Сохранить
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md font-medium hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Отмена
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditOrderModal;