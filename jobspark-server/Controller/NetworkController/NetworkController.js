const axios = require("axios");
const connectionRequest = require("../../Model/NetworkModel/ConnectionReqModel");
const mongoose = require("mongoose");



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

//get all the reqs sent by a specific user

/**
 * *Retrieves all pending incoming connection requests for a specific user.
 * http://localhost:5000/api/v1/network/connection-requests/${userId}
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
        const { userId } = req.params;

        // Validate userId
        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid user ID format.'
            });
        }

        // Find all pending connection requests for this user
        const requests = await connectionRequest.find({
            toUser: userId,
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



module.exports = { getAIRecommendations, sendConnectionRequest, getIncomingRequests, respondToConnectRequest }