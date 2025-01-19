const express = require("express");
const Router = express.Router();
const mongoose = require("mongoose");
const Post = mongoose.model("Post");
const User = mongoose.model("User");
const authenticateUser = require("../middleware/authenticateUser");

Router.get("/user/:id", (req, res) => {
  User.findOne({ _id: req.params.id })
    .select("-password")
    .then(user => {
      Post.find({ postedBy: req.params.id })
        .populate("postedBy", "_id name")
        .exec()
        .then((response) => {
          return res.json({ user, posts:response})
        })
    })
    .catch(e => {
      return res.status(404).json({ error: e.toString() });
    })
})

Router.post("/updatePicUrl", (req, res) => {
  User.findByIdAndUpdate(req.body.id, {
    userPic: req.body.userPic
  }, {
    new: true
  }).then(result => {
    res.json({ message: "User Photo Updated successfully" })
  }).catch(e => {
    console.log(e);
  })
})
Router.put("/follow", authenticateUser, (req, res) => {
  const {body: {data:{followId,follow:followStatus}}} = req
  const updateFollowingStatus = (followStatus)=> {
    if (followStatus === true) {
      return User.findByIdAndUpdate(
          followId,
          {$push: {followers: req.user._id}},
          {new: true}
      )
    } else {
      return User.findByIdAndUpdate(
          followId,
          {$pull: {followers: req.user._id}},
          {new: true}
      )
    }
  }
  updateFollowingStatus(followStatus).select("-password")
  .then((followedUser) => {
    User.findByIdAndUpdate(req.user._id, {
      $push: { following: followId }
    }, { new: true })
        .select("-password")
        .then(loggedInUser => {
          return res.json({ followedUser, loggedInUser })
        })
  }).catch(err=>{
    return res.status(422).json({ error: err });
  })
})
Router.post("/searchUser", (req, res) => {
  let userPattern = RegExp(`^${req.body.keyword}`);
  User.find({ email: { $regex: userPattern } })
    .select("_id email name")
    .then(response => {
      return res.json({ response })
    }).catch(e => {
      console.log(e);
    })
})

module.exports = Router;