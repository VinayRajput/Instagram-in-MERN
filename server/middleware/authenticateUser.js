const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/keys");
const loginErrMsg = { "error": "You must be logged in." }
const mongoose = require("mongoose");
const User = mongoose.model("User")

module.exports = (req, res, next) => {
   // console.log('authenticateUser',req.body)
   const { authorization } = req.headers
   if (!authorization) {
      return res.status(422).json(loginErrMsg)
   }
   const token = authorization.replace("Bearer ", "")
   jwt.verify(token, JWT_SECRET, (err, payload) => {
      if (err) {
         return res.status(422).json(loginErrMsg)
      }
      const { _id } = payload
      User.findById(_id)
         .then(userdata => {
            // console.log('authenticateUser',userdata);
            req.user = userdata
            next();
         })

   })
}