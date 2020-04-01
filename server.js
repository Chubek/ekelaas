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

app.use("/img", express.static(path.join(__dirname, "dist/img")));
app.use("/css", express.static(path.join(__dirname, "dist/css")));
app.use("/js", express.static(path.join(__dirname, "dist/js")));
app.use("/fonts", express.static(path.join(__dirname, "dist/fonts")));
app.use("/public", express.static(path.join(__dirname, "dist/public")));

app.use("/user", require("./routes/user"));
app.use("/student", require("./routes/student"));
app.use("/teacher", require("./routes/teacher"));
app.use("/course", require("./routes/course"));
app.use("/school", require("./routes/school"));

/*app.get("/", function(req, res) {
  res.sendFile("index.html", { root: path.join(__dirname, "dist") });
});*/

const port = process.env.PORT || 5000;

app.listen(port, () =>
  console.log(`Server started on port ${port}`.blue.inverse)
);
