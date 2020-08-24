const mongoose = require('mongoose');

const Post = require('../models/post');
const Comment = require('../models/comment');


// create comment
exports.createComment = (req, res, next) => {
    const comment = new Comment({
        content: req.body.content,
        createdBy: req.body.username,
        createdId: req.userData.userId,
        postId: req.params.id
    });

    comment.save()
        .then(createdComment => {
            if (createdComment) {
                res.status(201).json({
                    message: "Comment added successfully.",
                    comment: {
                        ...createdComment,
                        id: createdComment._id,
                    }
                });
            } else {
                res.status(400).json({
                    message: "Unable to Comment on Post. Please try again!"
                });
            }
        }
    )
    .catch(error => {
        res.status(500).json({
            message: "Failed to create comment."
        });
    });
};

exports.getComments = (req, res, next) => {
    // pagination query paramaters
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    const commentQuery = Comment.find({ postId: req.params.id });
    let fetchedComments;

    // if values exist
    if (pageSize && currentPage) {
        commentQuery
            .skip(pageSize * (currentPage - 1))
            .limit(pageSize);
    }

    commentQuery
    .then(documents => {
        fetchedComments = documents;
        return Comment.countDocuments({ postId: req.params.id });
    })
    .then(count => {
        res.status(200).json({
            message: "Comments fetched successfully.",
            comments: fetchedComments,
            maxComments: count
        });
    })
    .catch(error => {
        res.status(500).json({
            message: "Fetching comments failed."
        });
    });
};

// exports.editComment = (req, res, next) => {

// };

// exports.deleteComment = (req, res, next) => {

// };