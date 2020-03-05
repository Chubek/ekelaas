const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CourseSchema = new Schema({
  teachers_id: {
    type: [String]
  },
  students: [String],
  info: {
    subject: String,
    description: String,
    price: mongoose.Types.Decimal128
  },
  classes: [
    {
      class_id: {
        type: mongoose.Types.ObjectId,
        auto: true,
        unique: true
      },
      class_date: Date,
      class_hour: String,
      class_participants: [String],
      class_notes: String
    }
  ]
});
