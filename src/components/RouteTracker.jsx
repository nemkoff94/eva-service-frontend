import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const COUNTER_ID = 104173658;

function RouteTracker() {
  const location = useLocation();

  useEffect(() => {
    if (typeof window.ym === "function") {
      console.log("[YandexMetrika] hit →", location.pathname + location.search);
      window.ym(COUNTER_ID, "hit", location.pathname + location.search);
    } else {
      console.warn("[YandexMetrika] ym не найден на window");
    }
  }, [location]);

  // --- ФИКС: хит при первой загрузке страницы ---
  useEffect(() => {
    if (typeof window.ym === "function") {
      console.log("[YandexMetrika] initial hit →", window.location.pathname + window.location.search);
      window.ym(COUNTER_ID, "hit", window.location.pathname + window.location.search);
    }
  }, []);

  return null;
}

export default RouteTracker;
