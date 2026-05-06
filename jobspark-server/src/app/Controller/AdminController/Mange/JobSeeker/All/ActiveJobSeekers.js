const UserModel = require("../../../../../Model/AccountModel/UserModel");

// Helper function to format date for recent activity (optional, but good for consistency)
const getFormattedDate = (date) => {
    // Ensure date is a valid Date object before calling methods on it
    if (!date instanceof Date || isNaN(date)) {
        return "Invalid Date";
    }
    return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    });
};

// req- get - admin/jobseeker/overview-stats
const getJobSeekerOverviewStats = async (req, res) => {
    try {
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

        const aggregationResult = await UserModel.aggregate([
            {
                $match: {
                    role: "job_seeker" // First, filter for only job seekers relevant to the dashboard
                }
            },
            {
                $facet: {
                    // Pipeline 1: Get the total count of ALL job seekers
                    totalJobSeekers: [
                        { $count: "count" }
                    ],
                    // Pipeline 2: Get the details of RECENTLY SIGNED-IN job seekers
                    recentSignInsDetails: [
                        {
                            $match: {
                                lastSignInTime: { $gte: sevenDaysAgo }
                            }
                        },
                        {
                            $sort: { lastSignInTime: -1 }
                        },
                        {
                            $limit: 10 // Limit to top N recent sign-ins for dashboard display
                        },
                        {
                            $project: {
                                _id: 1,
                                name: 1,
                                email: 1,
                                lastSignInTime: 1,
                                location: 1,
                                profileCompletion: 1, // Added for dashboard completeness overview
                                status: 1, // Added for dashboard status overview
                                applications: 1, // Added for dashboard applications overview
                                skills: 1, // Added for skills breakdown
                                experienceLevel: 1, // Added for experience level breakdown
                                isProfileComplete: "$jobSeekerProfile.isProfileComplete"
                            }
                        }
                    ],
                    // Pipeline 3: Get the count of recent sign-ins
                    recentSignInCount: [
                        {
                            $match: {
                                lastSignInTime: { $gte: sevenDaysAgo }
                            }
                        },   
                        { $count: "count" }
                    ],
                    // Pipeline 4: Get ALL job seeker details (for the main table/list)
                    allJobSeekers: [
                        {
                            $project: { // Project all necessary fields for the job seeker table
                                _id: 1,
                                name: 1,
                                email: 1,
                                skills: 1,
                                experienceLevel: 1,
                                location: 1,
                                profileCompletion: 1,
                                status: 1,
                                appliedApplicationCount: 1,
                                lastSignInTime: 1,
                                // Add any other fields from your UserModel schema that you need
                            }
                        },
                        { $sort: { createdAt: -1 } } // Optional: sort all job seekers by creation date or name
                    ]
                }
            }
        ]);

        const facetData = aggregationResult[0];

        // Extracting data safely
        const totalJobSeekersCount = facetData.totalJobSeekers.length > 0 ? facetData.totalJobSeekers[0].count : 0;
        const recentSignInsList = facetData.recentSignInsDetails || [];
        const recentSignInsTotalCount = facetData.recentSignInCount.length > 0 ? facetData.recentSignInCount[0].count : 0;
        const allJobSeekersList = facetData.allJobSeekers || []; // New: all job seeker details

        console.log("Total Job Seekers:", totalJobSeekersCount);
        console.log("Recent Sign-In Count (last 7 days):", recentSignInsTotalCount);
        console.log("Details of Recent Sign-Ins:", recentSignInsList);
        console.log("All Job Seekers Count:", allJobSeekersList.length); // Log the count of all job seekers
        // console.log("All Job Seekers Details (first 5):", allJobSeekersList.slice(0, 5)); // Log a few for checking

        // Send a structured JSON response to the frontend
        res.status(200).json({
            success: true,
            message: "Job seeker overview statistics retrieved successfully",
            data: {
                totalJobSeekers: totalJobSeekersCount,
                recentSignInCount: recentSignInsTotalCount,
                recentSignIns: recentSignInsList.map(profile => ({
                    ...profile,
                    lastSignInTime: getFormattedDate(new Date(profile.lastSignInTime))
                })),
                allJobSeekers: allJobSeekersList.map(profile => ({
                    ...profile,
                    lastSignInTime: profile.lastSignInTime ? getFormattedDate(new Date(profile.lastSignInTime)) : null // Handle potential null/undefined lastSignInTime
                }))
            }
        });

    } catch (error) {
        console.error("Error fetching job seeker overview stats:", error);
        res.status(500).json({
            success: false,
            message: "Failed to retrieve job seeker overview statistics",
            error: error.message
        });
    }
}

module.exports = { getJobSeekerOverviewStats };



//calculate profle completeness
const calculateProfileCompleteness = (user) => {
    let score = 0;
    const total = 5;

    if (user.name) score += 10;
    if (user.email) score += 10;
    if (user.experienceLevel) score += 10;
    if (user.skills && user.skills.length >= 3) score += 15;
    if (user.jobSeekerProfile?.preferredJobTitles?.length) score += 10;
    if (user.jobSeekerProfile?.preferredLocations?.length) score += 10;
    if (user.jobSeekerProfile?.education?.length && user.jobSeekerProfile.education[0]?.university) score += 15;
    if (user.lastSignInTime) score += 10;

    const percentage = Math.round((score / total) * 100);
    return percentage >= 60;
};

// count the num of complete profile
// req- get - admin/job_seeker/all/completeness
const getCompletedProfileStats = async (req, res) => {
    try {
        const jobSeekers = await UserModel.find({ role: "job_seeker" });

        let completedProfiles = [];

        for (const user of jobSeekers) {
            const isComplete = calculateProfileCompleteness(user); // Still useful for future use

            const status = user.lastSignInTime ? "Active" : "Inactive";

            completedProfiles.push({
                id: user._id,
                name: user.name,
                email: user.email,
                experienceLevel: user.experienceLevel,
                preferredJobTitles: user.jobSeekerProfile?.preferredJobTitles || [],
                preferredLocations: user.jobSeekerProfile?.preferredLocations || [],
                education: user.jobSeekerProfile?.education || [],
                skills: user.skills || [],
                profileCompletion: isComplete,
                lastSignInTime: user.lastSignInTime,
                status
            });
        }


        const total = jobSeekers.length;
        const completedCount = completedProfiles.length;
        const completionRate = total > 0 ? Math.round((completedCount / total) * 100) : 0;

        res.status(200).json({
            success: true,
            totalJobSeekers: total,
            completeProfiles: completedCount,
            completionRate,
            completedUsers: completedProfiles
        });
    } catch (error) {
        console.error("Error calculating completed profiles:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};




module.exports = { getJobSeekerOverviewStats, getCompletedProfileStats };