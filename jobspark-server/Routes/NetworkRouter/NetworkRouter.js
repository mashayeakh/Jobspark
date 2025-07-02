const express = require("express");
const { getAIRecommendations } = require("../../Controller/NetworkController/NetworkController");
const router = express.Router();

router.post("/recommend-connections", getAIRecommendations);

module.exports = router