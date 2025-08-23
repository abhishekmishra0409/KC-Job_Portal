import express from "express";
import {
    getStats,
    getAllUsers,
    toggleBanUser,
    getAllJobs,
    deleteJob,
} from "../controllers/adminController.js";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Admin-specific routes (protected + admin only)
router.get("/stats", getStats);
router.get("/users", getAllUsers);
router.put("/ban-user/:id", toggleBanUser);
router.get("/jobs", getAllJobs);
router.delete("/delete-job/:id" , deleteJob);

export default router;
