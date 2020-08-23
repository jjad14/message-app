const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    title: { type: String, required: true },
    content: {type: String, required: true},
    imagePath: {type: String, required: true},
    creator: { type: mongoose.Schema.Types.ObjectId, ref:"User", required: true},
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        default: undefined,
        ref: 'Comment' }]
});

// collection name will be all lowercase and plural = posts.
module.exports = mongoose.model('Post', postSchema);

