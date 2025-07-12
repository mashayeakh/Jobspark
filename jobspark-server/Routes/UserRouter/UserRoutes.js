const express = require("express");
const { createUser, patchUser, findUserByEmail, userProfileFromModel } = require("../../Controller/UserController/UserController");
const { getProfileInfo } = require("../../Controller/UserController/UserProfileController");
const { getAllUsers } = require("../../Controller/UserController/AllUsersController");

const router = express.Router();


router.post("/user", createUser);
router.patch("/u", patchUser);
router.patch("/user/update", userProfileFromModel);
router.get("/user", findUserByEmail);

router.get("/user/:id", getProfileInfo);
router.get("/all-user/:userId", getAllUsers);

module.exports = router;