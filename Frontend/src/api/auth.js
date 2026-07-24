
import axiosInstance from './axiosInstance';

export const registerUser = (data) =>
  axiosInstance.post('/auth/register', data);

export const loginUser = (data) =>
  axiosInstance.post('/auth/login', data);

export const getMe = () =>
  axiosInstance.get('/auth/me');


export const googleAuthAPI = (data) =>
  axiosInstance.post('/auth/google', data);

export const forgotPasswordAPI = (data) =>
  axiosInstance.post('/auth/forgot-password', data);

export const resetPasswordAPI = (data) =>
  axiosInstance.post('/auth/reset-password', data);
export const updateProfile = (data) =>
  axiosInstance.patch('/auth/update-profile', data);

export const changePassword = (data) =>
  axiosInstance.patch('/auth/change-password', data);

export const uploadAvatar = (formData) =>
  axiosInstance.post('/auth/upload-avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });