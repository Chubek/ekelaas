const UserSchema = require("../models/User");
const CourseSchema = require("../models/Course");
const StudentSchema = require("../models/Student");
const TeacherSchema = require("../models/Teacher");
const router = require("express").Router();
const auth = require("../middleware/auth");

router.post("/setup", auth, (req, res) => {
  const userId = req.user.id;
  const { subject, description, price } = req.body;

  if (!subject || !description || !price) {
    res.status(401).json({ message: "no data entered" });
    console.log("no data enetered.");
    return false;
  }

  TeacherSchema.findOne({ user_id: userId }).then(teacherDoc => {
    const Course = new CourseSchema({
      teacher_id: teacherDoc._id,
      "info.subject": subject,
      "info.description": description,
      "info.price": price.toString()
    });

    Course.save().then(courseDoc => {
      TeacherSchema.findOneAndUpdate(
        { _id: teacherDoc._id },
        {
          $addToSet: {
            courses_id: courseDoc._id
          }
        },
        { upsert: true }
      )
        .then(() => res.status(200).json({ courseDoc }))
        .catch(e => {
          res.status(500).json({ error: e.message });
          console.log(e);
        });
    });
  });
});

router.put("/set/info/:courseid", auth, (req, res) => {
  const userId = req.user.id;
  const courseId = req.params.courseid;
  const { subject, description, price } = req.body;

  CourseSchema.findOneAndUpdate(
    { _id: courseId, teacher_id: userId },
    {
      $set: {
        "info.subject": subject,
        "info.description": description,
        "info.price": price.toString()
      }
    },
    { upsert: true }
  )
    .then(courseDoc => res.status(200).json({ courseDoc }))
    .catch(e => {
      res.status(500).json({ error: e.message });
      console.log(e);
    });
});

router.put("/add/student/:courseid", auth, (req, res) => {
  const userId = req.user.id;
  const courseId = req.params.courseid;
  const studentId = req.body.studentId;

  CourseSchema.findOneAndUpdate(
    { _id: courseId, teacher_id: userId },
    {
      $addToSet: {
        students: { studentId }
      }
    },
    { upsert: true }
  )
    .then(courseDoc => res.status(200).json({ courseDoc }))
    .catch(e => {
      res.status(500).json({ error: e.message });
      console.log(e);
    });
});

router.put("/add/class/:courseid", auth, (req, res) => {
  const userId = req.user.id;
  const courseId = req.params.courseid;
  const { classDate, classHour, classParticipants, classNotes } = req.body;

  CourseSchema.findOneAndUpdate(
    { _id: courseId, teacher_id: userId },
    {
      $set: {
        "classes.$.class_date": classDate,
        "classes.$.class_hour": classHour,
        "classes.$.class_participants": classParticipants,
        "classes.$.class_notes": classNotes
      }
    },
    { upsert: true, new: true }
  )
    .then(courseDoc => res.status(200).json({ courseDoc }))
    .catch(e => {
      res.status(500).json({ error: e.message });
      console.log(e);
    });
});

router.put("/set/class/:classid", auth, (req, res) => {
  const userId = req.user.id;
  const classId = req.params.classid;
  const { classDate, classHour, classParticipants, classNotes } = req.body;

  CourseSchema.findOneAndUpdate(
    { "classes.$.class_id": classId, teacher_id: userId },
    {
      $set: {
        "classes.$.class_date": classDate,
        "classes.$.class_hour": classHour,
        "classes.$.class_participants": classParticipants,
        "classes.$.class_notes": classNotes
      }
    },
    { upsert: true, new: true }
  )
    .then(courseDoc => res.status(200).json({ courseDoc }))
    .catch(e => {
      res.status(500).json({ error: e.message });
      console.log(e);
    });
});

router.get("/all/:limit", (req, res) => {
  const limit = parseInt(req.params.limit);
  CourseSchema.find()
    .limit(limit)
    .then(docCourses => res.status(200).json({ docCourses }))
    .catch(e => {
      res.status(500).json({ error: e.message });
      console.log(e);
    });
});

router.get("/single/:courseid", (req, res) => {
  const courseId = req.params.courseid;

  CourseSchema.findOne({ _id: courseId })
    .then(courseDoc => res.status(200).json({ courseDoc }))
    .catch(e => {
      res.status(500).json({ error: e.message });
      console.log(e);
    });
});

router.get("/multiple", (req, res) => {
  const courseIds = req.query.courses;

  CourseSchema.find({ _id: { $all: courseIds } })
    .then(courseDocs => res.status(200).json({ courseDocs }))
    .catch(e => {
      res.status(500).json({ error: e.message });
      console.log(e);
    });
});

module.exports = router;
