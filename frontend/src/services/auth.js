import api from './api';

export const login = async (credentials) => {
  const response = await api.post('/login', credentials);
  return response.data;
};

export const logout = async () => {
  try {
    await api.post('/logout');
  } catch (error) {
    console.error('Error logging out on backend:', error);
  } finally {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
  }
};
