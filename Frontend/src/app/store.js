import { configureStore } from "@reduxjs/toolkit";
import userSlice from "../features/Users/userSlice";
import jobSlice from "../features/Jobs/jobSlice";
import applicationSlice from "../features/Applications/applicationSlice";
import adminSlice from "../features/Admin/adminSlice";

export const store = configureStore({
  reducer: {
    user: userSlice,
    jobs: jobSlice,
    applications: applicationSlice,
    admin: adminSlice,
  },
});

export default store;
