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
      <div className="px-4">
        <Tabs tabs={tabs} />
      </div>
    </>
  );
};

export default SuperAdminDashboard;