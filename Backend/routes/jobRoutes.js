import express from "express";
import {
    updateCompanyProfile,
    createJob,
    browseJobs,
    getJobById,
    viewApplications,
    searchJobSeekers,
    updateJob,
    deleteJob,
    getMyJobs,
} from "../controllers/jobController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// ✅ Employer-only routes
router.put("/company", updateCompanyProfile);
router.post("/", createJob);
router.get("/my", getMyJobs);
router.get("/:jobId/applications", protect, viewApplications);
router.get("/jobseekers/search", protect, searchJobSeekers);
router.put("/:id", protect, updateJob);
router.delete("/:id", protect, deleteJob);

// ✅ Public routes
router.get("/", browseJobs);
router.get("/:id", getJobById);

export default router;
