const express = require('express');
const authMiddleware = require('../middleware/middleware');
const Like = require('../models/like');
const Post = require('../models/post');
const router = express.Router();

// Like a post
router.post('/:postId/like', authMiddleware, async (req, res) => {
    try {
        // Check if the user has already liked this post
        const existingLike = await Like.findOne({ postId: req.params.postId, userId: req.user._id });
        if (existingLike) {
            return res.status(400).json({ message: 'Post already liked' });
        }

        // Create and save a new like
        const like = new Like({ postId: req.params.postId, userId: req.user._id });
        await like.save();

        // Increment the likes count on the post
        await Post.findByIdAndUpdate(req.params.postId, { $inc: { likesCount: 1 } });

        // Respond with a success message
        res.json({ success: true, message: 'Post liked' });
    } catch (err) {
        // Respond with an error message if something goes wrong
        res.status(400).json({ message: err.message });
    }
});

// Unlike a post
router.delete('/:postId/like', authMiddleware, async (req, res) => {
    try {
        // Find and delete the user's like for the post
        await Like.findOneAndDelete({ postId: req.params.postId, userId: req.user._id });

        // Decrement the likes count on the post
        await Post.findByIdAndUpdate(req.params.postId, { $inc: { likesCount: -1 } });

        // Respond with a success message
        res.json({ success: true, message: 'Post unliked' });
    } catch (err) {
        // Respond with an error message if something goes wrong
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
