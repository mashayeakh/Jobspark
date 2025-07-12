const UserModel = require("../../Model/AccountModel/UserModel");
const mongoose = require("mongoose");

//http://localhost:5000/api/v1/all-user/:${userId}
const getAllUsers = async (req, res) => {
    try {
        const { userId } = req.params;
        if (!userId || typeof userId !== "string") {
            return res.status(400).json({ error: "Invalid userId parameter" });
        }
        const users = await UserModel.find({ _id: { $ne: userId } });
        res.status(200).json(
            {
                data: users,
                count: users.length
            }
        );
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch users" });
    }
}

module.exports = {
    getAllUsers
}