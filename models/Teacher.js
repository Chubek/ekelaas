const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TeacherSchema = new Schema({
  user_id: {
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
      student_id: String,
      notes: String,
      overall_score: Number
    }
  ],
  courses_id: [String],
  quizzes_id: [String]
});

module.exports = mongoose.model("Teacher", TeacherSchema);
