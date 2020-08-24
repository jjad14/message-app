const mongoose = require('mongoose');

const Post = require('../models/post');
const Comment = require('../models/comment');

// Create Post
exports.createPost = (req, res, next) => {
    const url = req.protocol + "://" + req.get("host");
    const post = new Post({
        title: req.body.title,
        content: req.body.content,
        imagePath: url + "/images/" + req.file.filename,
        creator: req.userData.userId
    });
    post.save()
        .then(createdPost => {
            res.status(201).json({
                message: "Post added successfully.",
                post: {
                    ...createdPost,
                    id: createdPost._id,
                }
            });
        }
    )
    .catch(error => {
        res.status(500).json({
            message: "Failed to create post."
        });
    });
};

// Get All Posts
exports.getPosts = (req, res, next) => {
    // pagination query paramaters
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    const postQuery = Post.find();
    let fetchedPosts;

    // if values exist
    if (pageSize && currentPage) {
        postQuery
            .skip(pageSize * (currentPage - 1))
            .limit(pageSize);
    }

    postQuery
        .then(documents => {
            fetchedPosts = documents;
            return Post.countDocuments();
        })
        .then(count => {
            res.status(200).json({
                message: "Posts fetched successfully.",
                posts: fetchedPosts,
                maxPosts: count
            });
        })
        .catch(error => {
            res.status(500).json({
                message: "Fetching posts failed."
            });
        });
};

// Get All Post By Id
exports.getPostsById = (req, res, next) => {
    // pagination query paramaters
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    const postQuery = Post.find({ creator: req.params.id });
    let fetchedPosts;

    // if values exist
    if (pageSize && currentPage) {
        postQuery
            .skip(pageSize * (currentPage - 1))
            .limit(pageSize);
    }

    postQuery
    .then(documents => {
        fetchedPosts = documents;
        return Post.countDocuments({creator: req.params.id});
    })
    .then(count => {
        res.status(200).json({
            message: "Posts fetched successfully.",
            posts: fetchedPosts,
            maxPosts: count
        });
    })
    .catch(error => {
        res.status(500).json({
            message: "Fetching posts failed."
        });
    });
};

// Get a Single Post
exports.getPostById = (req, res, next) => {
    // Find post by id
    Post.findById(req.params.id)
        .then(post => {
            if (post) {
                res.status(200).json(post);
            } else {
                res.status(404).json({
                    message: 'Post not found.'
                });
            }
        })
        .catch(error => {
            res.status(500).json({
                message: "Fetching post failed."
            });
        });
};

// Update Post By Id
exports.updatePost = (req, res, next) => {
    let imagePath = req.body.imagePath;
    // if file exists
    if (req.file) {
        const url = req.protocol + "://" + req.get("host");
        imagePath = url + "/images/" + req.file.filename;
    }
    const post = new Post({
        _id: req.body.id,
        title: req.body.title,
        content: req.body.content,
        imagePath: imagePath,
        creator: req.userData.userId
    });
    // overwrite post fields with new ones
    Post.updateOne({ _id: req.params.id, creator: req.userData.userId }, post)
        .then(result => {
            if(result.n > 0) {
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
                message: "Updating post failed."
            });
        });
};

// Delete Post By Id
exports.deletePost = (req, res, next) => {
    Post.deleteOne({ _id: req.params.id, creator: req.userData.userId })
    .then(result => {
        // should be 1 if post is deleted
        if(result.deletedCount > 0) {
            res.status(200).json({
                message: "Deletion Successful."
            });
        } else {
            res.status(401).json({
                message: "You are not authorized."
            });
        }
    })
    .catch(error => {
        res.status(500).json({
            message: "Deleting post failed"
        });
    });
};
