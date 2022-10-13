const mongoose = require("mongoose");

// Creating a Schema for uploaded files
const fileSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    default: Date.now,
  },
  name: {
    type: String,
    required: [true, "Uploaded file must have a name"],
    index: true
  },
  file: {
    type: String,
    required: [true, "Uploaded file must required"],
  },
  pdfImage: {
    type: String,
    required: [true, "Uploaded file image must required"],
  },
   docType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'docType',
    required: [true, "Doc Type is required"],
  },
  courseType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'courseType',
    required: [true, "Course Type is required"],
  },
  university: {
    type: mongoose.Schema.Types.ObjectId,
     ref: 'university', 
    required: [true, "University  is required"],
  }
  ,uploadBy: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'user',
    required : true
  }
});

// Creating a Model from that Schema
module.exports = mongoose.model("file", fileSchema);
