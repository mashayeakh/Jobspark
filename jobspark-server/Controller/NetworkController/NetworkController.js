const axios = require("axios");
const connectionRequest = require("../../Model/NetworkModel/ConnectionReqModel");
const mongoose = require("mongoose");
const { getRecommendedUsers } = require("../../Utils/gemini");
const UserModel = require("../../Model/AccountModel/UserModel");
const ConnectionReqModel = require("../../Model/NetworkModel/ConnectionReqModel");



function buildPrompt(user) {
    return `
    You are an AI model that suggests network connections for a user.
    User Info:
    - Name: ${user.name}
    - Location: ${user.location}
    - Skills: ${user.skills?.join(", ")}
    - University: ${user.jobSeekerProfile?.education?.university}
    - Preferred Titles: ${user.jobSeekerProfile?.preferredJobTitles?.join(", ")}
    - Preferred Locations: ${user.jobSeekerProfile?.preferredLocations?.join(", ")}
    - Bio: ${user.jobSeekerProfile?.bio}
    
    Return a list of 10 recommended users from the database who have similar profiles.
    Output JSON format:
    [
      { "_id": "123", "name": "John Doe" },
      { "_id": "456", "name": "Jane Smith" }
    ]
      `;
}

//getting recommaddated users
// http://localhost:5000/api/v1/network/recommend-connections
const getAIRecommendations = async (req, res) => {
    try {
        const userProfile = req.body;

        // Basic validation
        if (!userProfile || typeof userProfile !== 'object') {
            return res.status(400).json({
                success: false,
                message: "Invalid user profile data."
            });
        }

        const prompt = buildPrompt(userProfile);
        if (!prompt) {
            return res.status(400).json({
                success: false,
                message: "Failed to build prompt from user profile."
            });
        }

        // const recommandedUsers = await axios.post("https://gemini.api.mock-url", {
        //     prompt
        // });

        const recommandedUsers = {
            data: [
                { _id: "6865182bf058530d7b94ec0a", name: "John Doe" },
                { _id: "6865182bf05098737b94ec0a", name: "Jane Smith" },
                { _id: "6865182bf058530d7b912384", name: "Ali Khan" },
                { _id: "6865182bf058530d7jk34343", name: "Maria Gomez" }
            ]
        };


        console.log("Recommandation", recommandedUsers);

        res.status(200).json({
            success: true,
            data: recommandedUsers.data,
        });
    } catch (error) {
        console.log("err in network controller ", error.message);
        res.status(500).json({
            success: false,
            message: "Failed to get AI recommendations.",
            error: error.message
        });
    }
}


//get all the reqs sent by a specific user

/**
 * *Retrieves all pending incoming connection requests for a specific user.
 * http://localhost:5000/api/v1/network/connection-requests/${toUserId}
 * 
 *  Req - Get
 * @async
 * @function getIncomingRequests
 * @param {Object} req - Express request object.
 * @param {Object} req.params - Request parameters.
 * @param {string} req.params.userId - The ID of the user to fetch incoming requests for.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} Sends a JSON response with the list of pending requests or an error message.
 */
const getIncomingRequests = async (req, res) => {
    try {
        const { loggedIn_toUser } = req.params;

        // Validate loggedIn_toUser
        if (!loggedIn_toUser || !mongoose.Types.ObjectId.isValid(loggedIn_toUser)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid user ID format.'
            });
        }

        // Find all pending connection requests for this user
        const requests = await connectionRequest.find({
            toUser: loggedIn_toUser,
            status: 'pending'
        }).populate("fromUser", "name profileImage role");

        console.log("Request ===", requests);

        res.status(200).json({
            success: true,
            data: requests
        });
    } catch (error) {
        console.error("Error in getIncomingRequests:", error.message);
        res.status(500).json({
            success: false,
            message: "Failed to fetch incoming requests.",
            error: error.message
        });
    }
}


// Respond to connect req with try-catch and validation
const respondToConnectRequest = async (req, res) => {
    try {
        const { requestId } = req.params;
        const { action } = req.body;

        // Validate requestId
        if (!requestId || !mongoose.Types.ObjectId.isValid(requestId)) {
            return res.status(400).json({ success: false, message: 'Invalid request ID format.' });
        }

        // Validate action
        if (!["accept", "reject"].includes(action)) {
            return res.status(400).json({ success: false, message: 'Invalid action.' });
        }

        // Find the connection request
        const request = await connectionRequest.findById(requestId);
        if (!request) {
            return res.status(404).json({ success: false, message: 'Connection request not found.' });
        }

        request.status = action === "accept" ? "accepted" : "rejected";
        await request.save();

        return res.status(200).json({
            success: true,
            message: `Connection request ${request.status}.`,
            data: request,
        });
    } catch (error) {
        console.error("Error in respondToConnectRequest:", error.message);
        return res.status(500).json({
            success: false,
            message: "Failed to respond to connection request.",
            error: error.message
        });
    }
}

//!---------------------------------------------------------------------------------------------------------


// Example user schema has: _id, name, location, skills (array), preferredRoles (array)

async function mapToRealUsers(recommendedUsers) {
    const updatedUsers = [];

    for (const rec of recommendedUsers) {
        // Find one user in DB matching on name + skills + location, etc.
        // You can relax the query or improve later
        const user = await UserModel.findOne({
            name: rec.name,
            location: rec.location,
            skills: { $all: rec.skills },
            preferredRoles: { $in: rec.preferredRoles },
        }).lean();
        console.log(`Match found for ${rec.name}?`, !!user);


        if (user) {
            updatedUsers.push(user);
        } else {
            // If no exact match, you can skip or keep the dummy record
            updatedUsers.push(rec);
        }
    }

    return updatedUsers;
}



