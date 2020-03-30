require("dotenv").config({ path: __dirname + "/.env" });
const SchoolSchema = require("../models/School");
const TeacherSchema = require("../models/Teacher");
const UserSchema = require("../models/User");
const CourseSchema = require("../models/Course");
const StudentSchema = require("../models/Student");
const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const schoolAuth = require("../middleware/school");

const SALT_ROUNDS = 12;

router.post("/register", (req, res) => {
  const { idName, mobileNumber, email, password } = req.body;
  const { name, grade, landlineNumber, address } = req.body.info;
  console.log(req.body);
  if (!idName || !mobileNumber || !email || !password) {
    res.status(401).json({ message: "Data not entered." });
    return false;
  }

  SchoolSchema.findOne({
    idName: idName,
    mobileNumber: mobileNumber,
    email: email,
    password: password
  })
    .then(docSchool => {
      if (docSchool) {
        res.status(403).json({ message: "Already exists.", isSame: "school" });
        return false;
      }
    })
    .catch(e => {
      res.status(500).json({ error: e.message });
      console.log(e);
    });

  SchoolSchema.findOne({ idName: idName })
    .then(docSchool => {
      if (docSchool) {
        res.status(403).json({ message: "Already exists.", isSame: "idName" });
        return false;
      }
    })
    .catch(e => {
      res.status(500).json({ error: e.message });
      console.log(e);
    });

  SchoolSchema.findOne({ mobileNumber: mobileNumber })
    .then(docSchool => {
      if (docSchool) {
        res
          .status(403)
          .json({ message: "Already exists.", isSame: "mobileNumber" });
        return false;
      }
    })
    .catch(e => {
      res.status(500).json({ error: e.message });
      console.log(e);
    });

  SchoolSchema.findOne({ email: email })
    .then(docSchool => {
      if (docSchool) {
        res.status(403).json({ message: "Already exists.", isSame: "email" });
        return false;
      }
    })
    .catch(e => {
      res.status(500).json({ error: e.message });
      console.log(e);
    });

  bcrypt.hash(password, SALT_ROUNDS, (err, hash) => {
    if (err) throw err;

    const School = new SchoolSchema({
      idName: idName,
      mobileNumber: mobileNumber,
      email: email,
      password: hash,
      info: {
        name: name,
        grade: grade,
        landlineNumber: landlineNumber,
        address: address
      }
    });

    School.save()
      .then(docSchool => {
        jwt.sign(
          { id: docSchool._id },
          process.env.JWT_SECRET,
          (err, token) => {
            if (err) throw err;
            res.status(200).json({ schoolToken: token, docSchool });
          }
        );
      })
      .catch(e => {
        res.status(500).json({ error: e.message });
        console.log(e);
      });
  });
});

