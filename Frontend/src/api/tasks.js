// client/src/api/tasks.js
import axiosInstance from './axiosInstance';

export const getTasks = (boardId) =>
  axiosInstance.get(`/tasks?boardId=${boardId}`);

export const createTask = (data) =>
  axiosInstance.post('/tasks', data);

export const updateTask = (id, data) =>
  axiosInstance.patch(`/tasks/${id}`, data);

export const moveTask = (id, data) =>
  axiosInstance.patch(`/tasks/${id}/move`, data);

export const deleteTask = (id) =>
  axiosInstance.delete(`/tasks/${id}`);
export const getMyTasks = () =>
  axiosInstance.get('/tasks/my-tasks');

export const getBoardAnalytics = (boardId) =>
  axiosInstance.get(`/tasks/analytics?boardId=${boardId}`);