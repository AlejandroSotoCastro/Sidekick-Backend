const express = require("express");
const User = require("../models/user"); // new
const router = express.Router();

// Get all posts
router.get("/users", async (req, res) => {
  const users = await User.find();
  res.send(users);
});

router.post("/user", async (req, res) => {
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });
  await user.save();
  res.send(user);
});

module.exports = router;
