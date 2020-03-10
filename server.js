require("dotenv").config({ path: __dirname + "/.env" });
const mongoose = require("mongoose");
const express = require("express");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const path = require("path");
const colors = require("colors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  fileUpload({
    createParentPath: true
  })
);

const db = mongoose
  .connect(
    "mongodb://" +
      process.env.DB_HOST +
      ":" +
      process.env.DB_PORT +
      "/" +
      process.env.DB_NAME,
    { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }
  )
  .then(() => console.log("MongoDB Connected".green.inverse))
  .catch(e => console.log(`${e}`.underline.red));
mongoose.set("useFindAndModify", false);

app.use("/img", express.static(path.join(__dirname, "public/image")));
app.use("/aud", express.static(path.join(__dirname, "public/audio")));
app.use("/vid", express.static(path.join(__dirname, "public/vid")));

global.IMG_DIR = path.resolve(path.join(__dirname, "public/image"));
global.AUD_DIR = path.resolve(path.join(__dirname, "public/audio"));
global.VID_DIR = path.resolve(path.join(__dirname, "public/video"));

app.use("/user", require("./routes/user"));
app.use("/student", require("./routes/student"));
app.use("/teacher", require("./routes/teacher"));
app.use("/course", require("./routes/course"));

const port = process.env.PORT || 5000;

app.listen(port, () =>
  console.log(`Server started on port ${port}`.blue.inverse)
);
