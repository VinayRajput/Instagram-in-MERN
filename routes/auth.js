const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const emailPassErrMsg = "Invalid Email or Password entered";
const jwt = require("jsonwebtoken");
const { SENDGRID_API, JWT_SECRET, BASE_URL, TOKEN_EXPIRY_TIME, SERVER_EMAIL } = require("../config/keys");
const requiredLogin = require("../middleware/authenticateUser");
const nodemailer = require("nodemailer")
const sendGridTransport = require("nodemailer-sendgrid-transport");
const transporter = nodemailer.createTransport(sendGridTransport({
   auth: {
      api_key: SENDGRID_API
   }
}))

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
                  const { id, email, name, following, followers, userPic } = user;
                  res.json({ token, user: { id, email, name, following, followers, userPic } });

                  user.resetToken = token;
                  user.expireToken = Date.now() + TOKEN_EXPIRY_TIME
                  user.save()
                     .then(response => {
                        transporter.sendMail({
                           to: user.email,
                           from: SERVER_EMAIL,
                           subject: "An-Instagram: A signin detected",
                           html: `<p>Recently a new signin detected at An-instagram website with your credentials, if this wasn't you, please <a href="${BASE_URL}/resetPassword/${token}">click here to reset your password</a>
                           </p>`
                        })
                     })
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
                     transporter.sendMail({
                        to: email,
                        from: SERVER_EMAIL,
                        "reply-to": "no-reply@an-instagram-clone.com",
                        subject: "An-Instagram: Welcome to An Instagram clone",
                        html: "<h1> Welcome to An Instagram clone</h1>"
                     }).then((result) => {
                        res.json({ message: "saved successfully", sendMailResult: result })
                     })

                  }).catch(err => {
                     console.log(err);
                  });
            });

      }).catch(err => {
         console.log(err);
      })
})
router.post("/changePassword", (req, res) => {
   const { token, password } = req.body
   User.findOne({ resetToken: token, expireToken: { $gt: Date.now() } })
      .select("-password")
      .then(user => {
         if (!user) {
            return res.status(422).json({ "error": "invalid" })
         }

         console.log(user);
         if (user.expireToken < Date.now() + TOKEN_EXPIRY_TIME) {
            bcrypt.hash(password, 12)
               .then((hashedPassword) => {
                  user.password = hashedPassword;
                  user.resetToken = undefined;
                  user.expireToken = undefined;
                  user.save()
                     .then((user) => {
                        crypto.randomBytes(32, (err, buffer) => {
                           if (err) console.log(err)
                           const token = buffer.toString("hex");
                           user.resetToken = token;
                           user.expireToken = Date.now() + TOKEN_EXPIRY_TIME
                           user.save();

                           transporter.sendMail({
                              to: user.email,
                              from: SERVER_EMAIL,
                              "reply-to": "no-reply@an-instagram-clone.com",
                              subject: "An-Instagram: You have successfully changed your password changed",
                              html: `<h2> You have successfully changed your password changed </h2>
                           <p>if you have not changed your password, please <a href="${BASE_URL}/resetPassword/${token}">click here to change your password</a></p>
                           `
                           }).then((result) => {
                              return res.json({ message: "Succesfully changed password", status: "success", sendMailResult: result })
                           }).catch(e => {
                              console.log(err);
                           })
                        })

                     }).catch(err => {
                        console.log(err);
                     });
               });
         }
      })
   if (req.body.password === "") {
      return res.status(422).json({ message: "Please enter a password to change." })
   }
})
router.post("/resetPassword", (req, res) => {
   crypto.randomBytes(32, (err, buffer) => {
      if (err) console.log(err)
      const token = buffer.toString("hex");
      User.findOne({ email: req.body.email })
         .select("-password")
         .then(user => {
            if (!user) {
               return res.status(422).json({ error: `No user found with email ${req.body.email}` })
            }
            user.resetToken = token;
            user.expireToken = Date.now() + TOKEN_EXPIRY_TIME
            user.save()
               .then(response => {
                  transporter.sendMail({
                     to: user.email,
                     from: SERVER_EMAIL,
                     subject: "An-Instagram: Password reset request - An Instagram Clone",
                     html: `<p>You have requested a password reset, 
                        <a href="${BASE_URL}/resetPassword/${token}">click here to reset your password</a>
                        If you have not requested password reset, please ignore this mail.
                        </p>`
                  })
                  res.json({ "message": `Check your mail, we have sent an email to ${user.email}` })
               });
         })
   })
})

module.exports = router;