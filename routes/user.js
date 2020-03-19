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
    displayName: displayName,
    email: email,
    phoneNumber: phoneNumber
  })
    .then(docUser => {
      if (docUser) {
        console.log("docUser", docUser);
        res.status(401).json({ message: "Already exists.", isSame: "user" });
        console.log("Data exists.");
        return false;
      }
    })
    .catch(e => {
      res.status(500).json({ error: e });
      console.log(e);
    });

  UserSchema.findOne({ phoneNumber: phoneNumber })
    .then(docUser => {
      if (docUser) {
        res.status(401).json({ isSame: "phoneNumber" });
      }
    })
    .catch(e => {
      res.status(500).json({ error: e });
      console.log(e);
    });

  UserSchema.findOne({ displayName: displayName })
    .then(docUser => {
      if (docUser) {
        res.status(401).json({ isSame: "displayName" });
      }
    })
    .catch(e => {
      res.status(500).json({ error: e });
      console.log(e);
    });

  UserSchema.findOne({ email: email })
    .then(docUser => {
      if (docUser) {
        res.status(401).json({ isSame: "email" });
      }
    })
    .catch(e => {
      res.status(500).json({ error: e });
      console.log(e);
    });

  bcrypt.hash(password, SALT_ROUNDS, (err, hash) => {
    if (err) throw err;

    const User = new UserSchema({
      displayName: displayName,
      email: email,
      phoneNumber: phoneNumber,
      password: hash
    });

    User.save()
      .then(docUser => {
        jwt.sign(
          {
            id: docUser._id,
            displayName: docUser.displayName
          },
          process.env.JWT_SECRET,
          (err, token) => {
            if (err) throw err;

            res.status(200).json({ token: token, docUser });
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
    return false;
  }
  if (!displayName || !email || !phoneNumber) {
    res.status(400).json({ message: "No data entered." });
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
      { displayName: displayName },
      { email: email },
      { phoneNumber: phoneNumber }
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
          console.log(isMatch);
          if (!isMatch) {
            res.status(401).json({ message: "Passwords don't match." });
            return false;
          } else {
            jwt.sign(
              { id: docUser._id, displayName: docUser.displayName },
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
    .then(userDoc => {
      console.log("userDoc", userDoc);
      res.status(200).json({ userDoc });
    })
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
        "info.firstName": firstName,
        "info.lastName": lastName,
        "info.dateOfBirth": dateOfBirth,
        referralCode: referralCode,
        justCreated: false
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
    .then(docUser => res.status(200).json({ docUser }))
    .catch(e => {
      res.status(500).json({ e });
      console.log(e);
    });
});

module.exports = router;
