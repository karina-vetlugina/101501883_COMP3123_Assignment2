const path = require("path");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const userRoutes = require("./routes/auth.routes");
const employeeRoutes = require("./routes/employee.routes");

const app = express();

// middleware
app.use(express.json({ limit: "10mb" })); // base64 images in JSON
app.use(cors());
app.use(morgan("dev"));

// simple root
app.get("/", (_req, res) => {
  res.status(200).json({
    status: "ok",
    message: "COMP3123 Assignment 2 API",
    endpoints: [
      "/api/v1/health",
      "/api/v1/user/signup",
      "/api/v1/user/login",
      "/api/v1/emp/employees",
      "/api/v1/emp/employees/search"
    ]
  });
});

// health endpoint
app.get("/api/v1/health", (_req, res) => {
  res.status(200).json({ status: "ok", service: "comp3123-assignment2" });
});

// routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/emp", employeeRoutes);

module.exports = app;