//Lets test this harcoded propmt first
const testGemini = async (req, res) => {
    const prompt = `
    Based on this user's profile:
    - Name: Jane Doe
    - Location: New York, USA
    - Skills: JavaScript, React, Node.js, MongoDB, Express.js
    - Preferred Roles: Frontend Developer, Fullstack Developer
    - University: University of Technology

    Recommend 50 users with similar profiles.

    Output ONLY the JSON array.
    No markdown. No explanation. No comments.
    `;

    const response = await getRecommendedUsers(prompt);

    try {
        // Clean markdown-style backticks and trim
        const cleaned = response
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

        // Attempt to parse the cleaned JSON
        const json = JSON.parse(cleaned);
        const usersWithRealIds = await mapToRealUsers(json);
        res.json({ size: json.length, success: true, data: usersWithRealIds });
    } catch (err) {
        console.error("❌ Failed to parse Gemini response");
        console.error("Raw response:\n", response);
        res.status(500).json({
            success: false,
            error: "Invalid JSON from Gemini",
            raw: response
        });
    }
};

//get recommantion users, it means we need to call gemini API for users to get the recommendation fileterd by at least one matching skill, matching location, matching preferred role, matching university

//url - api/v1/recommendations/ai-users/:userId

const getRecommendedAIUsers = async (req, res) => {
    try {
        const { userId } = req.params;
        console.log("User ID:", userId);

        const currUser = await UserModel.findById(userId);
        if (!currUser || currUser.role !== "job_seeker") {
            return res.status(404).json({ error: "User not found or not a job seeker" });
        }

        const { location, jobSeekerProfile } = currUser;
        const preferredLocation = jobSeekerProfile?.preferredLocations?.[0];
        const university = jobSeekerProfile?.university;

        const recommendations = await UserModel.find({
            isGeneratedByAI: true,
            _id: { $ne: userId },
            $or: [
                { location },
                { "jobSeekerProfile.preferredLocations": preferredLocation },
                { "jobSeekerProfile.university": university }
            ]
        }).limit(20);

        console.log("Matched AI users count:", recommendations.length);

        return res.status(200).json({
            message: "Recommended AI users",
            success: true,
            data: recommendations,
        });
    } catch (error) {
        console.error("Error in getRecommendedAIUsers:", error);
        return res.status(500).json({ error: "Server error" });
    }
};

//sending req

const sendConnectionRequest = async (req, res) => {
    const { fromUserId, toUserId } = req.body;
    console.log("FromUserId and ToUserId", fromUserId, toUserId);

    //cant send req to self
    if (fromUserId === toUserId) {
        return res.status(400).json({ success: false, message: 'Cannot connect with yourself.' });
    }

    // Convert string IDs to ObjectId
    let fromUserObjId, toUserObjId;
    try {
        fromUserObjId = new mongoose.Types.ObjectId(fromUserId);
        toUserObjId = new mongoose.Types.ObjectId(toUserId);
    } catch (err) {
        return res.status(400).json({ success: false, message: 'Invalid user ID format.' });
    }

    //check if req exists already
    const existing = await connectionRequest.findOne({ fromUser: fromUserObjId, toUser: toUserObjId });
    if (existing) {
        return res.status(400).json({ success: false, message: 'Connection request already sent.' });
    }

    const newConnection = new connectionRequest({
        fromUser: fromUserObjId,
        toUser: toUserObjId
    })

    await newConnection.save();
    console.log("Connection Request Sent");

    return res.status(201).json(
        {
            success: true, message: 'Connection request sent.'
        });
}

//get the pending ids
const getPendintReq = async (req, res) => {
    try {
        const { userId } = req.params;
        console.log("USER ID ", userId);

        // Validate userId
        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ success: false, message: 'Invalid user ID format.' });
        }

        const pendingUsers = await ConnectionReqModel.find({ fromUser: userId });
        console.log("Pending users : ", pendingUsers);
        console.log("Pending users length: ", pendingUsers.length);

        const toUserIds = pendingUsers.map(id => id.toUser.toString());

        console.log("To users id ", toUserIds);
        console.log("To users id length", toUserIds.length);

        const r = await UserModel.find({ _id: toUserIds }).select("-password");
        console.log("Result ", r);
        console.log("Result length", r.length);

        res.status(200).json({
            success: true,
            ids: toUserIds,
            count: toUserIds.length
        });
    } catch (error) {
        console.error("Error in getPendintReq:", error.message);
        res.status(500).json({
            success: false,
            message: "Failed to fetch pending requests.",
            error: error.message
        });
    }
}

// find the information about pending request
// url - /network/pending-information/:userId
const pendingDetails = async (req, res) => {
    try {
        const { userId } = req.params;

        // Validate userId
        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ success: false, message: 'Invalid user ID format.' });
        }

        // Find all pending connection requests where the current user is the sender
        const pendingUsers = await ConnectionReqModel.find({ fromUser: userId });
        const ids = pendingUsers.map(i => i.toUser);

        const result = await UserModel.find({ _id: ids }).select("-password");

        res.status(200).json({
            success: true,
            data: result,
            count: result.length
        });
    } catch (error) {
        console.error("Error in pendingDetails:", error.message);
        res.status(500).json({
            success: false,
            message: "Failed to fetch pending request details.",
            error: error.message
        });
    }
}


module.exports = { getAIRecommendations, sendConnectionRequest, getIncomingRequests, respondToConnectRequest, testGemini, getRecommendedAIUsers, getPendintReq, pendingDetails };