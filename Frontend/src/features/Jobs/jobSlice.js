import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import jobService from "./jobService";

// 🔹 Get token helper
const getToken = () => localStorage.getItem("token");

// ✅ Update Company Profile
export const updateCompanyProfile = createAsyncThunk(
  "jobs/updateCompanyProfile",
  async (data, thunkAPI) => {
    try {
      const token = getToken();
      return await jobService.updateCompanyProfile(data, token);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// ✅ Create Job
export const createJob = createAsyncThunk(
  "jobs/createJob",
  async (jobData, thunkAPI) => {
    try {
      const token = getToken();
      return await jobService.createJob(jobData, token);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// ✅ Browse Jobs
export const browseJobs = createAsyncThunk(
  "jobs/browseJobs",
  async (filters = {}, thunkAPI) => {
    try {
      return await jobService.browseJobs(filters);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// ✅ Get Job by ID
export const getJobById = createAsyncThunk(
  "jobs/getJobById",
  async (id, thunkAPI) => {
    try {
      return await jobService.getJobById(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// ✅ View Applications
export const viewApplications = createAsyncThunk(
  "jobs/viewApplications",
  async (jobId = null, thunkAPI) => {
    try {
      const token = getToken();
      return await jobService.viewApplications(
        jobId ? `/${jobId}` : "/",
        token
      );
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// ✅ Search Job Seekers
export const searchJobSeekers = createAsyncThunk(
  "jobs/searchJobSeekers",
  async (filters, thunkAPI) => {
    try {
      const token = getToken();
      return await jobService.searchJobSeekers(filters, token);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// ✅ Update Job
export const updateJob = createAsyncThunk(
  "jobs/updateJob",
  async ({ id, jobData }, thunkAPI) => {
    try {
      const token = getToken();
      return await jobService.updateJob(id, jobData, token);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// ✅ Delete Job
export const deleteJob = createAsyncThunk(
  "jobs/deleteJob",
  async (id, thunkAPI) => {
    try {
      const token = getToken();
      return await jobService.deleteJob(id, token);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// ✅ Get My Jobs
export const getMyJobs = createAsyncThunk(
  "jobs/getMyJobs",
  async (_, thunkAPI) => {
    try {
      const token = getToken();
      return await jobService.getMyJobs(token);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// ==================================================
// Slice
// ==================================================
const jobSlice = createSlice({
  name: "jobs",
  initialState: {
    employer: null,
    jobs: [],
    applications: [],
    job: null,
    jobSeekers: [],
    isLoading: false,
    isSuccess: false,
    isError: false,
    message: "",
    myJobs: [],
  },
  reducers: {
    resetJobState: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      // Update Company Profile
      .addCase(updateCompanyProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateCompanyProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.employer = action.payload;
      })
      .addCase(updateCompanyProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // Create Job
      .addCase(createJob.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createJob.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.jobs.push(action.payload);
      })
      .addCase(createJob.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // Browse Jobs
      .addCase(browseJobs.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(browseJobs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.jobs = action.payload.jobs;
      })
      .addCase(browseJobs.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // View Applications
      .addCase(viewApplications.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(viewApplications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.applications = action.payload;
      })
      .addCase(viewApplications.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // Get My Jobs
      .addCase(getMyJobs.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getMyJobs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.myJobs = action.payload;
      })
      .addCase(getMyJobs.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { resetJobState } = jobSlice.actions;
export default jobSlice.reducer;
