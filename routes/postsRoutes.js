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
  commentPost,
  likePost,
} = require("../controllers/postController");
const router = express.Router();

router.post("/create-post", auth, createPost);
router.get("/get-posts", getPosts);
router.post("/get-images", getImages);
router.get("/get-images", getImages);
router.get("/get-post/:id", getPostById);

// getting user posts
router.get("/get-posts-user", auth, getPostsUser);
//  route update post

router.put("/update-post/:id", auth, updatePost);

// route delete post
router.delete("/post/:id", auth, deletePost);


// Route pour liker un post
router.post("/like-post/:id", auth, likePost);

// Route pour commenter un post
router.post("/comment-post/:postId", auth, commentPost);

module.exports = router;
