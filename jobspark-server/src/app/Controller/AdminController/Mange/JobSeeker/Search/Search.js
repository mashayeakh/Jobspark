const AdminModel = require("../../../../../Model/AccountModel/AdminModel");
const UserModel = require("../../../../../Model/AccountModel/UserModel");

// search - get - search/all
const allInfo = async (req, res) => {
    try {
        // Validate request
        // if (!req.query || !req.query.role) {
        //     return res.status(400).json({ success: false, message: 'Role query parameter is required.' });
        // }

        // Fetch all users (with job_seeker role)
        const allUsers = await UserModel.find({ role: "job_seeker" })
            .select('name email location experienceLevel jobSeekerProfile.isVerified skills jobSeekerProfile.isSuspended jobSeekerProfile.education')
            .lean();

        // Check if users were found
        if (!allUsers || allUsers.length === 0) {
            return res.status(404).json({ success: false, message: 'No job seekers found.' });
        }

        console.log("All Users: ", allUsers);

        // Fetch verified users
        const verified = await UserModel.aggregate([
            {
                $match: {
                    role: "job_seeker",
                    "jobSeekerProfile.isVerified": true,
                }
            }
        ]);

        // Fetch unverified user count
        const unverifiedCount = await UserModel.countDocuments({
            role: "job_seeker",
            $or: [
                { "jobSeekerProfile.isVerified": { $ne: true } },
                { jobSeekerProfile: { $exists: false } },
            ],
        });


        //fetch num of admin, job seekers and recruiter
        const adminCount = await AdminModel.find();
        const jobSeekerCount = await UserModel.find({ role: "job_seeker" });
        const recruiterCount = await UserModel.find({ role: "recruiter" });



        // console.log("Verified Users: ", verified);
        // console.log("Unverified Count: ", unverifiedCount);
        // console.log("ADmin ", adminCount.length);
        // console.log("job ", jobSeekerCount);
        // console.log("re ", recruiterCount);
        // console.log("job ", jobSeekerCount.length);
        // console.log("re ", recruiterCount.length);

        // Send success response with data
        return res.status(200).json({
            success: true,
            message: 'Data retrieved successfully.',
            data: {
                allUsers: allUsers,
                admin: adminCount.length,
                jobSeekerCount: jobSeekerCount,
                recruiterCount: recruiterCount,
                verifiedUsers: verified,
                unverifiedUsers: unverifiedCount
            }
        });

    } catch (error) {
        // Handle unexpected errors
        console.error("Error in allInfo:", error);
        return res.status(500).json({ success: false, message: 'Internal server error. Please try again later.' });
    }
};

module.exports = { allInfo };
