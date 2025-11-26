const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_key_change_me";
const JWT_EXPIRES_IN = "1h";

// POST /api/v1/user/signup
exports.signup = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: false, errors: errors.array() });
    }

    const { username, email, password } = req.body;

    const existingUser = await User.findOne({
      $or: [{ username }, { email }]
    });

    if (existingUser) {
      return res.status(409).json({
        status: false,
        message: "Username or email already exists"
      });
    }

    const user = new User({ username, email, password });
    await user.save();

    return res
      .status(201)
      .json({ message: "Signup successful. You can now log in." });
  } catch (err) {
    console.error("Signup error:", err.message);
    return res
      .status(500)
      .json({ status: false, message: "Internal server error" });
  }
};

// POST /api/v1/user/login
// body: { email OR username OR identifier, password }
exports.login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: false, errors: errors.array() });
    }

    const { email, username, identifier, password } = req.body;
    const loginId = email || username || identifier;

    const user = await User.findOne({
      $or: [{ email: loginId }, { username: loginId }]
    }).select("+password");

    if (!user) {
      return res
        .status(401)
        .json({ status: false, message: "Invalid username or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ status: false, message: "Invalid username or password" });
    }

    const payload = {
      userId: user._id.toString(),
      username: user.username,
      email: user.email
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    return res.status(200).json({
      message: "Login successful.",
      token,
      user: {
        userId: user._id.toString(),
        username: user.username,
        email: user.email
      }
    });
  } catch (err) {
    console.error("Login error:", err.message);
    return res
      .status(500)
      .json({ status: false, message: "Internal server error" });
  }
};