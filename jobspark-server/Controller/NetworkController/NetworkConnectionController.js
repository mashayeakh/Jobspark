const UserModel = require("../../Model/AccountModel/UserModel");
const ConnectionReqModel = require("../../Model/NetworkModel/ConnectionReqModel");
const mongoose = require("mongoose");

//req - get -> accepted-users/:userId
//get all the accepted requests of a specific user
// GET /accepted-users/:userId
const getAcceptedRequest = async (req, res) => {
    try {
        const { userId } = req.params;
        console.log("User Id = ", userId);

        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ success: false, message: 'Invalid user ID format.' });
        }

        // Get accepted connections sent by this user
        const acceptedConnections = await ConnectionReqModel.find({
            fromUser: userId,
            status: "accepted"
        });

        // Extract toUser IDs
        const toUserIds = acceptedConnections.map(conn => conn.toUser);

        // Fetch user info
        const users = await UserModel.find({ _id: { $in: toUserIds } }).select("-password");

        res.status(200).json({
            success: true,
            data: users,
            count: users.length
        });
    } catch (error) {
        console.error("Error in getAcceptedRequest:", error.message);
        res.status(500).json({
            success: false,
            message: "Failed to fetch accepted requests.",
            error: error.message
        });
    }
}


//req - get => http://localhost:5000/api/v1/network/getAllConn/:userId
const getAcceptedConntection = async (req, res) => {
    try {
        const { userId } = req.params;
        if (!userId || typeof userId !== "string") {
            return res.status(400).json({ error: "Invalid or missing userId parameter." });
        }

        const users = await ConnectionReqModel.find({ fromUser: userId, status: "accepted" });
        console.log("USERS ", users);
        console.log("USERS Length", users.length);

        res.status(200).json({
            data: users,
            count: users.length
        });
    } catch (error) {
        console.error("Error in getAllConntection:", error);
        res.status(500).json({ error: "Internal server error." });
    }
};

module.exports = {
    getAcceptedConntection, getAcceptedRequest

};