import axiosInstance from './axiosInstance';

export const updateWorkspace = (id, data) =>
  axiosInstance.patch(`/workspaces/${id}`, data);

export const updateMemberRole = (workspaceId, userId, role) =>
  axiosInstance.patch(`/workspaces/${workspaceId}/members/${userId}/role`, { role });