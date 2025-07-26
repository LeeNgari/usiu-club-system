import React from 'react';
import { useNavigate } from 'react-router-dom';
import Tabs from '../../components/Tabs';
import AllEvents from '../user/AllEvents';
import ManageEvents from './ManageEvents';
import { logout } from '../../services/auth';
import { Button } from "@/components/ui/button";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const tabs = [
    { name: 'All Events', content: <AllEvents /> },
    { name: 'Manage Events', content: <ManageEvents /> },
  ];

  return (
    <>
      {/* Admin Dashboard Header - positioned to stick directly under main header */}
      <div className="bg-usiu-yellow text-usiu-blue border-b border-gray-200 shadow-sm -mt-8 -mx-4 mb-8 w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
        <div className="container mx-auto px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
            <Button
              onClick={handleLogout}
              variant="destructive"
              size="sm"
              className="text-white bg-red-600 hover:bg-red-700"
            >
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="px-4">
        <Tabs tabs={tabs} />
      </div>
    </>
  );
};

export default AdminDashboard;