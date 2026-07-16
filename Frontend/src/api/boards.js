// client/src/api/boards.js
import axiosInstance from './axiosInstance';

export const createBoard = (data) =>
  axiosInstance.post('/boards', data);

export const getBoard = (id) =>
  axiosInstance.get(`/boards/${id}`);

export const deleteBoard = (id) =>
  axiosInstance.delete(`/boards/${id}`);
export const toggleStarBoard = (id) =>
  axiosInstance.patch(`/boards/${id}/star`);
export const getBoardMembers = (boardId) =>
  axiosInstance.get(`/boards/${boardId}/members`);
export const updateBoardBackground = (id, bgColor) =>
  axiosInstance.patch(`/boards/${id}/background`, { bgColor });


