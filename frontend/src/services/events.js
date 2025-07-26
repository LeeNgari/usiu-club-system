import api from './api';

export const getEvents = async () => {
  const response = await api.get('/events');
  return response.data;
};

export const getEvent = async (id) => {
  const response = await api.get(`/events/${id}`);
  return response.data;
};

export const registerForEvent = async (id) => {
  const response = await api.post(`/events/${id}/register`);
  return response.data;
};

export const cancelRegistration = async (id) => {
  const response = await api.post(`/events/${id}/cancel-registration`);
  return response.data;
};

export const createEvent = async (event) => {
  const response = await api.post('/events', event);
  return response.data;
};

export const updateEvent = async (id, event) => {
  const response = await api.put(`/events/${id}`, event);
  return response.data;
};

export const deleteEvent = async (id) => {
  await api.delete(`/events/${id}`);
};
