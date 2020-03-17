const express = require("express");
const User = require("../models/Users");
const router = express.Router();
const auth = require("../Middleware/Auth");

router.post("/user", async (req, res) => {
  try {
    const user = new User({
      ...req.body
    });
    const nuser = await user.save();
    const token = await user.generateAuthToken();
    if (!nuser) {
      res.status(401).send();
    }
    res.status(201).send({ user: nuser, token });
  } catch (err) {
    res.status(500).send(err);
  }
});

router.post("/user/login", async (req, res) => {
  try {
    const user = await User.findUserByCredentials(
      req.body.UserName,
      req.body.Password
    );
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (err) {
    res.status(500).send(err);
  }
});




module.exports = router;
