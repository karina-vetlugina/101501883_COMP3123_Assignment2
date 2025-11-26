const mongoose = require("mongoose");

async function connectDB() {
  const uri =
    process.env.MONGO_URI ||
    "mongodb://127.0.0.1:27017/comp3123_assignment2";

  try {
    if (mongoose.connection.readyState === 1) {
      return mongoose.connection;
    }
    await mongoose.connect(uri);
    console.log("MongoDB connected");
    return mongoose.connection;
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    throw err;
  }
}

module.exports = connectDB;