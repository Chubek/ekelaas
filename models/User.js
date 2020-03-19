const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const moment = require("moment");

const UserSchema = new Schema({
  displayName: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  verified: Boolean,
  justCreated: {
    type: Boolean,
    default: true
  },
  info: {
    firstName: String,
    lastName: String,
    dateOfBirth: String
  },
  referralCode: String,
  types: {
    type: {
      type: String,
      default: "Not Set"
    },
    teacherId: {
      type: String,
      default: "None"
    },
    studentId: {
      type: String,
      default: "None"
    }
  }
});

module.exports = mongoose.model("User", UserSchema);
