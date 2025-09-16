import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { HeadProvider } from 'react-head';
import { YMInitializer } from 'react-yandex-metrika';

const COUNTER_ID = 104173658; // Замените на номер вашего счётчика

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HeadProvider>
      {/* Инициализация Яндекс Метрики */}
      <YMInitializer
        accounts={[COUNTER_ID]}
        options={{ clickmap: true, trackLinks: true, accurateTrackBounce: true, accurateTrackBounce: true, defer: true, }}
      />
      <App />
    </HeadProvider>
  </StrictMode>
);
