const UserModel = require("../../Model/AccountModel/UserModel");
const ActiveJobsModel = require("../../Model/RecruiterModel/ActiveJobsModel");

// Req- Get -> /dashboard/stats
const admin_dashboardStats = async (req, res) => {
    try {
        // Get job seekers
        const jobSeeker = await UserModel.find({ role: "job_seeker" });
        // Get recruiters
        const recruiter = await UserModel.find({ role: "recruiter" });
        // Get ongoing jobs
        const activeJobs = await ActiveJobsModel.find({ status: "ongoing" });
        // Get expired jobs
        const expired = await ActiveJobsModel.find({ status: "expired" });

        // Validation: Check if models returned arrays
        if (!Array.isArray(jobSeeker) || !Array.isArray(recruiter) || !Array.isArray(activeJobs) || !Array.isArray(expired)) {
            return res.status(500).json({ message: "Error fetching dashboard stats." });
        }

        // Send stats as response
        res.status(200).json({
            success: true,
            message: "Dashboard stats fetched successfully.",
            jobSeekerCount: jobSeeker.length,
            recruiterCount: recruiter.length,
            activeJobsCount: activeJobs.length,
            expiredJobsCount: expired.length,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch dashboard stats.",
            error: error.message
        });
    }
}

// get - /dashboard/job-seekers/quick-stats
const admin_JobSeekersQuickStats = async (req, res) => {
    try {
        const jobSeeker = await UserModel.find({ role: "job_seeker" });

        if (!Array.isArray(jobSeeker)) {
            return res.status(500).json({ success: false, message: "Error fetching job seekers." });
        }

        const info = jobSeeker.map(js => ({
            Name: js?.name || "N/A",
            Email: js?.email || "N/A",
            Location: js?.location || "N/A",
            Skills: Array.isArray(js?.skills) ? js.skills.join(", ") : "N/A",
            ExperienceLevel: js?.experienceLevel || "N/A",
            Applied_Jobs: Array.isArray(js?.appliedApplicationCount) ? js.appliedApplicationCount.length : 0,
            Last_SignIn: js?.lastSignInTime ? new Date(js.lastSignInTime).toLocaleDateString() : "Never",
            registeredAt: js?.createdAt ? new Date(js.createdAt).toLocaleDateString() : "Unknown",
        }));

        res.status(200).json({
            success: true,
            message: "Job seekers quick stats fetched successfully.",
            data: info
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch job seekers quick stats.",
            error: error.message
        });
    }
}

// get - /dashboard/recruiter-seekers/quick-stats
const admin_RecruitersQuickStats = async (req, res) => {
    try {
        const recruiters = await UserModel.find({ role: "recruiter" });

        if (!Array.isArray(recruiters)) {
            return res.status(500).json({ success: false, message: "Error fetching recruiters." });
        }

        const recruiterIds = recruiters.map(r => r._id);

        const jobsCountByRecruiter = await ActiveJobsModel.aggregate([
            { $match: { recruiter: { $in: recruiterIds } } },
            { $group: { _id: "$recruiter", jobsCount: { $sum: 1 } } }
        ]);

        if (!Array.isArray(jobsCountByRecruiter)) {
            return res.status(500).json({ success: false, message: "Error fetching jobs count." });
        }

        const jobsCountMap = {};
        jobsCountByRecruiter.forEach(item => {
            jobsCountMap[item._id.toString()] = item.jobsCount;
        });

        const infoWithJobsCount = recruiters.map(r => ({
            Name: r?.name || "N/A",
            Email: r?.email || "N/A",
            Location: r?.location || "N/A",
            Company: r?.recruiterProfile?.company_name || "N/A",
            role: r?.recruiterProfile?.company_role || "N/A",
            JobsCount: jobsCountMap[r._id.toString()] || 0,
            lastSignIn: r?.lastSignInTime ? new Date(r.lastSignInTime).toLocaleDateString() : "Never",
        }));

        res.status(200).json({
            success: true,
            message: "Recruiters quick stats fetched successfully.",
            data: infoWithJobsCount
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch recruiters quick stats.",
            error: error.message
        });
    }
}

module.exports = { admin_dashboardStats, admin_JobSeekersQuickStats, admin_RecruitersQuickStats }