import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { HeadProvider } from 'react-head';

const COUNTER_ID = 104173658; // твой ID счётчика

// Функция для инициализации Яндекс.Метрики
function initYandexMetrika() {
  if (!window.ym) {
    // Создаём временную функцию для накопления команд до загрузки скрипта
    window.ym = function () {
      (window.ym.a = window.ym.a || []).push(arguments);
    };
    window.ym.l = 1 * new Date();

    // Добавляем скрипт tag.js
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://mc.yandex.ru/metrika/tag.js';
    document.head.appendChild(script);

    // Инициализация счётчика
    window.ym(COUNTER_ID, 'init', {
      clickmap: true,
      trackLinks: true,
      accurateTrackBounce: true,
      webvisor: false, // пока отключаем для теста
    });
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HeadProvider>
      {initYandexMetrika()}
      <App />
    </HeadProvider>
  </StrictMode>
);
