import api from './client.js';

export const listTasksRequest = async (params = {}) => {
  const { data } = await api.get('/tasks', { params });
  return data.data;
};

export const listAllTasksRequest = async (params = {}) => {
  const { data } = await api.get('/tasks/admin/all', { params });
  return data.data;
};

export const createTaskRequest = async (payload) => {
  const { data } = await api.post('/tasks', payload);
  return data.data.task;
};

export const updateTaskRequest = async (id, payload) => {
  const { data } = await api.patch(`/tasks/${id}`, payload);
  return data.data.task;
};

export const deleteTaskRequest = async (id) => {
  await api.delete(`/tasks/${id}`);
};
