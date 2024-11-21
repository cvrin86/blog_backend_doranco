const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const { checkBody } = require("../modules/checkBody");
const JWT_SECRET = process.env.JWT_SECRET;

// Create a user
exports.createUser = async (req, res) => {
  if (!checkBody(req.body, ["username", "email", "password"])) {
    return res.json({ result: false, error: "Missing or empty fields !" });
  }

  const { username, email, password } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({
      username: { $regex: new RegExp(username, "i") },
    });

    if (existingUser) {
      // User already exists
      return res.json({ result: false, error: "User already exists !" });
    }

    // Hash the password before saving
    const passwordHash = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      username,
      email,
      password: passwordHash,
    });

    // Save the user to the database
    const savedUser = await newUser.save();

    // Generate a JWT token
    const token = jwt.sign(
      { id: savedUser._id }, // Use _id from the saved user object
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    // Send the token in a cookie
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });

    // Respond with the user data and success result
    return res.json({ result: true, data: savedUser });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ result: false, error: "Server error" });
  }
};

// Route to sign in
exports.loginUser = async (req, res) => {
  if (!checkBody(req.body, ["username", "password"])) {
    return res.json({ result: false, error: "Missing or empty fields !" });
  }

  const { username, password } = req.body;

  try {
    // Find the user in the database by username (case-insensitive)
    const user = await User.findOne({
      username: { $regex: new RegExp(username, "i") },
    });

    if (user && (await bcrypt.compare(password, user.password))) {
      // If the user is found and the password matches
      const token = jwt.sign(
        { id: user._id }, // Use _id from the user document
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      );

      // Set the JWT token in the cookie
      res.cookie("jwt", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Secure cookies in production
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
      });

      // Respond with success and user data
      return res.json({ result: true, data: user });
    } else {
      // If no user found or password does not match
      return res.json({ result: false, error: "Invalid username or password" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ result: false, error: "Server error" });
  }
};

exports.logoutUser = (_, res) => {
  res.clearCookie("jwt");
  res.json({ result: true });
};
