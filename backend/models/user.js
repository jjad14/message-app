const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    gender: { type: String, required: true },
    password: { type: String, required: true }
}, {
    timestamps: true
});

// plugin for our schema - allows unique values to be unique in database - else throws error 
userSchema.plugin(uniqueValidator);

// collection name will be all lowercase and plural = posts.
module.exports = mongoose.model('User', userSchema);
