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
      <div className="px-4">
        <Tabs tabs={tabs} />
      </div>
    </>
  );
};

export default UserDashboard;