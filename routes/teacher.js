const UserSchema = require("../models/User");
const TeacherSchema = require("../models/Teacher");
const router = require("express").Router();
const auth = require("../middleware/auth");

router.post("/setup", auth, (req, res) => {
  const userId = req.user.id;
  const { credits, degrees } = req.body;
  if (!credits || credits.length == 0 || !degrees || degrees.length == 0) {
    res.status(401).json({ message: "No data entered." });
    console.log("No data entered.");
    return false;
  }
  const Teacher = new TeacherSchema({
    userId: userId,
    "info.credits": credits,
    "info.degrees": degrees
  });

  Teacher.save().then(teacherDoc => {
    UserSchema.findOneAndUpdate(
      { _id: userId },
      {
        $set: {
          "types.type": "Teacher",
          "types.teacherId": teacherDoc._id
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
    { _id: teacherId, userId: userId },
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
    { _id: teacherId, userId: userId, "students.studentId": studentId },
    {
      $set: {
        "students.notes": notes,
        "students.overallScore": score
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

router.put("/set/courses/:teacherid", auth, (req, res) => {
  const userId = req.user.id;
  const teacherId = req.params.teacherid;
  const { coursesId } = req.body.coursesId;

  TeacherSchema.findOneAndUpdate(
    { _id: teacherId, userId: userId },
    {
      $addToSet: {
        coursesId: { $each: coursesId }
      }
    },
    { upsert: true, new: true }
  )
    .then(teacherDoc => res.status(200).json({ teacherDoc }))
    .catch(e => console.log(e));
});

router.get("/all", (req, res) => {
  TeacherSchema.find()
    .then(docTeachers => res.status(200).json({ docTeachers }))
    .catch(e => {
      res.status(500).json({ error: e.message });
      console.log(e);
    });
});

router.get("/single/:teacherid", (req, res) => {
  const teacherId = req.params.teacherid;

  TeacherSchema.findOne({ _id: teacherId })
    .then(teacherDoc => res.status(200).json({ teacherDoc }))
    .catch(e => {
      res.status(500).json({ error: e.message });
      console.log(e);
    });
});

router.get("/multiple/get", (req, res) => {
  const teacherIds = req.query.teachers;

  TeacherSchema.find({ _id: { $all: teacherIds } })
    .then(teacherDocs => res.status(200).json({ teacherDocs }))
    .catch(e => {
      res.status(500).json({ error: e.message });
      console.log(e);
    });
});

module.exports = router;
