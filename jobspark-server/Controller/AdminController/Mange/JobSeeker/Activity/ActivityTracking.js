const UserModel = require("../../../../../Model/AccountModel/UserModel");
const JobApplicationModel = require("../../../../../Model/JobApplicationModel/JobApplicationModel");

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
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = { jobSeekerActivity };
