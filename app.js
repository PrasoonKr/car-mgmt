const express = require("express");
const app = express();
require("dotenv").config();
const cookieParser = require("cookie-parser");
const connection = require("./dbConfig");
const User = require("./models/userSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Car = require("./models/carSchema");
const cors = require("cors");
app.use(
  cors({
    origin: "http://localhost:5173", // Your React app's address
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  })
);
// Middleware to parse JSON bodies
app.use(express.json());
app.use(cookieParser());
connection();
// Authentication middleware
const authenticateToken = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "Access denied. Please login." });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.clearCookie("token");
    res.status(400).json({ message: "Invalid token" });
  }
};
// Basic route
app.get("/", authenticateToken, async (req, res) => {
  try {
    const userCars = await Car.find({ user: req.user.id });
    if (!userCars || userCars.length === 0) {
      return res.status(404).json({ message: "No cars found" });
    }
    res.status(200).json(userCars);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching cars", error: error.message });
  }
});

// Get car details by ID
app.get("/api/cars/:id", authenticateToken, async (req, res) => {
  try {
    const car = await Car.findOne({ _id: req.params.id, user: req.user.id });

    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }

    res.status(200).json(car);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching car details", error: error.message });
  }
});

// POST endpoint to save car details
app.post("/api/cars", authenticateToken, async (req, res) => {
  try {
    //code here
    const { title, description, photoUrl, tags } = req.body;
    const newCar = new Car({
      title,
      description,
      images:[photoUrl],
      tags,
      user: req.user.id,
    });
    await newCar.save();
    res.status(201).json({ message: "Car saved successfully", carData: newCar });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error saving car details", error: error.message });
  }
});

// Update car details by ID
app.put("/api/cars/:id", authenticateToken, async (req, res) => {
  try {
    const car = await Car.findOne({ _id: req.params.id, user: req.user.id });

    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }

    const updatedCar = await Car.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      message: "Car updated successfully",
      car: updatedCar,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating car details",
      error: error.message,
    });
  }
});

// Delete car by ID
app.delete("/api/cars/:id", authenticateToken, async (req, res) => {
  try {
    const car = await Car.findOne({ _id: req.params.id, user: req.user.id });

    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }

    await Car.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Car deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting car",
      error: error.message,
    });
  }
});

// Register user
app.post("/api/signup", async (req, res) => {
  const { username, password, email } = req.body;

  if (!username || !password || !email) {
    return res
      .status(400)
      .json({ message: "Username, password and email are required." });
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists." });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists." });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      username,
      password: hashedPassword,
      email,
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error registering user.", error });
  }
});

// Login user
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password are required." });
  }

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // Set token in cookie
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 3600000, // 1 hour
    });
    const safeUserData = {
      _id: user._id,
      email: user.email,
      username: user.username, // Add any other fields except password
    };
    const cars = await Car.find({ user: user._id });
    if (!cars) {
      return res.status(401).json({ message: "Cars not found" });
    }
    res.status(200).json({
      message: "Login successful!",
      userData: safeUserData,
      carsData: cars,
    });
  } catch (error) {
    res.status(500).json({ message: "Error logging in.", error });
  }
});

// Logout user
app.post("/api/logout", (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out successfully" });
});

// Start the server
app.listen(process.env.PORT, () => {
  console.log(`Server is running on PORT ${process.env.PORT}`);
});
