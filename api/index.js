const serverless = require("serverless-http");
const app = require("../src/app");
const connectDB = require("../src/config/db");

// ensure MongoDB connects once
let dbReady = null;
async function ensureDB() {
  if (!dbReady) {
    dbReady = connectDB().catch((err) => {
      dbReady = null; // reset on failure so next request retries
      throw err;
    });
  }
  return dbReady;
}

module.exports = async (req, res) => {
  await ensureDB();
  const handler = serverless(app);
  return handler(req, res);
};