const mongoose = require("mongoose");

// Creating a Schema for uploaded files
const ratingSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    default: Date.now,
  },
  like: {
    type: Boolean,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: [true, "User id is required"],
  },
   pdfId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'file',
    required: [true, "File id is required"],
  }
});

// Creating a Model from that Schema
module.exports = mongoose.model("rating", ratingSchema);
