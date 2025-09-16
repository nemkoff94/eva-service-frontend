import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { HeadProvider } from 'react-head';

const COUNTER_ID = 104173658; // твой ID счётчика

function YandexMetrikaProvider({ children }) {
  useEffect(() => {
    if (!window.ym) {
      window.ym = function () {
        (window.ym.a = window.ym.a || []).push(arguments);
      };
      window.ym.l = 1 * new Date();

      const script = document.createElement('script');
      script.async = true;
      script.src = 'https://mc.yandex.ru/metrika/tag.js';
      script.onload = () => {
        // инициализация счётчика после загрузки скрипта
        window.ym(COUNTER_ID, 'init', {
          clickmap: true,
          trackLinks: true,
          accurateTrackBounce: true,
          webvisor: false,
        });

        // хит первой загрузки страницы
        window.ym(COUNTER_ID, 'hit', window.location.pathname + window.location.search);
        console.log('[YandexMetrika] Initialized and initial hit sent');
      };
      document.head.appendChild(script);
    }
  }, []);

  return children;
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HeadProvider>
      <YandexMetrikaProvider>
        <App />
      </YandexMetrikaProvider>
    </HeadProvider>
  </StrictMode>
);

export { COUNTER_ID };

