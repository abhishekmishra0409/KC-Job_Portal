import User from "../models/User.js";
import Job from "../models/Job.js";
import Application from "../models/Application.js";

// @desc Get platform statistics
// @route GET /api/admin/stats
// @access Private (Admin only)
export const getStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalEmployers = await User.countDocuments({ role: "employer" });
        const totalJobSeekers = await User.countDocuments({ role: "jobseeker" });
        const totalJobs = await Job.countDocuments();
        const totalApplications = await Application.countDocuments();

        res.json({
            success: true,
            stats: {
                totalUsers,
                totalEmployers,
                totalJobSeekers,
                totalJobs,
                totalApplications,
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching stats", error: error.message });
    }
};

// @desc Get all users
// @route GET /api/admin/users
// @access Private (Admin only)
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.json({ success: true, users });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching users", error: error.message });
    }
};

// @desc Ban or unban a user
// @route PUT /api/admin/ban-user/:id
// @access Private (Admin only)
export const toggleBanUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        user.status = "banned" === user.status ? "active" : "banned";
        await user.save();

        res.json({ success: true, message: `User ${user.status ? "banned" : "unbanned"} successfully` });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error banning user", error: error.message });
    }
};

// @desc Get all jobs
// @route GET /api/admin/jobs
// @access Private (Admin only)
export const getAllJobs = async (req, res) => {
    try {
        const jobs = await Job.find().populate("employerId", "name email");
        res.json({ success: true, jobs });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching jobs", error: error.message });
    }
};

// @desc Delete a job
// @route DELETE /api/admin/delete-job/:id
// @access Private (Admin only)
export const deleteJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) return res.status(404).json({ success: false, message: "Job not found" });

        await job.deleteOne();
        res.json({ success: true, message: "Job deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error deleting job", error: error.message });
    }
};
