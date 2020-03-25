require("dotenv").config({ path: __dirname + "/.env" });
const SchoolSchema = require("../models/School");
const TeacherSchema = require("../models/Teacher");
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

  if (!idName || !mobileNumber || !email || !password) {
    res.status(401).json({ message: "Data not entered." });
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

  if (!password) {
    return false;
  }
  if (!displayName || !email || !phoneNumber) {
    res.status(400).json({ message: "No data entered." });
    return false;
  }

  UserSchema.findOne({
    $or: [{ idName: idName }, { email: email }, { mobileNumber: mobileNumber }]
  })
    .then(docSchool => {
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

router.get("/all/students", schoolAuth, (req, res) => {
  const schoolId = req.school.id;

  StudentSchema.find({ schoolId: schoolId })
    .then(schoolDocs => {
      res.status(200).json({ schoolDocs });
    })
    .catch(e => {
      res.status(500).json({ error: e.message });
      console.log(e);
    });
});

router.get("/all/courses", schoolAuth, (req, res) => {
  const schoolId = req.school.id;

  CoursesSchema.find({ schoolId: schoolId })
    .then(courseDocs => {
      res.status(200).json({ courseDocs });
    })
    .catch(e => {
      res.status(500).json({ error: e.message });
      console.log(e);
    });
});

router.get("/all/teachers", schoolAuth, (req, res) => {
  const schoolId = req.school.id;

  TeacherSchema.find({ schoolId: schoolId })
    .then(teacherDocs => {
      res.status(200).json({ teacherDocs });
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

module.exports = router;
