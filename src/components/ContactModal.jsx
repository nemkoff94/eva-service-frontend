import React, { useEffect, useState } from 'react';

const ContactModal = ({ onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Запускаем анимацию появления после рендера
    setIsVisible(true);
  }, []);

  const handleClose = () => {
    // Сначала анимация скрытия, потом вызов onClose
    setIsVisible(false);
    setTimeout(onClose, 200); // время совпадает с transition
  };

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 transition-opacity duration-200 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      onClick={handleClose}
    >
      <div
        className={`bg-white rounded-xl shadow-xl w-full max-w-sm p-6 relative transform transition-all duration-200 ${isVisible ? 'scale-100 opacity-100' : 'scale-90 opacity-0'}`}
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold mb-4 text-gray-800 text-center">
          Связаться с нами
        </h2>

        <div className="flex flex-col gap-4">
          <a
            href="tel:+79208730909"
            className="w-full bg-green-600 text-white py-3 rounded-lg text-center font-semibold hover:bg-green-700 transition-colors"
          >
            Позвонить +7 (920) 873-09-09
          </a>

          <a
            href="https://wa.me/79208730909"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-green-500 text-white py-3 rounded-lg text-center font-semibold hover:bg-green-600 transition-colors"
          >
            Написать в WhatsApp
          </a>

          <button
            onClick={handleClose}
            className="mt-2 w-full py-2 text-gray-600 hover:text-gray-800 text-center"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContactModal;
