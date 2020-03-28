const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SchoolSchema = new Schema({
  idName: {
    type: String,
    unique: true,
    required: true
  },
  mobileNumber: {
    type: String,
    unique: true,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  info: {
    name: String,
    grade: String,
    landlineNumber: String,
    address: String
  },
  studentsId: [String],
  teachersId: [String],
  coursesId: [String]
});

module.exports = mongoose.model("School", SchoolSchema);
