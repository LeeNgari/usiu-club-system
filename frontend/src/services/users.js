import api from './api';

export const getUserRegistrations = async (userId) => {
  // There is no direct endpoint for this in the provided documentation.
  // This is a placeholder implementation.
  // A real implementation would require a backend endpoint like /api/users/{id}/registrations
  return [];
};

export const getUsers = async () => {
  const response = await api.get('/users');
  return response.data;
};

export const createUser = async (user) => {
  const response = await api.post('/users', user);
  return response.data;
};

export const updateUser = async (id, user) => {
  const response = await api.put(`/users/${id}`, user);
  return response.data;
};

export const deleteUser = async (id) => {
  await api.delete(`/users/${id}`);
};
