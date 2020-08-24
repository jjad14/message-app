const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

const User = require('../models/user');
const Post = require('../models/post');
const Comment = require('../models/comment');

// for environment variable access
dotenv.config();

// Create User
exports.createUser = (req, res, next)=> {

    // hash password
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            // create user with a hashed password
            const user = new User({
                username: req.body.username,
                email: req.body.email,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                gender: req.body.gender,
                password: hash
            });

            // save user into database
            user.save()
                .then(result => {
                    res.status(201).json({
                        message: 'User created',
                        result: result
                    });
                })
                .catch(err => {
                    res.status(500).json({
                        message: "Invalid authentication credentials!"
                    });
                });
        });
};

// Login User
exports.userLogin = (req, res, next) => {
    let fetchedUser;
    // find user by email address
    User.findOne({ email: req.body.email })
        .then(user => {
            // if user doesnt exist
            if (!user) {
                return res.status(401).json({
                    message: "Invalid authentication credentials!"
                });
            }
            // if user exists
            fetchedUser = user;
            // compare passwords of stored hash and login attempt password
            return bcrypt.compare(req.body.password, user.password);    
        })
        .then(result => {
            // if password doesnt match
            if (!result) {
                return res.status(401).json({
                    message: "Invalid authentication credentials!"
                });
            }

            // create a new token based on some input data of your choice.
            // second arg is the secret
            // third token is optional and allows me to configure that token (expire duration)
            const token = jwt.sign({
                username: fetchedUser.username,
                email: fetchedUser.email,
                userId: fetchedUser._id}, 
                process.env.JWT_KEY, 
                { expiresIn: "1h" }
            );
            
            // no need to return since its the last piece of code to run
            res.status(200).json({
                token: token,
                expiresIn: 3600,
                userId: fetchedUser._id,
                username: fetchedUser.username
            });

        })
        .catch(err => {
            res.status(401).json({
                message: "Invalid authentication credentials!"
            });
        });
};

// Update User
exports.updateUser = (req, res, next) => {
    User.updateOne({_id: req.params.id}, {
        $set: {
        username: req.body.username, 
        email: req.body.email,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        gender: req.body.gender
        }
    })
    .then(result => {
        if ( result.nModified > 0) {
            res.status(200).json({
                message: "Update Successful."
            });
        } else {
            res.status(401).json({
                message: "Update Failed! You are not authorized."
            });
        }
    })
    .catch(error => {
        res.status(500).json({
            message: "Updating user failed."
        });
    });
};

// Delete User, their posts and their comments
exports.deleteUser = (req, res, next) => {
    User.deleteOne({ _id: req.params.id })
    .then(result => {
        if(result.deletedCount > 0) {
            Post.deleteMany({creator: req.params.id})
                .then(result => {
                    if (result.ok == 1) {
                        Comment.deleteMany({ createdId: req.params.id })
                        .then(result => { 
                            if (result.ok == 1){
                                return res.status(200).json({
                                    message: "Deletion Successful."
                                });
                            }
                        })
                    }
                });
        } 
        res.status(400).json({
            message: "Deleting Profile failed"
        });
    })
    .catch(error => {
        res.status(500).json({
            message: "Deleting post failed"
        });
    });
};

// Get a single User
exports.getUser = (req, res, next) => {
    // find user by their id
    User.findById(req.params.id)
        .then(user => {
            // user exists
            if (user) {
                res.status(200).json({
                    message: "User fetched successfully",
                    userData: {
                        username: user.username,
                        email: user.email,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        gender: user.gender,
                        imagePath: user.imagePath
                    }
                });
            }
            else {
                res.status(404).json({
                    message: "User not found."
                });
            }
        })
        .catch(error => {
            res.status(500).json({
                message: "Fetching user failed."
            });
        });
};