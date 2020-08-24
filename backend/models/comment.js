const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
    content: { type: String, required: true },
    createdBy: {type: String, required: true},
    createdId: { type: mongoose.Schema.Types.ObjectId, ref:"User", required: true},
    postId: { type: mongoose.Schema.Types.ObjectId, ref:"Post", required: true}
}, {
    timestamps: true
});

module.exports = mongoose.model('Comment', commentSchema);
