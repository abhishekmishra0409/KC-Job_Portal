// src/features/admin/adminSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import adminService from "./adminService";

// Get token from localStorage
const getToken = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return user?.token || "";
};

// Get platform stats
export const fetchStats = createAsyncThunk(
  "admin/fetchStats",
  async (_, thunkAPI) => {
    try {
      return await adminService.getStats(getToken());
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Error fetching stats"
      );
    }
  }
);

// Get all users
export const fetchUsers = createAsyncThunk(
  "admin/fetchUsers",
  async (_, thunkAPI) => {
    try {
      return await adminService.getAllUsers(getToken());
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Error fetching users"
      );
    }
  }
);

//Ban/unban user
export const banUser = createAsyncThunk(
  "admin/banUser",
  async (id, thunkAPI) => {
    try {
      return await adminService.toggleBanUser(id, getToken());
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Error banning user"
      );
    }
  }
);

// Get all jobs
export const fetchJobs = createAsyncThunk(
  "admin/fetchJobs",
  async (_, thunkAPI) => {
    try {
      return await adminService.getAllJobs(getToken());
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Error fetching jobs"
      );
    }
  }
);

// Delete job
export const removeJob = createAsyncThunk(
  "admin/removeJob",
  async (id, thunkAPI) => {
    try {
      return await adminService.deleteJob(id, getToken());
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Error deleting job"
      );
    }
  }
);

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    stats: {},
    users: [],
    jobs: [],
    isLoading: false,
    isSuccess: false,
    isError: false,
    message: "",
  },
  reducers: {
    resetAdmin: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      // Stats
      .addCase(fetchStats.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.stats = action.payload.stats;
      })
      .addCase(fetchStats.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // Users
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.users = action.payload.users;
      })
      // Ban User
      .addCase(banUser.fulfilled, (state, action) => {
        state.message = action.payload.message;
      })

      // Jobs
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.jobs = action.payload.jobs;
      })

      // Delete Job
      .addCase(removeJob.fulfilled, (state, action) => {
        state.jobs = state.jobs.filter((job) => job._id !== action.meta.arg);
      });
  },
});

export const { resetAdmin } = adminSlice.actions;
export default adminSlice.reducer;
