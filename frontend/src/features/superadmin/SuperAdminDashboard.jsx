import React from 'react';
import { useNavigate } from 'react-router-dom';
import Tabs from '../../components/Tabs';
import AllEvents from '../user/AllEvents';
import ManageClubs from './ManageClubs';
import ManageUsers from './ManageUsers';
import ManageAllEvents from './ManageAllEvents';
import { Button } from "@/components/ui/button";
import { logout } from '../../services/auth';

const SuperAdminDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const tabs = [
    { name: 'All Events', content: <AllEvents /> },
    { name: 'Manage Clubs', content: <ManageClubs /> },
    { name: 'Manage Users', content: <ManageUsers /> },
    { name: 'Manage All Events', content: <ManageAllEvents /> },
  ];

  return (
    <>
      {/* Super Admin Dashboard Header - positioned to stick directly under main header */}
      <div className="bg-usiu-black text-white border-b border-gray-200 shadow-sm -mt-8 -mx-4 mb-8 w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
        <div className="container mx-auto px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold tracking-tight">Super Admin Dashboard</h1>
            <Button
              onClick={handleLogout}
              variant="destructive"
              size="sm"
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

export default SuperAdminDashboard;