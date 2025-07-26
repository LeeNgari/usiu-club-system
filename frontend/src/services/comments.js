import api from './api';

export const getComments = async (eventId) => {
  const response = await api.get(`/events/${eventId}/comments`);
  return response.data;
};

export const addComment = async (eventId, comment) => {
  const response = await api.post(`/events/${eventId}/comments`, comment);
  return response.data;
};

export const deleteComment = async (eventId, commentId) => {
  await api.delete(`/events/${eventId}/comments/${commentId}`);
};

export const likeComment = async (commentId) => {
  const response = await api.post(`/comments/${commentId}/like`);
  return response.data;
};
