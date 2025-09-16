// ~/eva-service-frontend/src/App.jsx
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import AdminLogin from './pages/AdminLogin';
import ClientDashboard from './pages/ClientDashboard';
import AdminDashboard from './pages/AdminDashboard';
import DriverDashboard from './pages/DriverDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import ClientLogin from './pages/ClientLogin';
import LoginType from './pages/LoginType';

// 🔹 Хук для инициализации Яндекс.Метрики и отправки hits
function useYandexMetrika(id) {
  const location = useLocation();
  const [isMetrikaLoaded, setIsMetrikaLoaded] = useState(false);

  useEffect(() => {
    // Если скрипт ещё не подключён, подключаем его динамически
    if (!window.ym) {
      const script = document.createElement('script');
      script.src = 'https://mc.yandex.ru/metrika/tag.js';
      script.async = true;
      document.body.appendChild(script);

      script.onload = () => {
        window.ym(id, 'init', {
          clickmap: true,
          trackLinks: true,
          accurateTrackBounce: true,
          webvisor: false, // отключили Webvisor
        });
        setIsMetrikaLoaded(true);
        // Отправляем первый hit после инициализации
        window.ym(id, 'hit', location.pathname + location.search);
      };
    } else {
      setIsMetrikaLoaded(true);
    }
  }, [id, location.pathname, location.search]);

  // 🔹 Отправка hit при смене маршрута
  useEffect(() => {
    if (isMetrikaLoaded && window.ym) {
      window.ym(id, 'hit', location.pathname + location.search);
    }
  }, [location, id, isMetrikaLoaded]);
}

// 🔹 Обертка маршрутов
function AppRoutes() {
  // ID вашего счетчика
  useYandexMetrika(104162327);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginType />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/login-client" element={<ClientLogin />} />

          {/* Protected routes */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/driver/*"
            element={
              <ProtectedRoute requiredRole="DRIVER">
                <DriverDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/client/*"
            element={
              <ProtectedRoute requiredRole="CLIENT">
                <ClientDashboard />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
