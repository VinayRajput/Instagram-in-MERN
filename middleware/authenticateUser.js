const jwt = require("jsonwebtoken");
const {JWT_SECRET} = require("../keys");
const loginErrMsg = {"error":"You must be logged in."}
const mongoose = require("mongoose");
const User = mongoose.model("User")

module.exports = (req,res,next)=>{
   const {authorization} = req.headers
   if(!authorization){
      return res.status(422).json(loginErrMsg)
   }
   const token = authorization.replace("Bearer ","")
   jwt.verify(token, JWT_SECRET, (err,payload)=>{
      if(err){
         return res.status(422).json(loginErrMsg)
      }
      const {_id} = payload
      User.findById(_id)
      .then(userdatta=>{
         req.user = userdata
      })
      next();
   })
}