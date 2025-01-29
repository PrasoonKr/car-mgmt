const mongoose = require("mongoose");
const Car = require("./models/carSchema");
const sampleCars = require("./sampleCarData");
require("dotenv").config();
// MongoDB connection URI - adjust this to your database URL
const MONGODB_URI = process.env.MONGO_URI;

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    // Clear existing data
    await Car.deleteMany({});
    console.log("Cleared existing cars");

    // Insert the sample data
    const result = await Car.insertMany(sampleCars);
    console.log(`Successfully inserted ${result.length} cars`);
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log("Database connection closed");
  }
}

seedDatabase();
