const jwt = require("jsonwebtoken");
require("dotenv").config();

function school(req, res, next) {
  const token = req.header("x-auth-token-school");

  if (!token)
    return res.status(401).json({ message: "No token, access denied." });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.school = decoded;
    next();
  } catch {
    res.status(400).json({ message: "Token is not valid" });
  }
}

module.exports = school;
