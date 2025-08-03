const UserModel = require("../../../../../Model/AccountModel/UserModel");


const getVerifiedStats = async (req, res) => {
    try {
        // Validate role as job_seeker for this stats endpoint
        const role = "job_seeker";

        // Count all job 

        // Count all job seekers
        const total = await UserModel.countDocuments({ role });

        if (!role) {
            return res.status(400).json({
                success: false,
                message: "Role is required for fetching stats.",
            });
        }


        const allUsers = await UserModel.find({ role })
            .select('name email location experienceLevel jobSeekerProfile.isVerified')
            .lean();


        const verifiedCount = await UserModel.countDocuments({
            role: role,
            "jobSeekerProfile.isVerified": true,
        });

        const unverifiedCount = await UserModel.countDocuments({
            role: role,
            $or: [
                { "jobSeekerProfile.isVerified": { $ne: true } },
                { jobSeekerProfile: { $exists: false } },
            ],
        });

        // Fetch detailed information for verified and unverified users
        const verifiedUsers = await UserModel.find({
            role: role,
            "jobSeekerProfile.isVerified": true,
        }).select('name email location experienceLevel jobSeekerProfile.isVerified');

        const unverifiedUsers = await UserModel.find({
            role: role,
            $or: [
                { "jobSeekerProfile.isVerified": { $ne: true } },
                { jobSeekerProfile: { $exists: false } },
            ],
        }).select('name email location jobSeekerProfile.experience jobSeekerProfile.isVerified');

        return res.status(200).json({
            success: true,
            message: "Verified stats fetched successfully",
            data: {
                jobSeeker: total,
                verified: verifiedCount,
                unverified: unverifiedCount,
                totalUsers: allUsers.map(all => ({
                    name: all.name,
                    email: all.email,
                    location: all?.location || 'Not specified',
                    experience: all.experienceLevel || 'Not specified',
                    status: all.jobSeekerProfile?.isVerified === true ? "Verified" : all.jobSeekerProfile?.isVerified === false ? "Not verified" : 'Not specified'
                })),
                verifiedUsers: verifiedUsers.map(user => ({
                    name: user.name,
                    email: user.email,
                    location: user?.location || 'Not specified',
                    experience: user.experienceLevel || 'Not specified',
                    status: user.jobSeekerProfile?.isVerified === true ? "Verified" : user.jobSeekerProfile?.isVerified === false ? "Not verified" : 'Not specified'
                })),
                unverifiedUsers: unverifiedUsers.map(user => ({
                    name: user.name,
                    email: user.email,
                    location: user.location || 'Not specified',
                    experience: user.jobSeekerProfile?.experience || 'Not specified',
                    status: user.jobSeekerProfile?.isVerified === true ? "Verified" : user.jobSeekerProfile?.isVerified === false ? "Not verified" : 'Not specified'
                }))
            },
        });
    } catch (error) {
        console.error("Error fetching verified stats:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error while fetching verified stats",
            error: error.message,
        });
    }
};

module.exports = { getVerifiedStats };