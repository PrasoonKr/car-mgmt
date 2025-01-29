const mongoose = require("mongoose");

const carSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  images: {
    type: [String], // Array of URLs or paths to the images
    required: true,
    validate: {
      validator: function (arr) {
        return arr.length <= 10; // Maximum 10 images allowed
      },
      message: "Cannot upload more than 10 images",
    },
  },
  tags: [
    {
      type: String,
      trim: true,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt timestamp before saving
carSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Car = mongoose.model("Car", carSchema);

module.exports = Car;
