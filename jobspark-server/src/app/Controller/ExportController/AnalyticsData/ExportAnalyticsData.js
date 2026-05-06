const { Parser } = require("json2csv");
const RecruiterActivityModel = require("../../../Model/RecruiterModel/RecruiterActivityModel");
const { default: mongoose } = require("mongoose");

// Req- Get => /api/v1/export/recruiter/recruiterId/analytics-data

const analyticsData = async (req, res) => {
    try {
        const { recruiterId } = req.params;
        if (!recruiterId || !mongoose.Types.ObjectId.isValid(recruiterId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid or missing recruiterId",
            });
        }

        const applicationsOverTime = await RecruiterActivityModel.aggregate([
            {
                $match: { recruiter: new mongoose.Types.ObjectId(recruiterId) }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    applicationsCount: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    date: "$_id",
                    applicationsCount: 1
                }
            },
            { $sort: { date: 1 } }
        ]);

        if (applicationsOverTime.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No application data found for this recruiter",
            });
        }

        const csv = new Parser().parse(applicationsOverTime);

        res.setHeader("Content-Disposition", "attachment; filename=applications_over_time.csv");
        res.setHeader("Content-Type", "text/csv");

        res.status(200).send(csv);
    } catch (error) {
        console.error("Error exporting analytics data:", error);
        res.status(500).json({
            success: false,
            message: "Server error while exporting analytics data",
        });
    }
};

module.exports = { analyticsData };