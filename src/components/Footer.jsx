// ~/eva-service-frontend/src/components/Footer.jsx
import React from 'react';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Контакты */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Контакты</h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <Phone className="w-5 h-5 mr-3 text-blue-400" />
                <a href="tel:+79208730909" className="hover:text-blue-400 transition-colors">
                  +7 (920) 873-09-09
                </a>
              </div>
              <div className="flex items-center">
                <Mail className="w-5 h-5 mr-3 text-blue-400" />
                <a href="mailto:info@evakuators24-7.ru" className="hover:text-blue-400 transition-colors">
                  info@evakuators24-7.ru
                </a>
              </div>
              <div className="flex items-center">
                <MapPin className="w-5 h-5 mr-3 text-blue-400" />
                <span>г. Обнинск, гк Полет</span>
              </div>
            </div>
          </div>

          {/* Часы работы */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Режим работы</h3>
            <div className="flex items-center">
              <Clock className="w-5 h-5 mr-3 text-blue-400" />
              <div>
                <p className="font-medium">Круглосуточно</p>
                <p className="text-gray-400">24/7 без выходных</p>
              </div>
            </div>
          </div>

          {/* Соцсети */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Мы в соцсетях</h3>
            <div className="flex space-x-4">
              <a
                href="https://wa.me/79208730909"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-600 p-2 rounded-lg hover:bg-green-700 transition-colors"
                title="WhatsApp"
              >
                <span className="text-sm">WhatsApp</span>
              </a>
              <a
                href="https://vk.com/evaservice"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 p-2 rounded-lg hover:bg-blue-700 transition-colors"
                title="ВКонтакте"
              >
                <span className="text-sm">VK</span>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © 2024 Eva Service. Эвакуация 24/7 в Обнинске и по всей области. Все права защищены.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;