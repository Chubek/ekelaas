const UserSchema = require("../models/User");
const StudentSchema = require("../models/Student");
const router = require("express").Router();
const auth = require("../middleware/auth");

router.post("/setup", auth, (req, res) => {
  const userId = req.user.id;
  const { grade, province, city, school } = req.body;

  if (!grade || !province || !city || !school) {
    res.status(401).json({ message: "No data entered." });
    console.log("No data entered.");
    return false;
  }

  const Student = new StudentSchema({
    userId: userId,
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
          "priviledges.studentid": studentDoc._id
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
    { _id: studentId, userId: userId },
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

router.put("/set/favorite/courses/:studentid", auth, (req, res) => {
  const userId = req.user.id;
  const studentId = req.params.studentid;
  const favoriteCourses = req.body.favoriteCourses;

  StudentSchema.findOneAndUpdate(
    { _id: studentId, userId: userId },
    {
      $addToSet: {
        favoriteCourses: favoriteCourses
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

router.put("/set/favorite/teachers/:studentid", auth, (req, res) => {
  const userId = req.user.id;
  const studentId = req.params.studentid;
  const favoriteTeachers = req.body.favoriteTeachers;

  StudentSchema.findOneAndUpdate(
    { _id: studentId, userId: userId },
    {
      $addToSet: {
        favoriteTeachers: favoriteTeachers
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

router.put("/set/taken/courses/:studentid", auth, (req, res) => {
  const userId = req.user.id;
  const studentId = req.params.studentid;
  const takenCourses = req.body.takenCourses;

  StudentSchema.findOneAndUpdate(
    { _id: studentId, userId: userId },
    {
      $addToSet: {
        taken_courses: takenCourses
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

router.put("/set/engaged/teachers/:studentid", auth, (req, res) => {
  const userId = req.user.id;
  const studentId = req.params.studentid;
  const engagedTeachers = req.body.engagedTeachers;

  StudentSchema.findOneAndUpdate(
    { _id: studentId, userId: userId },
    {
      $addToSet: {
        engaged_teachers: engagedTeachers
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

router.get("/all", (req, res) => {
  StudentSchema.find()
    .then(docStudents => res.status(200).json({ docStudents }))
    .catch(e => {
      res.status(500).json({ error: e.message });
      console.log(e);
    });
});

router.get("/single/:studentid", (req, res) => {
  const studentId = req.params.studentid;

  StudentSchema.findOne({ _id: studentId })
    .then(studentDoc => res.status(200).json({ studentDoc }))
    .catch(e => {
      res.status(500).json({ error: e.message });
      console.log(e);
    });
});

router.get("/multiple", (req, res) => {
  const studentIds = req.query.students;

  StudentSchema.find({ _id: { $all: studentIds } })
    .then(studentDocs => res.status(200).json({ studentDocs }))
    .catch(e => {
      res.status(500).json({ error: e.message });
      console.log(e);
    });
});

module.exports = router;
