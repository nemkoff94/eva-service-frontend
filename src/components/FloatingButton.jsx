import React, { useState } from 'react';
import { FiPhone } from 'react-icons/fi';
import ContactModal from './ContactModal';

const FloatingButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleModal = () => setIsOpen(prev => !prev);

  return (
    <>
      {/* Пульсирующая кнопка */}
      <button
        onClick={toggleModal}
        className="fixed bottom-6 right-6 w-16 h-16 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center animate-pulse hover:animate-none hover:bg-blue-700 transition-colors z-50"
        title="Связаться с нами"
      >
        <FiPhone size={28} />
      </button>

      {/* Модальное окно */}
      {isOpen && <ContactModal onClose={toggleModal} />}
    </>
  );
};

export default FloatingButton;
