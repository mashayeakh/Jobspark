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



module.exports = { jobSeekerActivity, getInactiveSeekers };
