

const express = require("express");
const { createPost, getPosts, getImages,  getPostById } = require("../controllers/postController");
const router = express.Router()

router.post("/create-post", createPost)
router.get("/get-posts", getPosts)
router.post("/get-images", getImages)
router.get('/get-post/:id',getPostById );

module.exports = router;