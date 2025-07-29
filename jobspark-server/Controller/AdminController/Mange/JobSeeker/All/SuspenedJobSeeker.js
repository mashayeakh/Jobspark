//! This page contains this code of suspended job seeker.

const UserModel = require("../../../../../Model/AccountModel/UserModel");


//fetch the incomplete profiles
const getIncompleteProfiles = async (req, res) => {
    try {
        const result = await UserModel.aggregate([
            {
                $match: {
                    role: "job_seeker",
                    'jobSeekerProfile.isProfileComplete': false,
                    $or: [
                        { 'jobSeekerProfile.preferredJobTitles': { $size: 0 } },
                        { 'jobSeekerProfile.preferredLocations': { $size: 0 } },
                        { 'jobSeekerProfile.certificates': { $size: 0 } },
                        // Add more fields here if needed
                    ]
                }
            },
            {
                $project: {
                    name: 1,
                    email: 1,
                    location: 1,
                    'jobSeekerProfile.preferredJobTitles': 1,
                    'jobSeekerProfile.preferredLocations': 1,
                    'jobSeekerProfile.certificates': 1,
                    experienceLevel: 1,
                    role: 1,
                    isProfileComplete: '$jobSeekerProfile.isProfileComplete'
                }
            }
        ]);

        if (!result || result.length === 0) {
            return res.status(200).json({
                success: true,
                message: "No incomplete profiles found",
                data: [],
            });
        }

        return res.status(200).json({
            success: true,
            count: result.length,
            message: `${result.length} incomplete profile(s) found`,
            data: result,
        });

    } catch (error) {
        console.error("Error fetching incomplete profiles:", error);

        return res.status(500).json({
            success: false,
            message: "An error occurred while fetching incomplete profiles",
            error: error.message,
        });
    }
};


module.exports = { getIncompleteProfiles }