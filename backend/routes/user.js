const express = require('express');

const checkAuth = require('../middleware/check-auth');

const UserController = require('../controllers/user');

const router = express.Router();

// Signup 
router.post("/signup", UserController.createUser);

// login
router.post("/login", UserController.userLogin);

// Update User by Id
router.put("/profile/:id", checkAuth, UserController.updateUser);

// Delete User and all their posts
router.delete("/:id", checkAuth, UserController.deleteUser);

// Get a single user
router.get("/profile/:id", checkAuth, UserController.getUser);

module.exports = router;