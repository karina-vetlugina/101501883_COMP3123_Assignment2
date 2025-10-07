require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const userRoutes = require("./routes/auth.routes");
const employeeRoutes = require("./routes/employee.routes");

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

app.get("/api/v1/health", (_req, res) => {
  res.status(200).json({ status: "ok", service: "comp3123-assignment1" });
});

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/emp", employeeRoutes);

module.exports = app;