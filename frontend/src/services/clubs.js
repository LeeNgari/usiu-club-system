import api from './api';

export const getClubs = async () => {
  const response = await api.get('/clubs');
  return response.data;
};

export const createClub = async (club) => {
  const response = await api.post('/clubs', club);
  return response.data;
};

export const updateClub = async (id, club) => {
  const response = await api.put(`/clubs/${id}`, club);
  return response.data;
};

export const deleteClub = async (id) => {
  await api.delete(`/clubs/${id}`);
};
