import api from './client.js';

export const registerRequest = async (payload) => {
  const { data } = await api.post('/auth/register', payload);
  return data.data;
};

export const loginRequest = async (payload) => {
  const { data } = await api.post('/auth/login', payload);
  return data.data;
};

export const getMeRequest = async () => {
  const { data } = await api.get('/auth/me');
  return data.data.user;
};
