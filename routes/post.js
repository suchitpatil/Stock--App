const express = require('express');
const authMiddleware = require('../middleware/middleware');
const Post = require('../models/post');
const router = express.Router();

// Create a Stock Post
router.post('/', authMiddleware, async (req, res) => {
    const { stockSymbol, title, description, tags } = req.body;
    try {
        const post = new Post({ stockSymbol, title, description, tags, authorId: req.user._id });
        await post.save();
        res.json({ success: true, postId: post._id, message: 'Post created successfully' });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Get All Stock Posts
router.get('/', async (req, res) => {
    const { stockSymbol, tags, sortBy = 'date', page = 1, limit = 10 } = req.query;
    try {
        const filter = {};
        if (stockSymbol) filter.stockSymbol = stockSymbol;
        if (tags) filter.tags = { $in: tags.split(',') };
        
        const posts = await Post.find(filter)
            .sort(sortBy === 'likes' ? { likesCount: -1 } : { createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(Number(limit));
        
        res.json(posts);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Get a Single Stock Post
router.get('/:postId', async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId).populate('authorId');
        if (!post) return res.status(404).json({ message: 'Post not found' });
        res.json(post);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete a Stock Post
router.delete('/:postId', authMiddleware, async (req, res) => {
    try {
        await Post.findByIdAndDelete(req.params.postId);
        res.json({ success: true, message: 'Post deleted successfully' });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
