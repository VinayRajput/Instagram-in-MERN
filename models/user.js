const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types
const userSchema = new mongoose.Schema({
   name: {
      type: String,
      required: true
   },
   email: {
      type: String,
      required: true
   },
   password: {
      type: String,
      required: true
   },
   resetToken: String,
   expireToken: Date,
   activated:{
      type:Boolean,
      default:false
   },
   userPic: {
      type: String,
      default: "https://res.cloudinary.com/vinkrins/image/upload/v1592908335/userpic_cv5vng.png"
   },
   followers: [{ type: ObjectId, ref: "User" }],
   following: [{ type: ObjectId, ref: "User" }]
}, { timestamps: true })

mongoose.model("User", userSchema); 