const mongoose = require("mongoose");
require("dotenv").config();
// MongoDB connection
const connection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1); // Exit process with failure
  }
};
module.exports = connection;
