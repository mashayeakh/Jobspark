
const axios = require("axios");
const connectionRequest = require("../../Model/NetworkModel/ConnectionReqModel");

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
                { _id: "123", name: "John Doe" },
                { _id: "456", name: "Jane Smith" },
                { _id: "789", name: "Ali Khan" },
                { _id: "101", name: "Maria Gomez" }
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

    //check if req exists already
    // const existing = await connectionRequest.findOne({ fromUser: fromUserId, toUser: toUserId });



}


module.exports = { getAIRecommendations, sendConnectionRequest }