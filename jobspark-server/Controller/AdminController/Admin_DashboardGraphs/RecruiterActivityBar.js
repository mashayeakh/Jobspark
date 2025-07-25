const UserModel = require("../../../Model/AccountModel/UserModel");
const JobApplicationModel = require("../../../Model/JobApplicationModel/JobApplicationModel");
const ActiveJobsModel = require("../../../Model/RecruiterModel/ActiveJobsModel");

// on a specific day, need to count how many recruiters are registered. 
const getRegisteredRecruiterCount = async (startDate, endDate) => {
    try {
        const registeredRecruiterCountArr = await UserModel.aggregate([
            {
                $match: {
                    role: "recruiter",
                    createdAt: { $gte: startDate, $lte: endDate }
                }
            },
            {
                $count: "registeredRecruiterCount"
            }
        ]);
        return registeredRecruiterCountArr[0] ? registeredRecruiterCountArr[0].registeredRecruiterCount : 0;
    } catch (error) {
        console.error("Error getting registered recruiter count:", error);
        return 0;
    }
};

// To count job postings made by recruiters on a specific date
const getJobPostingsCount = async (startDate, endDate) => {
    try {
        const jobPostingsCount = await ActiveJobsModel.aggregate([
            {
                $match: {
                    createdAt: { $gte: startDate, $lte: endDate } // Match by createdAt field
                }
            },
            {
                $count: "jobPostingsCount" // Count the number of job postings
            }
        ]);
        console.log("Job posting count ===", jobPostingsCount);
        return jobPostingsCount[0] ? jobPostingsCount[0].jobPostingsCount : 0;
    } catch (error) {
        console.error("Error getting job postings count:", error);
        return 0;
    }
};



// To count job applications received by recruiters on a specific date
const getApplicationsReceivedCount = async (startDate, endDate) => {
    try {
        const applicationsReceivedCount = await JobApplicationModel.aggregate([
            {
                $match: {
                    appliedAt: { $gte: startDate, $lte: endDate } // Filter by application date
                }
            },
            {
                $count: "applicationsReceivedCount"
            }
        ]);
        return applicationsReceivedCount[0] ? applicationsReceivedCount[0].applicationsReceivedCount : 0;
    } catch (error) {
        console.error("Error getting applications received count:", error);
        return 0;
    }
};

// get - api/dahstboard/recruiter-activity-trends
const recruiterActivityBar = async (req, res) => {
    const { startDate, endDate } = req.query;  // Get date range from query params

    try {
        const activityData = [];

        // Loop through each day in the range (for example, monthly aggregation)
        const currentDate = new Date(startDate);
        while (currentDate <= new Date(endDate)) {
            const nextDate = new Date(currentDate);
            nextDate.setDate(nextDate.getDate() + 1);

            const registered = await getRegisteredRecruiterCount(currentDate, nextDate);
            const jobPostings = await getJobPostingsCount(currentDate, nextDate);
            const applicationsReceived = await getApplicationsReceivedCount(currentDate, nextDate);

            activityData.push({
                date: currentDate.toISOString().split('T')[0],  // Format the date as "YYYY-MM-DD"
                registered,
                jobPostings,
                applicationsReceived,
            });

            currentDate.setDate(currentDate.getDate() + 1);  // Move to the next day
        }

        res.status(200).json({
            success: true,
            data: activityData
        });
    } catch (error) {
        console.error("Error fetching recruiter activity data:", error);
        res.status(500).json({ message: "Error fetching recruiter activity data" });
    }
};

module.exports = { recruiterActivityBar }