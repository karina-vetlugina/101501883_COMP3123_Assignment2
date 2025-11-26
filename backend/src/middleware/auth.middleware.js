const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_key_change_me";

function authMiddleware(req, res, next) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ status: false, message: "Authorization token missing" });
  }

  const token = header.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    return next();
  } catch (err) {
    console.error("Auth middleware error:", err.message);
    return res
      .status(401)
      .json({ status: false, message: "Invalid or expired token" });
  }
}

module.exports = authMiddleware;