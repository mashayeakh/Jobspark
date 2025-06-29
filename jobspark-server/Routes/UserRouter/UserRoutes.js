const express = require("express");
const { createUser, patchUser, findUserByEmail, userProfileFromModel } = require("../../Controller/UserController/UserController");

const router = express.Router();


router.post("/user", createUser);
router.patch("/u", patchUser);
router.patch("/user/update", userProfileFromModel);
router.get("/user", findUserByEmail);

module.exports = router;