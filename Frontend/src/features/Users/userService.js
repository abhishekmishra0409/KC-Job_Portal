import axios from "axios";
import { base_url } from "../../utils/baseurl";

const API_URL = `${base_url}users`;

// Register user
const register = async (userData) => {
  const response = await axios.post(`${API_URL}/register`, userData);
  return response.data;
};

// Verify OTP
const verifyOTP = async (otpData) => {
  const response = await axios.post(`${API_URL}/verify-otp`, otpData);
  return response.data;
};

const resendOTP = async (email) => {
  const response = await axios.post(`${API_URL}/resend-otp`, { email });
  return response.data;
};

// Login user
const login = async (credentials) => {
  const response = await axios.post(`${API_URL}/login`, credentials);
  if (response.data.token) {
    localStorage.setItem("user", JSON.stringify(response.data));
    localStorage.setItem("token", JSON.stringify(response.data.token));
  }
  return response.data;
};

// Google Auth
const googleAuth = async (token) => {
  const response = await axios.post(`${API_URL}/google`, { token });
  if (response.data.token) {
    localStorage.setItem("user", JSON.stringify(response.data));
    localStorage.setItem("token", JSON.stringify(response.data.token));
  }
  return response.data;
};

// Forgot Password
const forgotPassword = async (email) => {
  const response = await axios.post(`${API_URL}/forgot-password`, { email });
  return response.data;
};

// Reset Password
const resetPassword = async (resetData) => {
  const response = await axios.post(`${API_URL}/reset-password`, resetData);
  return response.data;
};

// Get User Profile
const getProfile = async (token) => {
  const response = await axios.get(`${API_URL}/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Update User Profile
const updateProfile = async (profileData, token) => {
  const response = await axios.put(`${API_URL}/profile`, profileData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Logout
const logout = () => {
  localStorage.removeItem("user");
};

const userService = {
  register,
  verifyOTP,
  resendOTP,
  login,
  googleAuth,
  forgotPassword,
  resetPassword,
  getProfile,
  updateProfile,
  logout,
};

export default userService;
