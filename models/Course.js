const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CourseSchema = new Schema({
  teacherId: String,
  students: [String],
  info: {
    subject: String,
    description: String,
    price: mongoose.Types.Decimal128
  },
  classes: [
    {
      classId: {
        type: mongoose.Types.ObjectId,
        auto: true,
        unique: true
      },
      classDate: Date,
      classHour: String,
      classParticipants: [String],
      classNotes: String
    }
  ]
});

module.exports = mongoose.model("Course", CourseSchema);
