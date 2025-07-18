// get application data for last 7 days.
// req - get => /api/v1/graphs/recruiter/:recruiterId/application/over-time

const { default: mongoose } = require("mongoose");
const RecruiterActivityModel = require("../../Model/RecruiterModel/RecruiterActivityModel");

const getApplicationsOverTime = async (req, res) => {
    const { recruiterId } = req.params;
    console.log("Recruiter id ", recruiterId);


    //colculating date
    const today = new Date();
    console.log("Today ", today.getDate()); // exxcat day num - 18
    const startDate = new Date();

    startDate.setDate(today.getDate() - 6);
    console.log("Start Get ", startDate.getDate()); //  12



    try {
        const rawData = await RecruiterActivityModel.aggregate([
            {
                $match: {
                    recruiter: new mongoose.Types.ObjectId(recruiterId),
                    createdAt: { $gte: startDate, $lte: today }
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
                    },
                    total: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // Step 2: Fill in missing dates
        const result = [];
        for (let i = 0; i < 7; i++) {
            const date = new Date();
            date.setDate(today.getDate() - 6 + i);
            const dateStr = date.toISOString().split('T')[0]; // e.g. 2025-07-17
            const found = rawData.find(r => r._id === dateStr);
            result.push({
                date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), // e.g. Jul 17
                total: found ? found.total : 0
            });
        }

        return res.status(200).json({
            success: true,
            message: "Applications over time on last 7 days",
            data: result,
        });
    } catch (error) {
        console.error('Error in application over time API:', error);
        return res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
}

module.exports = { getApplicationsOverTime }