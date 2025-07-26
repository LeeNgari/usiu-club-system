import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button'; // Only added shadcn component

const DashboardLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-usiu-white">
      <header className="bg-usiu-blue text-white shadow-sm py-6">
        <div className="container mx-auto flex justify-between items-center p-4">
          <Link
            to="/"
            className="flex items-center space-x-3 hover:opacity-90 transition-opacity"
          >
            <img
              src="https://cx.usiu.ac.ke/ICSFileServer/Themes/usn_responsive/images/usiu-logo-transparent.png"
              alt="USIU Logo"
              className="h-30"
            />
           
          </Link>
        </div>
      </header>

      <main className="container mx-auto py-8 px-4">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;