const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const emailPassErrMsg = "Invalid Email or Password entered";
const jwt = require("jsonwebtoken");
const { SENDGRID_API, JWT_SECRET, BASE_URL,SERVER_PORT, TOKEN_EXPIRY_TIME, SERVER_EMAIL } = require("../config/keys");
const requiredLogin = require("../middleware/authenticateUser");

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(SENDGRID_API)
router.post("/authenticateUser", requiredLogin, (req, res) => {
   console.log(req);
   res.send("hello user");
})
router.post("/signin", (req, res) => {
   const { email, password } = req.body;
   console.log('req.body',req.body);
   if (!email || !password) {
      return res.status(422).json({ error: emailPassErrMsg })
   }
   User.findOne({ email: email }).
      then(user => {
          console.log('user',user);
         if (!user) {
            return res.status(422).json({ error: emailPassErrMsg });
         }

         if (!user.activated) {
            return res.status(422).json({ error: `Your email id ${user.email} is not confirmed, please confirm your email id` });
         }
       bcrypt.hash(password, 12)
           .then((hashedPassword) => {
                console.log(hashedPassword);
           });
         bcrypt.compare(password, user.password)
            .then(passwordMatched => {
               if (passwordMatched) {
                  const token = jwt.sign({ _id: user._id }, JWT_SECRET);
                  const { id, email, name, following, followers, userPic } = user;
                  const sessionExpiryTime = Date(Date.now() + TOKEN_EXPIRY_TIME)
                  res.json({ token, user: { id, email, name, following, followers, userPic } });

                  console.log(sessionExpiryTime)

                  user.resetToken = token;
                  user.expireToken = sessionExpiryTime

                  return user.save()
               }
               else
                  res.json({ error: "Invalid email or password" })
            })
            .then(response => {
                console.log('Send mail skipped  /commented due to sendgrid issue')
                /*sgMail.send({
                  to: user.email,
                  from: SERVER_EMAIL,
                  subject: "An-Instagram: A signin detected",
                  text:"An-Instagram: A signin detected",
                  html: `<p>Recently a new signin detected at An-instagram website with your credentials, if this wasn't you, please <a href="${BASE_URL}/resetPassword/${user.resetToken}">click here to reset your password</a>
                  </p>`
               })*/
            }).catch( e=> {
                console.log(e)
                //res.status(422).json({error: `Some error occurred ${e}`})
             })
      })
})
router.post("/signup", (req, res) => {
   const { name, email, password, userPic } = req.body;
   if (!email || !password || !name) {
      return res.status(422).json({ "message": "Please enter all fields." })
   }
   User.findOne({ email: email })
      .then((savedUser) => {
         if (savedUser) {
            return res.status(422).json({ message: `User already existed with email id ${email}` });
         }
         bcrypt.hash(password, 12)
            .then((hashedPassword) => {
               crypto.randomBytes(32, (err, buffer) => {
                  if (err) console.log(err)
                  const token = buffer.toString("hex");
                  const user = new User({
                     email,
                     password: hashedPassword,
                     name,
                     resetToken : token
                  })

                  user.userPic = userPic;
                  user?.save()
                     .then((user) => {
                         sgMail.send({
                             subject: "An-Instagram: Welcome to An Instagram clone",
                             from: SERVER_EMAIL,
                             html: `<h1> Welcome to An Instagram clone</h1>
                                    <a href="${BASE_URL}/confirmEmail/${token}">Click here to confirm your email id</a>`,
                             to: email,
                             text:"An-Instagram: Welcome to An Instagram clone -- text",
                             "reply-to": "vinkrins@gmail.com"
                         }).then((result) => {
                           res.json({ message: "Thanks for signing up, we sent you an email, please confirm your email", sendMailResult: result })
                        })

                     }).catch( e=> {
res.status(422).json({error: `Some error occurred ${e.message}`})
// Added a detail to the error response by including the message property of the error object
                  });
               });
            });
      }).catch( e=> res.status(422).json({ error: `Some error occurred ${e}`}));
})
router.post("/changePassword", (req, res) => {
   const { token, password } = req.body
   User.findOne({ resetToken: token, expireToken: { $gt: Date.now() } })
      .select("-password")
      .then(user => {
         if (!user) {
            return res.status(422).json({ "error": "invalid" })
         }

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

                            sgMail.send({
                              text:".",
                              to: user.email,
                              from: SERVER_EMAIL,
                              "reply-to": "no-reply@an-instagram-clone.com",
                              subject: "An-Instagram: You have successfully changed your password changed",
                              html: `<h2> You have successfully changed your password changed </h2>
                           <p>if you have not changed your password, please <a href="${BASE_URL}/resetPassword/${token}">click here to change your password</a></p>
                           `
                           }).then((result) => {
                              return res.json({ message: "Succesfully changed password", status: "success", sendMailResult: result })
                           }).catch( e=> res.status(422).json({ error: `Some error occurred ${e}`}));
                        })

                     }).catch( e=> res.status(422).json({ error: `Some error occurred ${e}`}));
               });
         }
      })
   if (req.body.password === "") {
      return res.status(422).json({ message: "Please enter a password to change." })
   }
})
router.post("/emailConfirmation", (req, res) => {
   const { token } = req.body
   User.findOne({ resetToken: token })
      .select("-password")
      .then(user => {
         if (!user) {
            return res.status(422).json({ "error": "invalid" })
         }
         user.resetToken = undefined;
         user.expireToken = undefined;
         user.activated = true;
         user.save()
            .then((user) => {
                sgMail.send({
                  text:".",
                  to: user.email,
                  from: SERVER_EMAIL,
                  "reply-to": "no-reply@an-instagram-clone.com",
                  subject: "An-Instagram: Thanks for confirming your email id ",
                  html: `<h2> You have successfully confirmed your email id </h2>`
               }).then((result) => {
                  return res.json({ message: "Succesfully confirmed your email id", status: "success", sendMailResult: result })
               }).catch(e => {
                  console.log(err);
               })

            }).catch(err => {
               console.log(err);
            });
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
               return res.json({ error: `No user found with email ${req.body.email}` })
            }
            user.resetToken = token;
            user.expireToken = Date.now() + TOKEN_EXPIRY_TIME
            user.save()
               .then(response => {
                   sgMail.send({
                    to: user.email,
                    from: SERVER_EMAIL,
                    subject: "An-Instagram: Password reset request - An Instagram Clone",
                    text:".",
                    html: `<p>You have requested a password reset, 
                    <a href="${BASE_URL}/resetPassword/${token}">click here to reset your password</a>
                    If you have not requested password reset, please ignore this mail.
                    </p>`
                  }).then(result => {
                       console.log(`${BASE_URL}:${SERVER_PORT}/resetPassword/${token}`)
                       res.json({ "message": `Check your mail, we have sent an email to ${user.email}` })
                  }).catch(error => {
                       res.json({ "error": `Error occurred: ${error},  please try again later` });
                   })

               });
         })
   })
})



module.exports = router;