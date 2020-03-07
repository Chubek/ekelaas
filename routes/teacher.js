const UserSchema = require("../models/User");
const TeacherSchema = require("../models/Teacher");
const router = require("express").Router();
const auth = require("../middleware/auth");

router.post("/setup", auth, (req, res) => {
  const userId = req.user.id;
  const { credits, degrees } = req.body;

  const Teacher = new Teacher({
    user_id: userId,
    "info.credits": credits,
    "info.degrees": degrees
  });

  Teacher.save().then(teacherDoc => {
    UserSchema.findOneAndUpdate(
      { _id: userId },
      {
        $set: {
          "priviledges.type": "Teacher",
          "priviledges.teacher_id": teacherDoc._id
        }
      },
      { upsert: true }
    )
      .then(() => res.status(200).json({ teacherDoc }))
      .catch(e => {
        res.status(500).json({ error: e.message });
        console.log(e);
      });
  });
});

router.put("/set/info/:teacherid", auth, (req, res) => {
  const userId = req.user.id;
  const teacherId = req.params.teacherid;
  const { credits, degrees } = req.body;

  TeacherSchema.findOneAndUpdate(
    { _id: teacherId, user_id: userId },
    {
      $set: {
        "info.credits": credits,
        "info.degrees": degrees
      }
    },
    { upsert: true }
  )
    .then(teacherDoc => res.status(200).json({ teacherDoc }))
    .catch(e => {
      res.status(500).json({ message: e.message });
      console.log(e);
    });
});

router.put("/set/student/:teacherid", auth, (req, res) => {
  const userId = req.user.id;
  const teacherId = req.params.teacherId;
  const { studentId, notes, score } = req.body;

  TeacherSchema.findOneAndUpdate(
    { _id: teacherId, user_id: userId, "students.student_id": studentId },
    {
      $set: {
        "students.notes": notes,
        "students.overall_score": score
      }
    },
    { upsert: true }
  )
    .then(studentDoc =>
      res.status(200).json({ studentDoc: studentDoc.students })
    )
    .catch(e => {
      res.status(500).json({ error: e.message });
      console.log(e);
    });
});

