// src/features/application/applicationSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import applicationService from "./applicationService";

// 🔹 Thunks
export const applyToJob = createAsyncThunk(
  "applications/apply",
  async ({ jobId, data }, thunkAPI) => {
    try {
      return await applicationService.applyToJob(jobId, data);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const withdrawApplication = createAsyncThunk(
  "applications/withdraw",
  async (jobId, thunkAPI) => {
    try {
      return await applicationService.withdrawApplication(jobId);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const getMyApplications = createAsyncThunk(
  "applications/getMy",
  async (_, thunkAPI) => {
    try {
      return await applicationService.getMyApplications();
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const saveJob = createAsyncThunk(
  "applications/saveJob",
  async (jobId, thunkAPI) => {
    try {
      return await applicationService.saveJob(jobId);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const unsaveJob = createAsyncThunk(
  "applications/unsaveJob",
  async (jobId, thunkAPI) => {
    try {
      return await applicationService.unsaveJob(jobId);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const getSavedJobs = createAsyncThunk(
  "applications/getSaved",
  async (_, thunkAPI) => {
    try {
      return await applicationService.getSavedJobs();
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const updateProfile = createAsyncThunk(
  "applications/updateProfile",
  async (profileData, thunkAPI) => {
    try {
      return await applicationService.updateProfile(profileData);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 🔹 Initial State
const initialState = {
  applications: [],
  savedJobs: [],
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
  profile: null,
};

// 🔹 Slice
const applicationSlice = createSlice({
  name: "applications",
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      // Apply to job
      .addCase(applyToJob.fulfilled, (state, action) => {
        state.isSuccess = true;
        state.applications.push(action.payload.application);
      })
      // Withdraw application
      .addCase(withdrawApplication.fulfilled, (state, action) => {
        state.isSuccess = true;

        // Remove withdrawn application from state
        state.applications = state.applications.filter(
          (app) =>
            app.jobId?._id !== action.meta.arg && // when passing jobId
            app._id !== action.meta.arg // fallback if backend returns applicationId
        );
      })
      // Get my applications
      .addCase(getMyApplications.fulfilled, (state, action) => {
        state.isSuccess = true;
        state.applications = action.payload;
      })
      // Save/Unsave
      .addCase(saveJob.fulfilled, (state, action) => {
        state.isSuccess = true;
        state.savedJobs.push(action.payload.saved);
      })
      .addCase(unsaveJob.fulfilled, (state, action) => {
        state.isSuccess = true;
        state.savedJobs = state.savedJobs.filter(
          (job) => job.jobId._id !== action.meta.arg
        );
      })
      .addCase(getSavedJobs.fulfilled, (state, action) => {
        state.isSuccess = true;
        state.savedJobs = action.payload;
      })
      // Update profile
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isSuccess = true;
        state.profile = action.payload.user;
      })
      // Handle pending & rejected
      .addMatcher(
        (action) => action.type.endsWith("/pending"),
        (state) => {
          state.isLoading = true;
        }
      )
      .addMatcher(
        (action) => action.type.endsWith("/rejected"),
        (state, action) => {
          state.isLoading = false;
          state.isError = true;
          state.message = action.payload;
        }
      )
      .addMatcher(
        (action) => action.type.endsWith("/fulfilled"),
        (state) => {
          state.isLoading = false;
          state.isError = false;
        }
      );
  },
});

export const { reset } = applicationSlice.actions;
export default applicationSlice.reducer;
