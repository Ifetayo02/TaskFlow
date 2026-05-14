// client/src/api/boards.js
import axiosInstance from './axiosInstance';

export const createBoard = (data) =>
  axiosInstance.post('/boards', data);

export const getBoard = (id) =>
  axiosInstance.get(`/boards/${id}`);

export const deleteBoard = (id) =>
  axiosInstance.delete(`/boards/${id}`);