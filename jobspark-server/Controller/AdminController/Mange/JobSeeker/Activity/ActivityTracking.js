const UserModel = require("../../../../../Model/AccountModel/UserModel");
const JobApplicationModel = require("../../../../../Model/JobApplicationModel/JobApplicationModel");
const ActiveJobs = require("../../../../../Model/RecruiterModel/ActiveJobsModel");

// GET - admin/jobseeker/active
const jobSeekerActivity = async (req, res) => {
    try {
        // Aggregate JobApplications to count applications per user
        const topUsers = await JobApplicationModel.aggregate([
            {
                $group: {
                    _id: "$user",             // group by user
                    totalApplications: { $sum: 1 } // count applications
                }
            },
            { $sort: { totalApplications: -1 } }, // sort descending
            { $limit: 5 },                        // get top 5
            {
                $lookup: {                          // join with UserModel to get user info
                    from: "users",                     // name of the User collection
                    localField: "_id",
                    foreignField: "_id",
                    as: "userInfo"
                }
            },
            { $unwind: "$userInfo" },             // flatten array
            {
                $project: {
                    _id: 0,
                    userId: "$_id",
                    name: "$userInfo.name",
                    email: "$userInfo.email",
                    totalApplications: 1
                }
            }
        ]);

        res.json(topUsers);
        // res.status(200).json({
        //     success: true,
        //     message: `Inactive users for last ${days} days`,
        //     data: topUsers
        // });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};


//get - get inactive seekers more thatn 30+
const getInactiveSeekers = async (req, res) => {
    try {
        // Optional: let admin provide number of days via query, default 30
        const days = parseInt(req.query.days) || 30;
        if (days <= 0) {
            return res.status(400).json({ success: false, message: "Days must be greater than 0" });
        }

        const thresholdDate = new Date();
        thresholdDate.setDate(thresholdDate.getDate() - days);

        // Aggregate JobApplications to get last applied date per user
        const inactiveApplications = await JobApplicationModel.aggregate([
            {
                $group: {
                    _id: "$user",
                    lastApplied: { $max: "$appliedAt" }
                }
            },
            {
                $match: {
                    lastApplied: { $lte: thresholdDate } // inactive for given days
                }
            }
        ]);

        if (!inactiveApplications.length) {
            return res.status(200).json({ success: true, message: `No inactive users for last ${days} days`, data: [] });
        }

        // Fetch full user info
        const inactiveUsers = await UserModel.find({
            _id: { $in: inactiveApplications.map(a => a._id) }
        }).select("name email createdAt");

        // Add inactiveDays to each user
        const today = new Date();
        const result = inactiveUsers.map(user => {
            const lastAppliedRecord = inactiveApplications.find(a => a._id.toString() === user._id.toString());
            const lastApplied = lastAppliedRecord ? new Date(lastAppliedRecord.lastApplied) : null;
            const inactiveDays = lastApplied ? Math.floor((today - lastApplied) / (1000 * 60 * 60 * 24)) : null;

            return {
                ...user.toObject(),
                inactiveDays
            };
        });

        res.status(200).json({
            success: true,
            message: `Inactive users for last ${days} days`,
            data: result
        });

    } catch (error) {
        console.error("Error fetching inactive seekers:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

//daily activity - week wise
// get - admin/jobseeker/daily
const getDailyActiveSeekers = async (req, res) => {
    try {
        const dailyStats = await JobApplicationModel.aggregate([
            {
                $group: {
                    _id: {
                        dayOfWeek: { $dayOfWeek: "$appliedAt" } // 1 = Sunday, 7 = Saturday
                    },
                    active: { $addToSet: "$user" }, // unique active seekers
                    totalApps: { $sum: 1 }, // total applications
                    avgTime: { $avg: { $hour: "$appliedAt" } } // example: avg applied hour
                }
            },
            {
                $project: {
                    dayOfWeek: "$_id.dayOfWeek",
                    active: { $size: "$active" }, // convert users set to count
                    avgTime: 1,
                    totalApps: 1,
                    _id: 0
                }
            },
            { $sort: { dayOfWeek: 1 } }
        ]);

        // Map numeric day → string label
        const daysMap = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

        const formatted = dailyStats.map(stat => ({
            day: daysMap[stat.dayOfWeek - 1],
            active: stat.active,
            avgTime: Math.round(stat.avgTime) || 0, // avg application hour as placeholder
            totalApps: stat.totalApps
        }));

        res.status(200).json({
            success: true,
            message: "Daily active seekers",
            data: formatted
        });
    } catch (err) {
        console.error("Error fetching daily activity:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

//get top most skills
//get - jobseeker/top-skills
const topSkills = async (req, res) => {
    try {
        const jobs = await ActiveJobs.find({}, "skills");

        if (!jobs || jobs.length === 0) {
            return res.status(404).json({ success: false, message: "No jobs found" });
        }

        // Step 1: Flatten all skills into one array
        let allSkills = [];
        jobs.forEach(job => {
            if (job.skills) {
                const all = job.skills.split(",").map(s => s.trim().toLowerCase())
                allSkills.push(...all);
            }
        })

        console.log("ALLLLL ", allSkills);

        // Step 2: Count frequencies
        const skillCount = {};
        allSkills.forEach(skill => {
            skillCount[skill] = (skillCount[skill] || 0) + 1;
        });

        // Step 3: Convert to sorted array
        const sortedSkills = Object.entries(skillCount)
            .map(([skill, count]) => ({ skill, count }))
            .sort((a, b) => b.count - a.count);

        res.status(200).json({
            success: true,
            message: "Top skills",
            data: sortedSkills.slice(0, 10) // top 10
        });
    } catch (err) {
        console.error("Error in topSkills:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

//get experience level
//get - jobseeker/experience-level
const getExperienceLevel = async (req, res) => {
    try {
        const result = await UserModel.aggregate([
            {
                $group: {
                    _id: "$experienceLevel", // group by experienceLevel
                    count: { $sum: 1 }      // count how many
                }
            }
        ]);

        // ✅ validation: no data found
        if (!result || result.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No experience level data found",
                data: []
            });
        }

        // map into categories
        const mapped = result.map(item => {
            let category = "Other";

            if (item._id === "Junior" || item._id === "Junior Level (0-1 years)") {
                category = "Junior level Dev";
            } else if (item._id === "Mid" || item._id === "Mid Level (1-3 years)") {
                category = "Mid level Dev";
            } else if (item._id === "Senior" || item._id === "Senior Level (3-5 years)") {
                category = "Senior level Dev";
            }

            return {
                category,
                count: item.count
            };
        });

        // merge duplicates (if multiple DB labels map to same category)
        const merged = Object.values(
            mapped.reduce((acc, cur) => {
                if (!acc[cur.category]) {
                    acc[cur.category] = { category: cur.category, count: 0 };
                }
                acc[cur.category].count += cur.count;
                return acc;
            }, {})
        );

        // ✅ success response
        return res.status(200).json({
            success: true,
            message: "Experience levels fetched successfully",
            data: merged
        });
    } catch (err) {
        console.error("Error fetching experience levels:", err);
        return res.status(500).json({
            success: false,
            message: "Server error while fetching experience levels",
            error: err.message
        });
    }
};





module.exports = { jobSeekerActivity, getInactiveSeekers, getDailyActiveSeekers, topSkills, getExperienceLevel };
