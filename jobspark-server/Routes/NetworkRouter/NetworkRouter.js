const express = require("express");
const { getAIRecommendations, sendConnectionRequest, getIncomingRequests, respondToConnectRequest, testGemini, getRecommendedAIUsers, getPendintReq, pendingDetails, updateStatus } = require("../../Controller/NetworkController/NetworkController");
const { getAllConntection, getAcceptedConntection, getAcceptedRequest } = require("../../Controller/NetworkController/NetworkConnectionController");
const router = express.Router();

router.post("/recommend-connections", getAIRecommendations);
router.post('/send-connection-request', sendConnectionRequest);
router.get('/connection-requests/:loggedIn_toUser', getIncomingRequests);
router.patch("/connection-requests/:requestId/respond", respondToConnectRequest)

//!--------------------------------------------------------------------------------------------

router.post("/test", testGemini);
router.get("/recommendations/ai-users/:userId", getRecommendedAIUsers);
router.get("/get-pendingId/:userId", getPendintReq);
router.get("/pending-information/:userId", pendingDetails);
router.patch("/update-status/:docId", updateStatus);
router.get("/accepted-users/:userId", getAcceptedRequest);
router.get("/getAllConn/:userId", getAcceptedConntection);





module.exports = router