router.post("/auth", (req, res) => {
  const { idName, email, mobileNumber, password } = req.body;
  console.log(req.body);
  if (!password) {
    return false;
  }
  if (!idName && !email && !mobileNumber) {
    res.status(400).json({ message: "No data entered." });
    return false;
  }

  SchoolSchema.findOne({
    $or: [{ idName: idName }, { email: email }, { mobileNumber: mobileNumber }]
  })
    .then(docSchool => {
      console.log(docSchool);
      if (!docSchool) {
        res.status(404).json({ message: "No school." });
        console.log("No school.");
        return false;
      }

      bcrypt
        .compare(password, docSchool.password)
        .then(isMatch => {
          console.log(isMatch);
          if (!isMatch) {
            res.status(401).json({ message: "Passwords don't match." });
            return false;
          } else {
            jwt.sign(
              { id: docSchool._id },
              process.env.JWT_SECRET,
              (err, token) => {
                if (err) throw err;

                res.status(200).json({ token: token, docSchool });
              }
            );
          }
        })
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

router.post("/add/teacher", schoolAuth, (req, res) => {
  const schoolId = req.school.id;
  const teacherId = req.body.teacherId;

  if (!teacherId) {
    res.status(401).json({ message: "No data entered." });
  }

  TeacherSchema.findOneAndUpdate(
    { _id: teacherId },
    { $set: { schoolId: schoolId } },
    { new: true }
  )
    .then(docTeacher => {
      res.status(200).json({ docTeacher });
    })
    .then(e => {
      res.status(500).json({ error: e.message });
      console.log(e);
    });
});

router.put("/set/info", schoolAuth, (req, res) => {
  const schoolId = req.school.id;
  const { name, grade, landlineNumber, address } = req.body;

  SchoolSchema.findOneAndUpdate(
    { _id: schoolId },
    {
      $set: {
        "info.name": name,
        "info.grade": grade,
        "info.landlineNumber": landlineNumber,
        "info.address": address
      }
    },
    { new: true }
  )
    .then(docSchool => {
      res.status(200).json({ docSchool });
    })
    .catch(e => {
      res.status(500).json({ error: e.message });
      console.log(e);
    });
});

router.post("/add/course", schoolAuth, (req, res) => {
  const schoolId = req.school.id;
  const courseId = req.body.courseId;

  if (!courseId) {
    res.status(401).json({ message: "No data entered." });
  }

  CourseSchema.findOneAndUpdate(
    { _id: courseId },
    { $set: { schoolId: schoolId } },
    { new: true }
  )
    .then(docCourse => {
      res.status(200).json({ docCourse });
    })
    .then(e => {
      res.status(500).json({ error: e.message });
      console.log(e);
    });
});

router.post("/auth/on/create", (req, res) => {
  const schoolId = jwt.verify(req.body.jwt, process.env.JWT_SECRET).id;

  SchoolSchema.findOne({ _id: schoolId })
    .then(docSchool => res.status(200).json({ docSchool }))
    .catch(e => {
      res.status(500).json({ e });
      console.log(e);
    });
});

router.get("/all/students/:schoolId", (req, res) => {
  const schoolId = req.params.schoolId;

  StudentSchema.find({ schoolId: schoolId })
    .then(studentDocs => {
      let studentIds = [];
      studentDocs.forEach(studentDoc => {
        studentIds.push(studentDoc._id);
      });
      UserSchema.find({ "types.studentId": { $all: studentIds } })
        .then(userDocs => {
          res.status(200).json({ userDocs, studentDocs });
        })
        .catch(e => {
          res.status(200).json({ error: e.message });
          console.log(e);
        });
    })
    .catch(e => {
      res.status(500).json({ error: e.message });
      console.log(e);
    });
});

router.get("/all/courses/:schoolId", (req, res) => {
  const schoolId = req.params.schoolId;
  console.log(req.params);
  CourseSchema.find({ schoolId: schoolId })
    .then(courseDocs => {
      res.status(200).json({ courseDocs });
    })
    .catch(e => {
      res.status(500).json({ error: e.message });
      console.log(e);
    });
});

router.get("/all/teachers/:schoolId", (req, res) => {
  const schoolId = req.params.schoolId;

  TeacherSchema.find({ schoolId: schoolId })
    .then(teacherDocs => {
      let teacherIds = [];
      teacherDocs.forEach(teacherDoc => {
        teacherIds.push(teacherDoc._id);
      });
      UserSchema.find({ "types.teacherId": { $all: teacherIds } })
        .then(userDocs => {
          res.status(200).json({ userDocs, teacherDocs });
        })
        .catch(e => {
          res.status(200).json({ error: e.message });
          console.log(e);
        });
    })
    .catch(e => {
      res.status(500).json({ error: e.message });
      console.log(e);
    });
});

router.get("/single/:schoolId", (req, res) => {
  const schoolId = req.params.schoolId;

  SchoolSchema.findOne({ _id: schoolId })
    .then(docSchool => {
      res.status(200).json({ docSchool });
    })
    .catch(e => {
      res.status(500).json({ error: e.message });
      console.log(e);
    });
});

router.get("/all", (req, res) => {
  SchoolSchema.find()
    .then(docSchools => res.status(200).json({ docSchools }))
    .catch(e => {
      res.status(500).json({ error: e.message });
      console.log(e);
    });
});

router.delete("/delete/student/:studentId", schoolAuth, (req, res) => {
  const schoolId = req.school.id;
  const studentId = req.params.schoolId;

  StudentSchema.findOneAndDelete({ _id: studentId, schoolId: schoolId })
    .then(() => {
      UserSchema.findOneAndDelete({ "types.studentId": studentId })
        .then(() => res.status(204).json({ message: "Student deleted." }))
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

router.delete("/delete/teacher/:teacherId", schoolAuth, (req, res) => {
  const schoolId = req.school.id;
  const teacherId = req.params.schoolId;

  TeacherSchema.findOneAndDelete({ _id: teacherId, schoolId: schoolId })
    .then(() => {
      UserSchema.findOneAndDelete({ "types.teacherId": teacherId })
        .then(() => res.status(204).json({ message: "Teacher deleted." }))
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

router.delete("/delete/course/:courseId", schoolAuth, (req, res) => {
  const schoolId = req.school.id;
  const courseId = req.params.schoolId;

  CourseSchema.findOneAndDelete({ _id: courseId, schoolId: schoolId })
    .then(() => res.status(204).json({ message: "Course deleted." }))
    .catch(e => {
      res.status(500).json({ error: e.message });
      console.log(e);
    });
});

router.get("/decode", schoolAuth, (req, res) => {
  const schoolId = req.school.id;

  res.status(200).json({ schoolId });
});

module.exports = router;
