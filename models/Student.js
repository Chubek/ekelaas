const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const StudentSchema = new Schema({
  userId: {
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
  favoriteCourses: [String],
  takenCoursesId: [String],
  favoriteTeachers: [String],
  engagedTeachersId: [String],
  takenQuizzes: [
    {
      quizzId: String,
      takenDate: Date,
      finalScore: mongoose.Types.Decimal128
    }
  ]
});

module.exports = mongoose.model("Student", StudentSchema);
