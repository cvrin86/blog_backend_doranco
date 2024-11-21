const express = require("express");
const { auth } = require("../middleware/auth");
const {
  createUser,
  loginUser,
  logoutUser,
} = require("../controllers/userController");

const router = express.Router();

router.post("/signup", createUser);
router.post("/signin", loginUser);
router.post("/logout", logoutUser);

module.exports = router;
