import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import UserDashboard from './features/user/UserDashboard';
import AdminDashboard from './features/admin/AdminDashboard';
import SuperAdminDashboard from './features/superadmin/SuperAdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import EventDetails from './pages/EventDetails';
import DashboardLayout from './layouts/DashboardLayout';

function App() {
  const isAuthenticated = () => {
    return sessionStorage.getItem('token') !== null;
  };

  const getUserRole = () => {
    const user = JSON.parse(sessionStorage.getItem('user'));
    return user ? user.role : null;
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={isAuthenticated() ? <Navigate to={`/${getUserRole()}/dashboard`} /> : <Navigate to="/login" />}
        />
        <Route
          path="/login"
          element={isAuthenticated() ? <Navigate to={`/${getUserRole()}/dashboard`} /> : <Login />}
        />
        <Route
          path="/events/:id"
          element={
            <ProtectedRoute allowedRoles={['user', 'admin', 'superadmin']}>
              <DashboardLayout>
                <EventDetails />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={['user']}>
              <DashboardLayout>
                <UserDashboard />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <DashboardLayout>
                <AdminDashboard />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/superadmin/dashboard"
          element={
            <ProtectedRoute allowedRoles={['superadmin']}>
              <DashboardLayout>
                <SuperAdminDashboard />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;