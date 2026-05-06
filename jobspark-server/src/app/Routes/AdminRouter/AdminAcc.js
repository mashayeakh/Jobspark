const express = require("express");
const { createAdmin } = require("../../Controller/AdminController/AdminAcc/CreateAdmin");
const { loginAdmin } = require("../../Controller/AdminController/AdminAcc/LoginAdmin");
const router = express.Router();

router.post("/create", createAdmin);
router.post("/login", loginAdmin);


module.exports = router;