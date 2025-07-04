const express = require("express");
const { getAIRecommendations, sendConnectionRequest, getIncomingRequests, respondToConnectRequest, testGemini } = require("../../Controller/NetworkController/NetworkController");
const router = express.Router();

router.post("/recommend-connections", getAIRecommendations);
router.post('/send-connection-request', sendConnectionRequest);
router.get('/connection-requests/:toUserId', getIncomingRequests);
router.patch("/connection-requests/:requestId/respond", respondToConnectRequest)

//!--------------------------------------------------------------------------------------------

router.post("/test", testGemini);




module.exports = router