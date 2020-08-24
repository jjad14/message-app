const express = require('express');

const checkAuth = require('../middleware/check-auth');
const ThreadController = require('../controllers/thread');

const router = express.Router();

// Create New Comment
router.post("/:id", checkAuth, ThreadController.createComment);

// Get Comments of a Post
router.get("/:id", ThreadController.getComments);

// Edit Comment of a Post
// router.get("/:id", checkAuth, ThreadController.getComments);

// Delete Comment of a Post
// router.delete("/:id", checkAuth, ThreadController.deleteComment);

module.exports = router;
