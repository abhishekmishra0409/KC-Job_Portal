// src/features/application/applicationService.js
import axios from "axios";
import { base_url } from "../../utils/baseurl";

const API_URL = `${base_url}applications`;

// ✅ Get token properly from localStorage
const getToken = () => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    return user?.token || null;
  } catch {
    return null;
  }
};

// Apply to a job
const applyToJob = async (jobId, data) => {
  const token = getToken();
  const res = await axios.post(`${API_URL}/apply/${jobId}`, data, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });
  return res.data;
};

// Withdraw application
const withdrawApplication = async (jobId) => {
  const token = getToken();
  const res = await axios.delete(`${API_URL}/withdraw/${jobId}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });
  return res.data;
};

// Get my applications
const getMyApplications = async () => {
  const token = getToken();
  const res = await axios.get(`${API_URL}/my`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });
  return res.data;
};

// Save a job
const saveJob = async (jobId) => {
  const token = getToken();
  const res = await axios.post(
    `${API_URL}/save/${jobId}`,
    {},
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    }
  );
  return res.data;
};

// Unsave a job
const unsaveJob = async (jobId) => {
  const token = getToken();
  const res = await axios.delete(`${API_URL}/unsave/${jobId}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });
  return res.data;
};

// Get saved jobs
const getSavedJobs = async () => {
  const token = getToken();
  const res = await axios.get(`${API_URL}/saved`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });
  return res.data;
};

// Update profile
const updateProfile = async (profileData) => {
  const token = getToken();
  const res = await axios.put(`${API_URL}/profile`, profileData, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });
  return res.data;
};

const applicationService = {
  applyToJob,
  withdrawApplication,
  getMyApplications,
  saveJob,
  unsaveJob,
  getSavedJobs,
  updateProfile,
};

export default applicationService;
