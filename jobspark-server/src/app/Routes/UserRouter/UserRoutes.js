const express = require("express");
const { createUser, patchUser, findUserByEmail, userProfileFromModel } = require("../../Controller/UserController/UserController");
const { getProfileInfo, updateProfile } = require("../../Controller/UserController/UserProfileController");
const { getAllUsers } = require("../../Controller/UserController/AllUsersController");

const router = express.Router();


router.post("/user", createUser);
router.patch("/u", patchUser);
router.patch("/user/update", userProfileFromModel);
router.get("/user", findUserByEmail);

router.get("/user/:id", getProfileInfo);
router.get("/all-user/:userId", getAllUsers);
router.patch("/user/job-seeker/:jobSeekerId/update-profile", updateProfile);

module.exports = router;