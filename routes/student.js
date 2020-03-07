const UserSchema = require("../models/User");
const StudentSchema = require("../models/Student");
const router = require("express").Router();
const auth = require("../middleware/auth");

router.post("/setup", auth, (req, res) => {
  const userId = req.user.id;
  const { grade, province, city, school } = req.body;

  const Student = new StudentSchema({
    user_id: userId,
    "info.grade": grade,
    "info.province": province,
    "info.city": city,
    "info.school": school
  });

  Student.save().then(studentDoc => {
    UserSchema.findOneAndUpdate(
      { _id: userId },
      {
        $set: {
          "priviledges.type": "Student",
          "priviledges.student_id": studentDoc._id
        }
      },
      { upsert: true }
    )
      .then(() => res.status(200).json({ studentDoc }))
      .catch(e => {
        res.status(500).json({ error: e.message });
        console.log(e);
      });
  });
});

router.put("/set/info/:studentid", auth, (req, res) => {
  const userId = req.user.id;
  const studentId = req.params.studentid;
  const { grade, province, city, school } = req.body;

  StudentSchema.findOneAndUpdate(
    { _id: studentId, user_id: userId },
    {
      $set: {
        "info.grade": grade,
        "info.province": province,
        "info.city": city,
        "info.school": school
      }
    },
    { upsert: true, new: true }
  )
    .then(studentDoc => res.status(200).json({ studentDoc }))
    .catch(e => {
      res.status(500).json({ error: e.message });
      console.log(e);
    });
});

module.exports = router;
