const express = require("express");
const { body } = require("express-validator");
const { signup, login } = require("../controllers/auth.controller");

const router = express.Router();

/**
 * POST /api/v1/user/signup
 */
router.post(
  "/signup",
  [
    body("username")
      .isString()
      .trim()
      .isLength({ min: 3, max: 50 })
      .withMessage("Username must be between 3 and 50 characters"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("password")
      .isString()
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long")
  ],
  signup
);

/**
 * POST /api/v1/user/login
 * body: { email OR username OR identifier, password }
 */
router.post(
  "/login",
  [
    body("password").isString().notEmpty().withMessage("Password is required"),
    body().custom((b) => {
      if (!b.email && !b.username && !b.identifier) {
        throw new Error("Provide 'email' or 'username'.");
      }
      return true;
    })
  ],
  login
);

module.exports = router;