const UserModel = require("../../../../../Model/AccountModel/UserModel");
const ActiveJobsModel = require("../../../../../Model/RecruiterModel/ActiveJobsModel");

// Route to get total number of job seekers
// Request: GET - /api/v1/admin/jobseeker/dashboard/total_job_seeker
const totalJobSeekers = async (req, res) => {
    try {
        const jobseekers = await UserModel.aggregate([
            { $match: { role: "job_seeker" } }
        ]);

        res.status(200).json({
            success: jobseekers.length > 0,
            total: jobseekers.length
        });
    } catch (error) {
        console.error("Error fetching job seekers:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Route to get the count of active job seeker profiles based on last sign-in and job applications
// Request: GET - /api/v1/admin/jobseeker/dashboard/active-profile
const activeProfile = async (req, res) => {
    try {
        const activeProfiles = await UserModel.aggregate([
            {
                $match: {
                    role: "job_seeker",
                    "jobSeekerProfile.isProfileComplete": true,
                    lastSignInTime: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
                    appliedApplicationCount: { $gte: 0 }
                }
            }
        ]);

        res.status(200).json({
            success: activeProfiles.length > 0,
            count: activeProfiles.length,
            message: "Active job seeker profiles found.",
            data: activeProfiles
        });
    } catch (error) {
        console.error("Error fetching active profiles:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// Route to get new registrations within the last 7 days
// Request: GET - /api/v1/admin/jobseeker/dashboard/new-registration
const newRegistration = async (req, res) => {
    try {
        const recentRegistration = await UserModel.aggregate([
            { $match: { role: "job_seeker", createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } } }
        ]);

        res.status(200).json({
            success: recentRegistration.length > 0,
            count: recentRegistration.length,
            message: "Recent job seeker registrations found.",
            data: recentRegistration
        });
    } catch (error) {
        console.error("Error fetching recent registrations:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// Route to get job seekers with completed profiles
// Request: GET - /admin/dashboard/profile_completion
const profileCompletion = async (req, res) => {
    try {
        const profileCompletion = await UserModel.aggregate([
            {
                $match: {
                    role: "job_seeker",
                    "jobSeekerProfile.isProfileComplete": true,
                    lastSignInTime: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
                    appliedApplicationCount: { $gte: 0 },
                    "jobSeekerProfile.preferredJobTitles": { $ne: [] },
                    "jobSeekerProfile.preferredLocations": { $ne: [] },
                    "jobSeekerProfile.certificates": { $ne: [] },
                    "jobSeekerProfile.education": { $ne: [] },
                    "jobSeekerProfile.bio": { $exists: true, $ne: "" },
                    "jobSeekerProfile.resume": { $exists: true, $ne: "" }
                }
            }
        ]);

        res.status(200).json({
            success: profileCompletion.length > 0,
            count: profileCompletion.length,
            message: "Profile completions found.",
            data: profileCompletion
        });
    } catch (error) {
        console.error("Error fetching profile completions:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// Route to get distribution of skills across applications
// Request: GET - /admin/dashboard/skills_distribution
const skillsDistribution = async (req, res) => {
    try {
        const application = await ActiveJobsModel.aggregate([
            { $match: { applicantsCount: { $gte: 1 } } }
        ]);

        if (application.length > 0) {
            const skillsArray = application.map(a => a?.skills.split(',').map(skill => skill.trim()));
            const allSkills = skillsArray.flat();
            const skillCount = {};

            allSkills.forEach(skill => {
                skillCount[skill] = (skillCount[skill] || 0) + 1;
            });

            res.status(200).json({
                success: true,
                count: allSkills.length,
                distribution: skillCount,
                message: "Skills distribution found."
            });
        } else {
            res.status(200).json({
                success: false,
                count: 0,
                distribution: {},
                message: "No skills distribution found."
            });
        }
    } catch (error) {
        console.error("Error fetching skills distribution:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// Route to get top skills based on the number of applicants
// Request: GET - /admin/dashboard/topskills
const getTopSkills = async (req, res) => {
    try {
        const jobs = await ActiveJobsModel.aggregate([
            { $match: { applicantsCount: { $gte: 1 } } }
        ]);

        if (!jobs || jobs.length === 0) {
            return res.status(200).json({
                success: false,
                topSkills: [],
                message: "No jobs found with applicants."
            });
        }

        const skillFrequency = {};
        jobs.forEach(job => {
            if (job.skills) {
                job.skills.split(',').map(s => s.trim()).forEach(skill => {
                    if (skill) {
                        skillFrequency[skill] = (skillFrequency[skill] || 0) + 1;
                    }
                });
            }
        });

        const topSkills = Object.entries(skillFrequency)
            .sort((a, b) => b[1] - a[1])
            .map(([skill, count]) => ({ skill, count }));

        res.status(200).json({
            success: true,
            topSkills,
            message: "Top skills by number of applications."
        });
    } catch (error) {
        console.error("Error fetching top skills:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// Route to get top locations for job postings
// Request: GET - /admin/dashboard/top_loction
const topLocation = async (req, res) => {
    try {
        const topLocations = await ActiveJobsModel.aggregate([
            { $match: { location: { $exists: true, $ne: "" } } },
            { $group: { _id: "$location", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 },
            { $project: { _id: 0, location: "$_id", count: 1 } }
        ]);

        res.status(200).json({
            success: topLocations.length > 0,
            topLocations,
            message: "Top locations by number of jobs."
        });
    } catch (error) {
        console.error("Error fetching top locations:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// Route to get top job categories based on job postings
// Request: GET - /admin/dashboard/top_job_categories
const top_job_categories = async (req, res) => {
    try {
        const jobCate = await ActiveJobsModel.aggregate([
            { $match: { jobCategory: { $exists: true, $ne: "" } } },
            { $group: { _id: "$jobCategory", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 },
            { $project: { _id: 0, name: "$_id", count: 1 } }

        ]);

        res.status(200).json({
            success: jobCate.length > 0,
            count: jobCate.length,
            topJobCategories: jobCate,
            message: "Top job categories by number of jobs."
        });
    } catch (error) {
        console.error("Error fetching top job categories:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

module.exports = {
    totalJobSeekers,
    activeProfile,
    newRegistration,
    profileCompletion,
    skillsDistribution,
    getTopSkills,
    topLocation,
    top_job_categories
};
