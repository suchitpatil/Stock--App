const express = require('express');
const authMiddleware = require('../middleware/middleware');
const Like = require('../models/like');
const Post = require('../models/post');
const router = express.Router();

// Like a Post
router.post('/:postId/like', authMiddleware, async (req, res) => {
    try {
        const existingLike = await Like.findOne({ postId: req.params.postId, userId: req.user._id });
        if (existingLike) return res.status(400).json({ message: 'Post already liked' });

        const like = new Like({ postId: req.params.postId, userId: req.user._id });
        await like.save();

        await Post.findByIdAndUpdate(req.params.postId, { $inc: { likesCount: 1 } });

        res.json({ success: true, message: 'Post liked' });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Unlike a Post
router.delete('/:postId/like', authMiddleware, async (req, res) => {
    try {
        await Like.findOneAndDelete({ postId: req.params.postId, userId: req.user._id });

        await Post.findByIdAndUpdate(req.params.postId, { $inc: { likesCount: -1 } });

        res.json({ success: true, message: 'Post unliked' });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
