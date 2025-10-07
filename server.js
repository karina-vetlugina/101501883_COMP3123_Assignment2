require("dotenv").config();
const express = require("express");
const app = require("./src/app");
const connectDB = require("./src/config/db");

const PORT = process.env.PORT || 3000;

// prevent server.listen on Vercel (handled by Vercel functions)
if (process.env.VERCEL) {
  module.exports = app;
} else {
  console.log("Starting API server...");
  connectDB()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
      });
    })
    .catch((err) => {
      console.error("Database connection failed:", err.message);
      process.exit(1);
    });
}