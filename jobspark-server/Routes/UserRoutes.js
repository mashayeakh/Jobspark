const express = require("express");
const { createUser } = require("../Controller/UserController");

const router = express.Router();


router.post("/user", createUser);

module.exports = router;