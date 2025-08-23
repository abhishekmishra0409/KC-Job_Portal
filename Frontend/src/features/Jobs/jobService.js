// src/features/job/jobService.js
import axios from "axios";
import { base_url } from "../../utils/baseurl";

const API_URL = `${base_url}jobs`;

// ✅ Helper to set auth headers
const authHeader = (token) => ({
  "Content-Type": "application/json",
  Accept: "application/json",
  headers: { Authorization: `Bearer ${token}` },
});


// ✅ Update Company Profile
const updateCompanyProfile = async (data, token) => {
  const res = await axios.put(
    `${API_URL}/company`,
    data,
    authHeader(token)
  );

  return res.data;
};

// ✅ Create Job
const createJob = async (jobData, token) => {
  const res = await axios.post(API_URL, jobData, authHeader(token));
  return res.data;
};

// ✅ Browse Jobs
const browseJobs = async (filters = {}) => {
  const query = new URLSearchParams(filters).toString();
  const res = await axios.get(`${API_URL}?${query}`);
  return res.data;
};

// ✅ Get Job by ID
const getJobById = async (id) => {
  const res = await axios.get(`${API_URL}/${id}`);
  return res.data;
};

// ✅ View Applications for a Job
const viewApplications = async (jobId, token) => {
  const res = await axios.get(
    `${API_URL}${jobId}/applications`,
    authHeader(token)
  );
  return res.data;
};

// ✅ Search Job Seekers
const searchJobSeekers = async (filters, token) => {


  const query = new URLSearchParams(filters).toString();
  const res = await axios.get(
    `${API_URL}/jobseekers/search?${query}`,
    authHeader(token)
  );
  return res.data;
};

// ✅ Update Job
const updateJob = async (id, jobData, token) => {
  const res = await axios.put(`${API_URL}/${id}`, jobData, authHeader(token));
  return res.data;
};

// ✅ Delete Job
const deleteJob = async (id, token) => {
  const res = await axios.delete(`${API_URL}/${id}`, authHeader(token));
  return res.data;
};

// ✅ Get My Jobs
const getMyJobs = async (token) => {
  const res = await axios.get(`${API_URL}/my`, authHeader(token));
  return res.data;
};

const jobService = {
  updateCompanyProfile,
  createJob,
  browseJobs,
  getJobById,
  viewApplications,
  searchJobSeekers,
  updateJob,
  deleteJob,
  getMyJobs,
};

export default jobService;
