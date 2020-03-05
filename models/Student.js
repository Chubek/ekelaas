const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const StudentSchema = new Schema({
  user_id: {
    type: String,
    required: true,
    unique: true
  },
  info: {
    grade: String,
    province: String,
    city: String,
    school: String
  },
  favorite_courses: [String],
  taken_courses_id: [String],
  favorite_teachers: [String],
  engaged_teachers_id: [String],
  taken_quizzes: [
    {
      quizz_id: String,
      taken_date: Date,
      final_score: mongoose.Types.Decimal128
    }
  ]
});
