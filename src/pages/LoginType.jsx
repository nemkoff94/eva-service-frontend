// ~/eva-service-frontend/src/pages/LoginType.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { User, Truck, Smartphone } from 'lucide-react';

const LoginType = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="bg-blue-600 p-3 rounded-full">
            <User className="w-8 h-8 text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Выберите тип входа
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Войдите в систему как клиент, водитель или администратор
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="grid grid-cols-1 gap-4">
            {/* Клиент */}
            <Link
              to="/login"
              className="flex items-center p-4 border border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <Smartphone className="w-8 h-8 text-blue-600 mr-4" />
              <div>
                <h3 className="font-semibold text-gray-900">Клиент</h3>
                <p className="text-sm text-gray-600">Вход по номеру телефона</p>
              </div>
            </Link>

            {/* Водитель */}
            <Link
              to="/admin/login"
              className="flex items-center p-4 border border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors"
            >
              <Truck className="w-8 h-8 text-green-600 mr-4" />
              <div>
                <h3 className="font-semibold text-gray-900">Водитель</h3>
                <p className="text-sm text-gray-600">Вход по номеру и паролю</p>
              </div>
            </Link>

            {/* Администратор */}
            <Link
              to="/admin/login"
              className="flex items-center p-4 border border-gray-300 rounded-lg hover:border-red-500 hover:bg-red-50 transition-colors"
            >
              <User className="w-8 h-8 text-red-600 mr-4" />
              <div>
                <h3 className="font-semibold text-gray-900">Администратор</h3>
                <p className="text-sm text-gray-600">Вход по номеру и паролю</p>
              </div>
            </Link>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Нужна помощь? Звоните{' '}
              <a href="tel:+79208730909" className="text-blue-600 hover:text-blue-700">
                +7 (920) 873-09-09
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginType;