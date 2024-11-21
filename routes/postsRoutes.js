const express = require("express");
const { auth } = require("../middleware/auth");
const {
  createPost,
  getPosts,
  getImages,
  getPostById,
  updatePost,
  deletePost,
  getPostsUser,
} = require("../controllers/postController");
const router = express.Router();

router.post("/create-post", auth, createPost);
router.get("/get-posts", getPosts);
router.post("/get-images", getImages);
router.get("/get-post/:id", getPostById);

// getting user posts
router.get("/get-posts-user", auth, getPostsUser);
//  route update post

router.put("/post/:id", auth, updatePost);

// route delete post
router.delete("/post/:id", auth, deletePost);

module.exports = router;
