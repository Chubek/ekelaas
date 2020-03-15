require("dotenv").config({ path: __dirname + "/.env" });
const UserSchema = require("../models/User");
const router = require("express").Router();
const _ = require("lodash");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
const moment = require("moment");

const SALT_ROUNDS = 12;

router.post("/register", (req, res) => {
  const { displayName, email, phoneNumber, password } = req.body;

  if (!displayName || !phoneNumber || !password) {
    res
      .status(403)
      .json({ message: "Please fill in the required information." });
    console.log("Info not entered.");
    return false;
  }

  UserSchema.findOne({
    display_name: displayName,
    email: email,
    phonenumber: phoneNumber
  }).then(doc => {
    if (doc) {
      console.log("doc", doc);
      res.status(401).json({ message: "Already exists." });
      console.log("Data exists.");
      return false;
    }
  });

  bcrypt.hash(password, SALT_ROUNDS, (err, hash) => {
    if (err) throw err;

    const User = new UserSchema({
      display_name: displayName,
      email: email,
      phonenumber: phoneNumber,
      password: hash
    });

    User.save()
      .then(doc => {
        jwt.sign(
          {
            id: doc._id,
            displayName: doc.display_name
          },
          process.env.JWT_SECRET,
          (err, token) => {
            if (err) throw err;

            res.status(200).json({ token: token, doc });
          }
        );
      })
      .catch(e => {
        res.status(500).json({ error: e.message });
        console.log(e);
      });
  });
});

router.post("/verify/:activation", (req, res) => {
  //TODO
});

router.post("/auth", (req, res) => {
  const { displayName, email, phoneNumber, password } = req.body;

  if (!password) {
    res.status(401).json({ message: "Please enter password." });
    return false;
  }
  if (!displayName || !email || !phoneNumber) {
    res.status(403).json({ message: "No data entered." });
    return false;
  }
  /*
  let input = null;
  if (!displayName && !email && phoneNumber) {
    input = phoneNumber;
  } else if (!displayName && email && !phoneNumber) {
    input = email;
  } else if (displayName && !email && !phoneNumber) {
    input = displayName;
  } else if (!displayName || !email || !phoneNumber) {
    res.status(403).json({ message: "No data entered." });
    return false;
  } else if (displayName && email && phoneNumber) {
    input = phoneNumber;
  }*/

  UserSchema.findOne({
    $or: [
      { display_name: displayName },
      { email: email },
      { phonenumber: phoneNumber }
    ]
  })
    .then(docUser => {
      if (!docUser) {
        res.status(404).json({ message: "No user." });
        console.log("No user.");
        return false;
      }

      bcrypt
        .compare(password, docUser.password)
        .then(isMatch => {
          if (!isMatch) {
            res.status(407).json({ message: "Passwords don't match." });
            return false;
          } else {
            jwt.sign(
              { id: docUser._id, displayName: docUser.display_name },
              process.env.JWT_SECRET,
              (err, token) => {
                if (err) throw err;

                res.status(200).json({ token: token, docUser });
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

router.get("/all", (req, res) => {
  UserSchema.find()
    .then(docUsers => res.status(200).json({ docUsers }))
    .catch(e => {
      res.status(500).json({ error: e.message });
      console.log(e);
    });
});

router.get("/single/:userId", (req, res) => {
  const userId = req.params.userId;

  UserSchema.findOne({ _id: userId })
    .then(userDoc => res.status(200).json({ userDoc }))
    .catch(e => {
      res.status(500).json({ error: e.message });
      console.log(e);
    });
});

router.put("/set/info/", auth, (req, res) => {
  const { firstName, lastName, dateOfBirth, referralCode } = req.body;
  const userId = req.user.id;

  if (!firstName || !lastName || !dateOfBirth) {
    res.status(401).json({ message: "No data entered." });
    console.log("no data entered.");
    return false;
  }

  UserSchema.findOneAndUpdate(
    { _id: userId },
    {
      $set: {
        "info.first_name": firstName,
        "info.last_name": lastName,
        "info.date_of_birth": dateOfBirth,
        referralCode: referralCode
      }
    },
    { upsert: true }
  )
    .then(() => res.status(200).json({ message: "User updated." }))
    .catch(e => {
      res.status(500).json({ error: e.message });
      console.log(e);
    });
});

router.put("/set/connection/:userId", (req, res) => {
  const { adobeConnectId, ekigaId, vSeeId, OMId, mikogoId } = req.body;
  const userId = req.params.userId;

  UserSchema.findOneAndUpdate(
    { _id: userId },
    {
      $set: {
        "connections.adobe_connect_id": adobeConnectId,
        "connections.ekiga_id": ekigaId,
        "connections.vsee_id": vSeeId,
        "connections.open_meetings_id": OMId,
        "connections.mikogo_id": mikogoId
      }
    },
    { upsert: true }
  )
    .then(() => res.status(200).json({ message: "User updated." }))
    .catch(e => {
      res.status(500).json({ error: e.message });
      console.log(e);
    });
});

router.post("/auth/on/create", (req, res) => {
  const userId = jwt.verify(req.body.jwt, process.env.JWT_SECRET).id;

  UserSchema.findOne({ _id: userId })
    .then(doc => res.status(200).json({ doc }))
    .catch(e => {
      res.status(500).json({ e });
      console.log(e);
    });
});

module.exports = router;
