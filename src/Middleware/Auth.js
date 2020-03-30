const User = require("../models/Users");
const jwt = require("jsonwebtoken");

// hassansamee
const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);
    const user = await User.findOne({
      _id: decoded._id,
      "tokens.token": token
    });
    if (!user) {
      res.status(404).send();
    }
    req.user = user;
    req.token = token;
    next();
  } catch (err) {
    res.status(500).send(err);
  }
};

module.exports = auth;
