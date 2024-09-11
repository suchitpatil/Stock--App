const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
    stockSymbol: {
        type: String,
         required: true
    },
    title: {
        type: String,
         required: true
    },
    description: {
        type: String,
         required: true
    },
    tags: [String],
    createdAt: {
        type: Date, 
        default: Date.now
    },
    authorId: {
        type: Schema.
        Types.ObjectId, 
        ref: 'User',
         required: true
    },
    likesCount: {
        type: Number,
         default: 0
    }
});

module.exports = mongoose.model('Post', PostSchema);
