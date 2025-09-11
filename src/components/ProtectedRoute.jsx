// ~/eva-service-frontend/src/components/ProtectedRoute.jsx
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Загрузка...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Если указана requiredRole, проверяем соответствие
  if (requiredRole && user.role !== requiredRole) {
    // Редиректим на соответствующую панель в зависимости от роли
    switch (user.role) {
      case 'ADMIN':
        return <Navigate to="/admin" replace />;
      case 'DRIVER':
        return <Navigate to="/driver" replace />;
      case 'CLIENT':
        return <Navigate to="/client" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;