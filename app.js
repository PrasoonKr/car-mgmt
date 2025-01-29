const express = require("express");
const app = express();
require("dotenv").config();
const connection = require("./dbConfig");
const User = require("./models/userSchema");
const bcrypt = require("bcrypt");
const Car = require("./models/carSchema");
// Middleware to parse JSON bodies
app.use(express.json());
connection();
// Basic route
app.get("/", (req, res) => {
  res.send("Welcome to the Car Backend API");
});
// Get car details by ID
app.get("/api/cars/:id", async (req, res) => {
  try {
    const carId = req.params.id;
    const car = await Car.findById(carId);

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
app.post("/api/cars", async (req, res) => {
  try {
    const newCar = new Car(req.body);
    await newCar.save();
    res.status(201).json({ message: "Car saved successfully", car: newCar });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error saving car details", error: error.message });
  }
});

// Update car details by ID
app.put("/api/cars/:id", async (req, res) => {
  try {
    const carId = req.params.id;
    const updates = req.body;

    // Find car and update it with new data
    // {new: true} returns the updated document instead of the old one
    const updatedCar = await Car.findByIdAndUpdate(carId, updates, {
      new: true,
      runValidators: true,//validates the new data
    });

    if (!updatedCar) {
      return res.status(404).json({ message: "Car not found" });
    }

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

// Register user
app.post("/signup", async (req, res) => {
  const { username, password, email } = req.body;
  if (!username || !password || !email) {
    return res
      .status(400)
      .json({ message: "Username, password and email are required." });
  }

  try {
    //check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists." });
    }
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists." });
    }

    // Hash password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      password: hashedPassword,
      email,
    });
    //save user to database
    await newUser.save();
    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error registering user.", error });
  }
});

//login user
app.post("/login", async (req, res) => {
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

    res.status(200).json({ message: "Login successful!" });
  } catch (error) {
    res.status(500).json({ message: "Error logging in.", error });
  }
});
//route to get the dashboard for the user

// Start the server
app.listen(process.env.PORT, () => {
  console.log(`Server is running on PORT ${process.env.PORT}`);
});
