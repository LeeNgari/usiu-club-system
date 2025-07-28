import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { logout } from '../services/auth';
import { Loader2 } from 'lucide-react';

const DashboardLayout = ({ children }) => {
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const user = JSON.parse(sessionStorage.getItem('user'));

  const getDashboardPath = (role) => {
    switch (role) {
      case 'superadmin':
        return '/superadmin/dashboard';
      case 'admin':
        return '/admin/dashboard';
      case 'user':
      default:
        return '/dashboard';
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      // After successful logout, redirect based on the user's *previous* role
      // (since sessionStorage is cleared in logout())
      const role = user?.role; // Get role before it's cleared
      navigate(getDashboardPath(role));
    } catch (error) {
      console.error('Logout failed:', error);
      // Optionally, show an error message to the user
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-usiu-white">
      <header className="bg-usiu-blue text-white shadow-sm py-6">
        <div className="mx-auto flex justify-between items-center p-4">
          <Link
            to={user ? getDashboardPath(user.role) : '/'} // Redirect to appropriate dashboard or home
            className="flex items-center space-x-3 hover:opacity-90 transition-opacity"
          >
            <img
              src="https://cx.usiu.ac.ke/ICSFileServer/Themes/usn_responsive/images/usiu-logo-transparent.png"
              alt="USIU Logo"
              className="h-30"
            />
          </Link>
          {user && (
            <Button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              {isLoggingOut ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Logout
            </Button>
          )}
        </div>
      </header>

      <main className="mx-auto py-8 px-4">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;