import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { COUNTER_ID } from "../main.jsx";

function RouteTracker() {
  const location = useLocation();

  useEffect(() => {
    if (typeof window.ym === "function") {
      console.log("[YandexMetrika] SPA hit →", location.pathname + location.search);
      window.ym(COUNTER_ID, "hit", location.pathname + location.search);
    }
  }, [location]);

  return null;
}

export default RouteTracker;
