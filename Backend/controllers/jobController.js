// controllers/jobController.js
import Job from "../models/Job.js";
import Application from "../models/Application.js";
import User from "../models/User.js";

// ✅ Create or update company profile (Employer only)
export const updateCompanyProfile = async (req, res) => {
    try {
        if (req.user.role !== "employer") {
            return res.status(403).json({ message: "Only employers can update company profile" });
        }

        const { name, website, logoUrl, about, location } = req.body;

        const employer = await User.findByIdAndUpdate(
            req.user._id,
            { company: { name, website, logoUrl, about, location } },
            { new: true }
        ).select("-passwordHash");

        res.status(200).json({ message: "Company profile updated", employer });
    } catch (error) {
        res.status(500).json({ message: "Error updating company profile", error });
    }
};

// ✅ Create Job (Employer Only)
export const createJob = async (req, res) => {
    try {
        if (req.user.role !== "employer") {
            return res.status(403).json({ message: "Only employers can post jobs" });
        }

        const {
            company,
            title,
            description,
            location,
            type,
            salaryMin,
            salaryMax,
            requiredSkills,
            requiredExperience,
            isRemote,
        } = req.body;

        const job = new Job({
            employerId: req.user._id,
            company,
            title,
            description,
            location,
            type,
            salaryMin,
            salaryMax,
            requiredSkills,
            requiredExperience,
            isRemote,
        });

        await job.save();
        res.status(201).json({ message: "Job posted successfully", job });
    } catch (error) {
        res.status(500).json({ message: "Error posting job", error: error.message });
    }
};

// ✅ Browse Jobs with Filters + Pagination
export const browseJobs = async (req, res) => {
    try {
        const { keyword, location, type, minSalary, maxSalary, page = 1, limit = 10 } = req.query;
        const query = { status: "active" };

        if (keyword) query.$text = { $search: keyword };
        if (location) query.location = new RegExp(location, "i");
        if (type) query.type = type;

        if (minSalary || maxSalary) {
            query.$or = [
                { salaryMin: { $gte: Number(minSalary) || 0 } },
                { salaryMax: { $lte: Number(maxSalary) || Infinity } },
            ];
        }

        const jobs = await Job.find(query)
            .populate("employerId", "company.name email")
            .skip((page - 1) * limit)
            .limit(Number(limit))
            .sort({ createdAt: -1 });

        const total = await Job.countDocuments(query);

        res.json({
            success: true,
            jobs,
            pagination: {
                total,
                page: Number(page),
                limit: Number(limit),
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ✅ Get Job By ID
export const getJobById = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id).populate("employerId", "company.name email");
        if (!job) return res.status(404).json({ success: false, message: "Job not found" });

        res.json({ success: true, job });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ✅ View applications for a specific job (Employer Only)
export const viewApplications = async (req, res) => {
    try {
        if (req.user.role !== "employer") {
            return res.status(403).json({ message: "Only employers can view applications" });
        }

        const jobId = req.params.jobId;
        const applications = await Application.find({ job: jobId })
            .populate("jobSeeker", "name email skills experience resumeUrl");

        res.status(200).json(applications);
    } catch (error) {
        res.status(500).json({ message: "Error fetching applications", error });
    }
};

// ✅ Search job seekers by skills & location (Employer Only)
export const searchJobSeekers = async (req, res) => {
    try {
        if (req.user.role !== "employer") {
            return res.status(403).json({ message: "Only employers can search job seekers" });
        }

        const { skills, city, country } = req.query;
        const query = { role: "seeker" };

        if (skills) query.skills = { $in: skills.split(",") };
        if (city) query["location.city"] = new RegExp(city, "i");
        if (country) query["location.country"] = new RegExp(country, "i");

        const jobSeekers = await User.find(query).select("-passwordHash");
        res.status(200).json(jobSeekers);
    } catch (error) {
        res.status(500).json({ message: "Error searching job seekers", error });
    }
};

// ✅ Update Job (Employer Only)
export const updateJob = async (req, res) => {
    try {
        if (req.user.role !== "employer") {
            return res.status(403).json({ message: "Only employers can update jobs" });
        }

        const jobId = req.params.id;
        const job = await Job.findOneAndUpdate(
            { _id: jobId, employerId: req.user._id },
            req.body,
            { new: true }
        );

        if (!job) return res.status(404).json({ message: "Job not found or not authorized" });
        res.status(200).json({ message: "Job updated successfully", job });
    } catch (error) {
        res.status(500).json({ message: "Error updating job", error });
    }
};

// ✅ Delete Job (Employer Only)
export const deleteJob = async (req, res) => {
    try {
        if (req.user.role !== "employer") {
            return res.status(403).json({ message: "Only employers can delete jobs" });
        }

        const jobId = req.params.id;
        const job = await Job.findOneAndDelete({ _id: jobId, employerId: req.user._id });

        if (!job) return res.status(404).json({ message: "Job not found or not authorized" });
        res.status(200).json({ message: "Job deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting job", error });
    }
};

export const getMyJobs = async (req, res) => {
    try {
        if (req.user.role !== "employer") {
            return res.status(403).json({ message: "Only employers can view their jobs" });
        }

        const jobs = await Job.find({ employerId: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json(jobs);
    } catch (error) {
        res.status(500).json({ message: "Error fetching jobs", error });
    }
}
