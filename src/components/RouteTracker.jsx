// ~/eva-service-frontend/src/RouteTracker.jsx
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ym } from 'react-yandex-metrika';

const COUNTER_ID = 104173658; // замените на ваш номер счётчика

export default function RouteTracker() {
  const location = useLocation();

  useEffect(() => {
    if (ym) {
      ym(COUNTER_ID, 'hit', location.pathname + location.search);
    }
  }, [location]);

  return null;
}
