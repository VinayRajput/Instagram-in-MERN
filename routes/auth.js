const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const bcrypt = require("bcrypt");
const emailPassErrMsg = "Invalid Email or Password entered";
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/keys");
const requiredLogin = require("../middleware/authenticateUser");

router.post("/authenticateUser", requiredLogin, (req, res) => {
   console.log(req);
   res.send("hello user");
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
                  const token = jwt.sign({ _id: user._id }, JWT_SECRET);
                  const { id, email, name, following, followers, userPic} = user;
                  res.json({ token, user: { id, email, name, following, followers, userPic } });
               }
               else
                  res.json({ error: "Invalid email or password" })
            })
      })
})

router.post("/signup", (req, res) => {
   const { name, email, password, userPic } = req.body;
   //console.log("request body:", req);
   if (!email || !password || !name) {
      return res.status(422).json({ "error": "Please enter all fields." })
   }
   User.findOne({ email: email })
      .then((savedUser) => {
         if (savedUser) {
            return res.status(422).json({ error: `User already existed with email id ${email}` });
         }
         bcrypt.hash(password, 12)
               .then((hashedPassword) => {
               const user = new User({
                  email,
                  password: hashedPassword,
                  name
               })
               
               user.userPic = userPic;
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