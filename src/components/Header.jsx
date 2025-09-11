// ~/eva-service-frontend/src/components/Header.jsx
import React from 'react';
import { Phone, MessageCircle, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  const formatPhone = (phone) => {
    return phone.replace(/(\d{1})(\d{3})(\d{3})(\d{2})(\d{2})/, '+$1 ($2) $3-$4-$5');
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Логотип и название */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold text-gray-900">Eva Service</h1>
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
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700 hidden sm:block">
                  {formatPhone(user.phone)}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-gray-100 text-gray-700 px-3 py-1 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors flex items-center"
                  title="Выйти"
                >
                  <LogOut size={16} className="mr-1" />
                  Выйти
                </button>
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