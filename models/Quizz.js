const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const QuizzSchema = new Schema({
  teacher_id: {
    type: String,
    required: true,
    unique: true
  },
  info: {
    title: String,
    summary: String,
    creation_date: String
  },
  qa: [
    {
      question: {
        text: String,
        photo: String
      },
      answers: [String],
      right_option: Number
    }
  ]
});

module.exports = mongoose.model("Quizz", QuizzSchema);
