const express = require("express");
const { getAIRecommendations, sendConnectionRequest, getIncomingRequests, respondToConnectRequest } = require("../../Controller/NetworkController/NetworkController");
const router = express.Router();

router.post("/recommend-connections", getAIRecommendations);
router.post('/send-connection-request', sendConnectionRequest);

router.get('/connection-requests/:userId', getIncomingRequests);

router.patch("/connection-requests/:requestId/respond", respondToConnectRequest)

module.exports = router