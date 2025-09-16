import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { HeadProvider } from 'react-head';

const COUNTER_ID = 104173658; // твой ID счётчика

// Инициализация Метрики для SPA
function initYandexMetrika() {
  if (!window.ym) {
    window.ym = function () {
      (window.ym.a = window.ym.a || []).push(arguments);
    };
    window.ym.l = 1 * new Date();

    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://mc.yandex.ru/metrika/tag.js';
    document.head.appendChild(script);

    window.ym(COUNTER_ID, 'init', {
      clickmap: true,
      trackLinks: true,
      accurateTrackBounce: true,
      webvisor: false,
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

export { COUNTER_ID };
