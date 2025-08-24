import Application from "../models/Application.js";
import Job from "../models/Job.js";
import User from "../models/User.js";
import SavedJob from '../models/SavedJob.js';

// 📌 Apply to a job
// POST /api/applications/apply/:jobId
export const applyToJob = async (req, res) => {
    try {
        const { jobId } = req.params;
        const seekerId = req.user._id;
        const { resumeUrl, coverLetter } = req.body;

        const job = await Job.findById(jobId);
        if (!job) return res.status(404).json({ message: "Job not found" });

        const alreadyApplied = await Application.findOne({ jobId, seekerId });
        if (alreadyApplied) return res.status(400).json({ message: "Already applied to this job" });

        const application = new Application({
            jobId,
            seekerId,
            resumeUrl,
            coverLetter,
            status: "received",
        });

        await application.save();

        // ✅ Add application to Job
        job.applications.push(application._id);
        await job.save();

        res.status(201).json({ message: "Applied successfully", application });
    } catch (error) {
        res.status(500).json({ message: "Error applying for job", error: error.message });
    }
};


// 📌 Withdraw Application
// DELETE /api/applications/withdraw/:jobId
export const withdrawApplication = async (req, res) => {
    try {
        const { jobId } = req.params;
        const seekerId = req.user._id;

        const application = await Application.findOneAndDelete({ jobId, seekerId });
        if (!application) {
            return res.status(400).json({ message: "You have not applied to this job" });
        }

        // ✅ Remove application reference from Job
        await Job.findByIdAndUpdate(jobId, {
            $pull: { applications: application._id }
        });

        res.json({ message: "Application withdrawn successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error withdrawing application", error: error.message });
    }
};


// 📌 Get My Applications
// GET /api/applications/my
export const getMyApplications = async (req, res) => {
    try {
        const applications = await Application.find({ seekerId: req.user._id })
            .populate("jobId")
            .sort({ createdAt: -1 });

        res.status(200).json(applications);
    } catch (error) {
        res.status(500).json({ message: "Error fetching applications", error: error.message });
    }
};

// ✅ Save a job
export const saveJob = async (req, res) => {
    try {
        const { jobId } = req.params;
        const seekerId = req.user.id;

        // check if job exists
        const job = await Job.findById(jobId);
        if (!job) return res.status(404).json({ message: 'Job not found' });

        // create or find
        const saved = await SavedJob.findOneAndUpdate(
            { seekerId, jobId },
            { seekerId, jobId },
            { upsert: true, new: true }
        );

        res.status(201).json({ message: 'Job saved successfully', saved });
    } catch (error) {
        res.status(500).json({ message: 'Error saving job', error: error.message });
    }
};

// ✅ Unsave a job
export const unsaveJob = async (req, res) => {
    try {
        const { jobId } = req.params;
        const seekerId = req.user.id;

        const deleted = await SavedJob.findOneAndDelete({ seekerId, jobId });
        if (!deleted) {
            return res.status(404).json({ message: 'Saved job not found' });
        }

        res.status(200).json({ message: 'Job unsaved successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error unsaving job', error: error.message });
    }
};

// ✅ Get all saved jobs for seeker
export const getSavedJobs = async (req, res) => {
    try {
        const seekerId = req.user.id;

        const jobs = await SavedJob.find({ seekerId })
            .populate('jobId')
            .sort({ createdAt: -1 });

        res.status(200).json(jobs);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching saved jobs', error: error.message });
    }
};

// 📌 Update Job Seeker Profile
// PUT /api/applications/profile
export const updateProfile = async (req, res) => {
    try {
        const { name, phone, skills, experience, education, resumeUrl } = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            { name, phone, skills, experience, education, resumeUrl },
            { new: true }
        ).select("-passwordHash");

        res.status(200).json({ message: "Profile updated successfully", user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: "Error updating profile", error: error.message });
    }
};
