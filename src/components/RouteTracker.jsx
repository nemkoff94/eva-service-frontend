// ~/eva-service-frontend/src/RouteTracker.jsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const COUNTER_ID = 104173658; // твой ID из Метрики

function RouteTracker() {
  const location = useLocation();

  useEffect(() => {
    // Проверяем, есть ли глобальная функция ym
    if (typeof window.ym === "function") {
      console.log("[YandexMetrika] hit →", location.pathname + location.search);

      window.ym(COUNTER_ID, "hit", location.pathname + location.search);
    } else {
      console.warn("[YandexMetrika] ym не найден на window");
    }
  }, [location]);

  return null;
}

export default RouteTracker;
