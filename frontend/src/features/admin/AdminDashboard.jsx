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
      {/* Dashboard Content */}
      <div className="px-4">
        <Tabs tabs={tabs} />
      </div>
    </>
  );
};

export default AdminDashboard;