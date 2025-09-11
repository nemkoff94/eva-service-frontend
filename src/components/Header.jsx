// ~/eva-service-frontend/src/components/Header.jsx
// ~/eva-service-frontend/src/components/Header.jsx
import React, { useState } from 'react';
import { Phone, MessageCircle, LogOut, User, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  const formatPhone = (phone) => {
    return phone.replace(/(\d{1})(\d{3})(\d{3})(\d{2})(\d{2})/, '+$1 ($2) $3-$4-$5');
  };

  const getDashboardLink = () => {
    switch (user?.role) {
      case 'ADMIN':
        return '/admin';
      case 'DRIVER':
        return '/driver';
      case 'CLIENT':
        return '/client';
      default:
        return '/';
    }
  };

  const getRoleName = () => {
    switch (user?.role) {
      case 'ADMIN':
        return 'Администратор';
      case 'DRIVER':
        return 'Водитель';
      case 'CLIENT':
        return 'Клиент';
      default:
        return '';
    }
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Логотип и название */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold text-gray-900">EvaService</h1>
            </div>
            <div className="ml-2">
              <p className="text-sm text-gray-500">24/7</p>
            </div>
          </div>

          {/* Контакты и кнопка входа/выхода */}
          <div className="flex items-center space-x-3">
            <a
              href="tel:+79208730909"
              className="p-2 text-green-600 hover:text-green-700 transition-colors"
              title="Позвонить"
            >
              <Phone size={20} />
            </a>
            <a
              href="https://wa.me/79208730909"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-green-600 hover:text-green-700 transition-colors"
              title="WhatsApp"
            >
              <MessageCircle size={20} />
            </a>
            
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="flex items-center space-x-2 bg-gray-100 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <User size={16} className="text-gray-600" />
                  <span className="text-sm text-gray-700">
                    {formatPhone(user.phone)}
                  </span>
                </button>

                {showMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <div className="p-3 border-b border-gray-200">
                      <p className="text-sm font-medium text-gray-900">
                        {formatPhone(user.phone)}
                      </p>
                      <p className="text-xs text-gray-500">{getRoleName()}</p>
                    </div>
                    
                    <div className="p-1">
                      <a
                        href={getDashboardLink()}
                        className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md w-full text-left"
                      >
                        <Settings size={16} className="mr-2" />
                        Личный кабинет
                      </a>
                      
                      <button
                        onClick={handleLogout}
                        className="flex items-center px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md w-full text-left"
                      >
                        <LogOut size={16} className="mr-2" />
                        Выйти
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <a
                href="/login"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Войти
              </a>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;