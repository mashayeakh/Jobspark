const express = require("express");
const { getAIRecommendations, sendConnectionRequest, getIncomingRequests, respondToConnectRequest, testGemini, getRecommendedAIUsers, getPendintReq } = require("../../Controller/NetworkController/NetworkController");
const router = express.Router();

router.post("/recommend-connections", getAIRecommendations);
router.post('/send-connection-request', sendConnectionRequest);
router.get('/connection-requests/:loggedIn_toUser', getIncomingRequests);
router.patch("/connection-requests/:requestId/respond", respondToConnectRequest)

//!--------------------------------------------------------------------------------------------

router.post("/test", testGemini);
router.get("/recommendations/ai-users/:userId", getRecommendedAIUsers);
router.get("/get-pendingId/:userId", getPendintReq);




module.exports = router