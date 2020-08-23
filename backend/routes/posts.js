const express = require('express');

const checkAuth = require('../middleware/check-auth');
const extractFile = require('../middleware/image');

const PostController = require('../controllers/posts');

const router = express.Router();

// Create New Post
router.post("", checkAuth, extractFile, PostController.createPost);

// Get All Posts
router.get("", PostController.getPosts);

// Get all Posts by user id
router.get("/profile/:id", PostController.getPostsById);

// Get Post by Id
router.get("/:id", PostController.getPostById);

// Update Post by Id
router.put("/:id", checkAuth, extractFile, PostController.updatePost);

// Delete Post by Id
router.delete("/:id", checkAuth, PostController.deletePost);

// Comment on a post
router.post("/comment/:id", checkAuth, PostController.commentPost);

module.exports = router;