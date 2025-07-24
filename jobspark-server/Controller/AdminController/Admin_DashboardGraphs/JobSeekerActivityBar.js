const UserModel = require("../../../Model/AccountModel/UserModel");
const JobApplicationModel = require("../../../Model/JobApplicationModel/JobApplicationModel");

// Function to get the count of job seekers registered on a specific day
const getRegisteredCount = async (startDate, endDate) => {
    try {
        const registeredCountArr = await UserModel.aggregate([
            {
                $match: {
                    role: "job_seeker",
                    createdAt: { $gte: startDate, $lte: endDate }  // Filter by registration date
                }
            },
            {
                $count: "registeredCountArr"
            }
        ]);

        return registeredCountArr[0] ? registeredCountArr[0].registeredCountArr : 0;
    } catch (error) {
        console.error("Error getting registered count:", error);
        return 0;
    }
};

// To count job applications made on a specific date
const getJobApplicationsCount = async (startDate, endDate) => {
    try {
        const jobApplicationsCount = await JobApplicationModel.aggregate([
            {
                $match: {
                    appliedAt: { $gte: startDate, $lte: endDate }  // Filter by application date
                }
            },
            {
                $count: "jobApplicationsCount"
            }
        ]);
        return jobApplicationsCount[0] ? jobApplicationsCount[0].jobApplicationsCount : 0;
    } catch (error) {
        console.error("Error getting job applications count:", error);
        return 0;
    }
};

// Profile completion count
const getProfileCompletedCount = async (startDate, endDate) => {
    try {
        const profileCompletedCount = await UserModel.aggregate([
            {
                $match: {
                    role: "job_seeker",
                    "jobSeekerProfile.isProfileComplete": true,  // Check if profile is complete
                    createdAt: { $gte: startDate, $lte: endDate }  // Filter by registration date
                }
            },
            {
                $count: "profileCompletedCount"
            }
        ]);
        return profileCompletedCount[0] ? profileCompletedCount[0].profileCompletedCount : 0;
    } catch (error) {
        console.error("Error getting profile completed count:", error);
        return 0;
    }
};

// API Endpoint: /api/dashboard/job-seekers/activity-trends
const jobSeekerActivityBar = async (req, res) => {
    const { startDate, endDate } = req.query;  // Get date range from query params

    // Convert the date strings to JavaScript Date objects
    const start = new Date(startDate);
    const end = new Date(endDate);

    try {
        const activityData = [];

        // Loop through each day in the range (for example, monthly aggregation)
        const currentDate = new Date(start); // Start from the given start date
        while (currentDate <= end) {
            const nextDate = new Date(currentDate);
            nextDate.setDate(nextDate.getDate() + 1);  // Get the next date

            const registered = await getRegisteredCount(currentDate, nextDate);
            const profileCompleted = await getProfileCompletedCount(currentDate, nextDate);
            const applied = await getJobApplicationsCount(currentDate, nextDate);

            activityData.push({
                date: currentDate.toISOString().split('T')[0],  // Format date as "YYYY-MM-DD"
                registered,
                applied,  // Keep applied count, even if 0
                profileCompleted,
            });

            currentDate.setDate(currentDate.getDate() + 1);  // Move to the next day
        }

        res.status(200).json({
            success: true,
            data: activityData,
            length: activityData.length,
            
        });
    } catch (error) {
        console.error("Error fetching activity data:", error);
        res.status(500).json({ message: "Error fetching activity data" });
    }
};

module.exports = { jobSeekerActivityBar };
