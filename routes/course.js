const UserSchema = require("../models/User");
const CourseSchema = require("../models/Course");
const StudentSchema = require("../models/Student");
const TeacherSchema = require("../models/Teacher");
const SchoolSchema = require("../models/School");
const router = require("express").Router();
const auth = require("../middleware/auth");

router.post("/setup", auth, (req, res) => {
  const userId = req.user.id;
  const {
    subject,
    description,
    price,
    connectURL,
    school,
    schoolId
  } = req.body;
  console.log(req.body);
  if (!subject || !description || !connectURL || !school || !schoolId) {
    res.status(401).json({ message: "no data entered" });
    console.log("no data enetered.");
    return false;
  }

  TeacherSchema.findOne({ userId: userId }).then(teacherDoc => {
    const Course = new CourseSchema({
      teacherId: teacherDoc._id,
      schoolId: schoolId,
      connectURL: connectURL,
      "info.school": school,
      "info.subject": subject,
      "info.description": description,
      "info.price": price.toString()
    });

    Course.save().then(courseDoc => {
      TeacherSchema.findOneAndUpdate(
        { _id: teacherDoc._id },
        {
          $addToSet: {
            coursesId: courseDoc._id
          }
        },
        { upsert: true }
      )
        .then(() => {
          SchoolSchema.findOneAndUpdate(
            { _id: schoolId },
            {
              $addToSet: {
                coursesId: courseDoc._id
              }
            }
          )
            .then(() => res.status(200).json({ courseDoc }))
            .catch(e => {
              res.status(500).json({ error: e.message });
              console.log(e);
            });
        })
        .catch(e => {
          res.status(500).json({ error: e.message });
          console.log(e);
        });
    });
  });
});

router.put("/set/info/:courseid", auth, (req, res) => {
  const courseId = req.params.courseid;
  const {
    subject,
    description,
    price,
    connectURL,
    school,
    schoolId
  } = req.body;

  CourseSchema.findOneAndUpdate(
    { _id: courseId },
    {
      $set: {
        connectURL: connectURL,
        schoolId: schoolId,
        "info.school": school,
        "info.subject": subject,
        "info.description": description,
        "info.price": price.toString()
      }
    },
    { upsert: true }
  )
    .then(courseDoc => {
      SchoolSchema.findOneAndUpdate(
        { _id: schoolId },
        {
          $addToSet: {
            coursesId: courseDoc._id
          }
        }
      )
        .then(() => res.status(200).json({ courseDoc }))
        .catch(e => {
          res.status(500).json({ error: e.message });
          console.log(e);
        });
    })
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
    { _id: courseId, teacherId: userId },
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
  const courseId = req.params.courseid;
  const { classDate, classHour, classParticipants, classNotes } = req.body;
  console.log(courseId);
  if (!classDate || !classHour) {
    res.status(401).json({ message: "Data not entered." });
    console.log("Data not entered.");
    return false;
  }

  CourseSchema.findOneAndUpdate(
    { _id: courseId },
    {
      $push: {
        classes: {
          classDate: classDate,
          classHour: classHour,
          classParticipants: classParticipants,
          classNotes: classNotes
        }
      }
    },
    { new: true }
  )
    .then(courseDoc =>
      res.status(200).json({ message: "Class added.", courseDoc })
    )
    .catch(e => {
      res.status(500).json({ error: e.message });
      console.log(e);
    });
});

router.put("/set/class/:courseId/:classIndex", auth, (req, res) => {
  const classIndex = req.params.classIndex;
  const courseId = req.params.courseId;
  const { classDate, classHour, classParticipants, classNotes } = req.body;
  if (!classDate || !classHour) {
    res.status(401).json({ message: "Data not sent." });
    console.log("Data not sent.");
    return false;
  }
  CourseSchema.findOneAndUpdate(
    { _id: courseId, classes: classes[classIndex] },
    {
      $set: {
        "classes.$.classDate": classDate,
        "classes.$.classHour": classHour,
        "classes.$.classParticipants": classParticipants,
        "classes.$.classNotes": classNotes
      }
    },
    { new: true }
  )
    .then(courseDoc => res.status(200).json({ courseDoc }))
    .catch(e => {
      res.status(500).json({ error: e.message });
      console.log(e);
    });
});

router.put("/remove/class/:courseId/:classIndex", (req, res) => {
  const classIndex = req.params.classIndex;
  const courseId = req.params.courseId;
  console.log(classIndex);
  CourseSchema.findOne({ _id: courseId }).then(courseDoc => {
    CourseSchema.findOneAndUpdate(
      { _id: courseId },
      {
        $pull: {
          classes: courseDoc.classes[classIndex]
        }
      },
      { new: true }
    )
      .then(courseDoc => res.status(200).json({ courseDoc }))
      .catch(e => {
        res.status(500).json({ error: e.message });
        console.log(e);
      });
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
  console.log("courseID", courseId);
  CourseSchema.findOne({ _id: courseId })
    .then(courseDoc => res.status(200).json({ courseDoc }))
    .catch(e => {
      res.status(500).json({ error: e.message });
      console.log(e);
    });
});

router.get("/multiple/get", (req, res) => {
  let courseIds = req.query.courses;
  console.log("courses", courseIds);
  if (courseIds.split(",").length > 0) {
    courseIds = courseIds.split(",");
  } else {
    courseIds = [courseIds];
  }
  CourseSchema.find({ _id: { $all: courseIds } })
    .then(courseDocs => res.status(200).json({ courseDocs }))
    .catch(e => {
      res.status(500).json({ error: e.message });
      console.log(e);
    });
});

module.exports = router;
