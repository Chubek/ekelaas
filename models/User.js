const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const moment = require("moment");

const UserSchema = new Schema({
  display_name: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String
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
  info: {
    first_name: String,
    last_name: String,
    date_of_birth: String
  },
  referralCode: String,
  connections: {
    adobe_connect_id: String,
    ekiga_id: String,
    vsee_id: String,
    open_meetings_id: String,
    mikogo_id: String
  },
  priviledges: {
    type: String,
    teacherId: String,
    admin_id: String,
    studentId: String
  }
});

module.exports = mongoose.model("User", UserSchema);
