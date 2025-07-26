import React, { useState, useEffect } from 'react';
import { getUsers, createUser, updateUser, deleteUser } from '../../services/users';
import UserForm from '../../components/UserForm';
import LoadingSpinner from '../../components/LoadingSpinner';
import AlertMessage from '../../components/AlertMessage';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setMessage(null);
      try {
        const data = await getUsers();
        setUsers(data);
      } catch (err) {
        setMessage({ type: 'error', text: 'Error fetching users' });
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleCreate = () => {
    setSelectedUser(null);
    setShowForm(true);
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setShowForm(true);
  };

  const handleDelete = async (userId) => {
    setLoading(true);
    setMessage(null);
    try {
      await deleteUser(userId);
      setUsers(users.filter(user => user.id !== userId));
      setMessage({ type: 'success', text: 'User deleted successfully!' });
    } catch (err) {
      setMessage({ type: 'error', text: 'Error deleting user.' });
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (userData) => {
    setLoading(true);
    setMessage(null);
    try {
      if (selectedUser) {
        const updatedUser = await updateUser(selectedUser.id, userData);
        setUsers(users.map(user => user.id === updatedUser.id ? updatedUser : user));
        setMessage({ type: 'success', text: 'User updated successfully!' });
      } else {
        const newUser = await createUser(userData);
        setUsers([newUser, ...users]);
        setMessage({ type: 'success', text: 'User created successfully!' });
      }
      setShowForm(false);
    } catch (err) {
      setMessage({ type: 'error', text: 'Error saving user.' });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (message) {
    return <AlertMessage message={message.text} type={message.type} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold tracking-tight">Manage Users</h2>
        <Button onClick={handleCreate} className="bg-usiuBlue hover:bg-blue-700">
          Create User
        </Button>
      </div>

      {showForm && (
        <div className="mt-6">
          <UserForm
            user={selectedUser}
            onSubmit={handleFormSubmit}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {users.map((user) => (
          <Card key={user.id}>
            <CardHeader>
              <CardTitle className="text-lg">{user.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <Badge variant="outline" className="mt-2">
                Role: {user.role}
              </Badge>
            </CardContent>
            <CardFooter className="flex justify-end gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleEdit(user)}
                className="text-usiuBlue"
              >
                Edit
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDelete(user.id)}
                className="text-red-600 hover:text-red-700"
              >
                Delete
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ManageUsers;