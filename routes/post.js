const express = require("express");
const Router = express.Router();
const mongoose = require("mongoose");
const Post = mongoose.model("Post");
const authenticateUser = require("../middleware/authenticateUser");

Router.get("/allPosts", authenticateUser, (req, res) => {
   Post.find()
      .populate("postedBy", "_id name email")
      .populate("comments.postedBy", "_id name")
      .sort("-createdAt")
      .then(results => {
         res.json({ posts: results });
      })
      .catch(err => {
         console.log(err);
      })
})
   
Router.get("/getSubsribedPosts", authenticateUser, (req, res) => {
   Post.find({ postedBy: { $in: req.user.following } })
      .populate("postedBy", "_id name email")
      .populate("comments.postedBy", "_id name")
      .sort("-createdAt")
      .then(results => {
         res.json({ posts: results });
      })
      .catch(err => {
         console.log(err);
      })
})

Router.get("/myPosts", authenticateUser, (req, res) => {
   Post.find({ postedBy: req.user._id })
      .populate("postedBy", "_id name email")
      .populate("comments.postedBy", "_id name")
      .sort("-createdAt")
      .then(results => {
         res.json({ myPosts: results });
      })
      .catch(err => {
         console.log(err);
      })
})

Router.post("/createPost", authenticateUser, (req, res) => {
   const { title, body, pic } = req.body;
   if (!title || !body || !pic) {
      return res.status(422).json({ error: "Please add all the fields for the post" });
   }
   const post = new Post({
      title,
      body,
      photo: pic,
      postedBy: req.user
   })
   post.save()
      .then(result => {
         res.json(result)
      })
      .catch(err => {
         console.log(err);
         res.status(500).json({ error: "Some error occured, Please try again", err: err });
      })
})

Router.put("/toggleLike", authenticateUser, (req, res) => {
   Post.findOneAndUpdate(
      { _id: req.body.postId },
      { $pull: { likes: req.user._id } },
      { 'new': true }
   )
      .populate("postedBy", "_id name email")
      .exec((err, post) => {
         if (err)
            return res.json({ error: err });

         if (req.body.like === true) {
            if (!post.likes.includes(req.user._id))
               post.likes.push(req.user._id);
         }
         ``
         post.save((err) => {
            if (err)
               return res.json({ error: err });

            return res.json(post);
         });
      })
});

Router.delete("/delete/:postId", authenticateUser, (req, res) => {
   Post.findOne({ _id: req.params.postId })
      .populate("postedBy", "_id name")
      .exec((err, post) => {
         if (err || !post) {
            res.status(422).json({ error: err });
         }
         console.log(post);
         if (post.postedBy._id.toString() === req.user._id.toString()) {
            post.remove()
               .then(result => {
                  res.json({ "status": "success", "message": "Successfully deleted" });
               })
               .catch(e => {
                  console.log(e);
               })
         }
      })
})

Router.put("/comment", authenticateUser, (req, res) => {
   const comment = {
      text: req.body.text,
      postedBy: req.user._id

   };

   Post.findByIdAndUpdate(req.body.postId, {
      $push: { comments: comment }
   }, {
      new: true
   })
      .populate("comments.postedBy", "_id name")
      .populate("postedBy", "_id name email")
      .exec((err, result) => {
         if (err) {
            return res.status(422).json({ error: err })
         }
         //console.log(result);
         result.comments.reverse();
         return res.json(result);
      });
});

module.exports = Router;
