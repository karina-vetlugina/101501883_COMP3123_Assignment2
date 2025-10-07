const mongoose = require("mongoose");

let cached = global.__mongooseConn;
if (!cached) {
  cached = global.__mongooseConn = { conn: null, promise: null };
}

async function connectDB() {
  const uri =
    process.env.MONGO_URI ||
    "mongodb://127.0.0.1:27017/comp3123_assigment1";

  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  if (!cached.promise) {
    console.log(`Connecting to MongoDB at ${uri} ...`);
    mongoose.set("strictQuery", true);

    cached.promise = mongoose
      .connect(uri, { serverSelectionTimeoutMS: 5000 })
      .then((m) => {
        console.log(
          `MongoDB connected: ${m.connection.host}/${m.connection.name}`
        );
        m.connection.on("error", (err) => {
          console.error("Mongo connection error:", err?.message || err);
        });
        return m;
      })
      .catch((err) => {
        console.error("MongoDB connection failed:", err?.message || err);
        cached.promise = null;
        throw err;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

module.exports = connectDB;