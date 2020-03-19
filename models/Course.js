const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CourseSchema = new Schema({
  teacherId: String,
  students: [String],
  info: {
    subject: String,
    description: String,
    price: {
      type: String,
      default: "0 IRR"
    }
  },
  connectURL: String,
  classes: [
    {
      classDate: Date,
      classHour: String,
      classParticipants: [String],
      classNotes: String
    }
  ]
});

module.exports = mongoose.model("Course", CourseSchema);
