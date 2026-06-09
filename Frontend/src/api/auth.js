// client/src/api/auth.js
import axiosInstance from './axiosInstance';

export const registerUser = (data) =>
  axiosInstance.post('/auth/register', data);

export const loginUser = (data) =>
  axiosInstance.post('/auth/login', data);

export const getMe = () =>
  axiosInstance.get('/auth/me');

// sends Google user info to your backend
export const googleAuthAPI = (data) =>
  axiosInstance.post('/auth/google', data);

export const forgotPasswordAPI = (data) =>
  axiosInstance.post('/auth/forgot-password', data);

export const resetPasswordAPI = (data) =>
  axiosInstance.post('/auth/reset-password', data);