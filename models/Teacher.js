const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TeacherSchema = new Schema({
  userId: {
    type: String,
    required: true,
    unique: true
  },
  info: {
    credits: [String],
    degrees: [String]
  },
  students: [
    {
      studentId: String,
      notes: String,
      overallScore: Number
    }
  ],
  coursesId: [String],
  quizzesId: [String]
});

module.exports = mongoose.model("Teacher", TeacherSchema);
