// routes/applicationRoutes.js
import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import {
    applyToJob,
    withdrawApplication,
    getMyApplications,
    saveJob,
    unsaveJob,
    getSavedJobs,
    updateProfile,
} from "../controllers/applicationController.js";

const router = express.Router();

// Job applications
router.post("/apply/:jobId", protect, applyToJob);
router.delete("/withdraw/:jobId", protect, withdrawApplication);
router.get("/my", protect, getMyApplications);

// Saved jobs
router.post("/save/:jobId", protect, saveJob);
router.delete("/unsave/:jobId", protect, unsaveJob);
router.get("/saved", protect, getSavedJobs);

// Profile update
router.put("/profile", protect, updateProfile);

export default router;
