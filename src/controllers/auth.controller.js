const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

// POST /api/v1/user/signup
exports.signup = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ status: false, errors: errors.array() });

    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser)
      return res.status(409).json({ status: false, message: "Username or email already exists" });

    const newUser = await User.create({ username, email, password });

    return res.status(201).json({
      message: "User created successfully.",
      user_id: newUser._id.toString(),
    });
  } catch (err) {
    console.error("Signup error:", err.message);
    return res.status(500).json({ status: false, message: "Internal server error" });
  }
};

// POST /api/v1/user/login
exports.login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ status: false, errors: errors.array() });

    const { email, username, identifier, password } = req.body;
    const loginId = email || username || identifier;

    const user = await User.findOne({ $or: [{ email: loginId }, { username: loginId }] }).select("+password");
    if (!user) {
      return res.status(401).json({ status: false, message: "Invalid Username and password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ status: false, message: "Invalid Username and password" });

    return res.status(200).json({ message: "Login successful." });
  } catch (err) {
    console.error("Login error:", err.message);
    return res.status(500).json({ status: false, message: "Internal server error" });
  }
};