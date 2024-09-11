const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    passwordHash: {
        type: String,
        required: true
    },
    bio: {
        type: String
    },
    profilePicture: {
        type: String
    }
});

module.exports = mongoose.model('User', UserSchema);
