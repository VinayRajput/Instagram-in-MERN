const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const bcrypt = require("bcrypt");
const emailPassErrMsg = "Invalid Email or Password entered";
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../keys");
const requiredLogin = require("../middleware/authenticateUser");

router.get("/authenticateUser", requiredLogin, (req, res) => {
   res.send("hello user")
})
router.post("/signin", (req, res) => {
   const { email, password } = req.body;
   if (!email || !password) {
      return res.status(422).json({ error: emailPassErrMsg })
   }
   User.findOne({ email: email }).
      then(user => {
         if (!user) {
            return res.status(422).json({ error: emailPassErrMsg });
         }
         bcrypt.compare(password, user.password)
            .then(passwordMatched => {
               if (passwordMatched) {
                  const token = jwt.sign({ _id: user.save._id }, JWT_SECRET);
                  res.json({ token });
               }
               else
                  res.json({ error: "Invalid email or password" })
            })
      })
})

router.post("/signup", (req, res) => {
   const { name, email, password } = req.body;
   console.log("request body:", name, email, password);
   if (!email || !password || !name) {
      res.status(422).json({ "error": "Please enter all fields." })
   }
   User.findOne({ email: email, password: password })
      .then((savedUser) => {
         if (savedUser) {
            return res.status(422).json({ error: `User already existed with email id ${email}` });
         }
         bcrypt.hash(password, 12).
            then((hashedPassword) => {
               const user = new User({
                  email,
                  password: hashedPassword,
                  name
               })
               user.save()
                  .then((user) => {
                     res.json({ message: "saved successfully" })
                  }).catch(err => {
                     console.log(err);
                  });
            });

      }).catch(err => {
         console.log(err);
      })
})

module.exports = router;