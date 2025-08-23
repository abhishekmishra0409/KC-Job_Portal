// src/features/admin/adminService.js
import axios from "axios";
import { base_url } from "../../utils/baseurl";

const API_URL = `${base_url}admin`;

// Get platform stats
const getStats = async (token) => {
  const res = await axios.get(`${API_URL}/stats`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// Get all users
const getAllUsers = async (token) => {
  const res = await axios.get(`${API_URL}/users`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// Ban or unban user
const toggleBanUser = async (id, token) => {
  const res = await axios.put(
    `${API_URL}/ban-user/${id}`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.data;
};

// Get all jobs
const getAllJobs = async (token) => {
  const res = await axios.get(`${API_URL}/jobs`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// Delete job
const deleteJob = async (id, token) => {
  const res = await axios.delete(`${API_URL}/delete-job/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

const adminService = {
  getStats,
  getAllUsers,
  toggleBanUser,
  getAllJobs,
  deleteJob,
};

export default adminService;
