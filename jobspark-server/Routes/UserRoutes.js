const express = require("express");
const { createUser, patchUser, findUserByEmail } = require("../Controller/UserController");

const router = express.Router();


router.post("/user", createUser);
router.patch("/u", patchUser);
router.get("/user", findUserByEmail);

module.exports = router;