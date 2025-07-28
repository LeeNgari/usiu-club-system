import React from 'react';
import { useNavigate } from 'react-router-dom';
import Tabs from '../../components/Tabs';
import AllEvents from './AllEvents';
import RegisteredEvents from './RegisteredEvents';
import { logout } from '../../services/auth';
import { Button } from "@/components/ui/button";

const UserDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const tabs = [
    { name: 'All Events', content: <AllEvents /> },
    { name: 'Registered Events', content: <RegisteredEvents /> },
  ];

  return (
    <>
      {/* User Dashboard Header - positioned to stick directly under main header */}
      <div className="bg-usiu-black text-white border-b border-gray-200 shadow-sm -mt-8 -mx-4 mb-8 w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
        <div className=" mx-auto px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold tracking-tight">User Dashboard</h1>
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

export default UserDashboard;