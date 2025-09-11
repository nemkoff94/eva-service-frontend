// ~/eva-service-frontend/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import AdminLogin from './pages/AdminLogin';
import ClientDashboard from './pages/ClientDashboard';
import AdminDashboard from './pages/AdminDashboard';
import DriverDashboard from './pages/DriverDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import Footer from './components/Footer';
import ClientLogin from './pages/ClientLogin';
import LoginType from './pages/LoginType';

function App() {
  return (
    <AuthProvider>
      <Router>
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
              
              {/* Fallback route */}
              <Route path="*" element={<HomePage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;