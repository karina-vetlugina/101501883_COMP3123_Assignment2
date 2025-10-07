require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const userRoutes = require("./routes/auth.routes");
const employeeRoutes = require("./routes/employee.routes");

const app = express();

// middleware
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

// root route for deployed API homepage
app.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to COMP3123 Assignment 1 API",
    endpoints: [
      "/api/v1/health",
      "/api/v1/user/signup",
      "/api/v1/user/login",
      "/api/v1/emp/employees"
    ]
  });
});

// health check route
app.get("/api/v1/health", (_req, res) => {
  res.status(200).json({ status: "ok", service: "comp3123-assignment1" });
});

// main routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/emp", employeeRoutes);

module.exports = app;