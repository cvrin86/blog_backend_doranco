const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/userModel");

// Create an user

router.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;

  const passwordHash = await bcrypt.hash(password, 10);

  const newUser = new User({
    username,
    email,
    password: passwordHash,
  });

  try {
    await newUser.save();
    res.json("Signup successful");
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;
