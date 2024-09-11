const express = require('express');
const authMiddleware = require('../middleware/middleware');
const Post = require('../models/post');
const router = express.Router();

// Create a new stock post
router.post('/', authMiddleware, async (req, res) => {
    const { stockSymbol, title, description, tags } = req.body;
    try {
        // Create a new post instance with the provided details
        const post = new Post({ 
            stockSymbol, 
            title, 
            description, 
            tags, 
            authorId: req.user._id // Set the author ID to the currently authenticated user
        });
        // Save the post to the database
        await post.save();
        // Respond with success message and the ID of the newly created post
        res.json({ success: true, postId: post._id, message: 'Post created successfully' });
    } catch (err) {
        // Respond with an error message if something goes wrong
        res.status(400).json({ message: err.message });
    }
});

// Get all stock posts with optional filters and pagination
router.get('/', async (req, res) => {
    const { stockSymbol, tags, sortBy = 'date', page = 1, limit = 10 } = req.query;
    try {
        // Build filter object based on query parameters
        const filter = {};
        if (stockSymbol) filter.stockSymbol = stockSymbol;
        if (tags) filter.tags = { $in: tags.split(',') };
        
        // Find posts with the specified filters, sorting, and pagination
        const posts = await Post.find(filter)
            .sort(sortBy === 'likes' ? { likesCount: -1 } : { createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(Number(limit));
        
        // Respond with the list of posts
        res.json(posts);
    } catch (err) {
        // Respond with an error message if something goes wrong
        res.status(400).json({ message: err.message });
    }
});

// Get a single stock post by its ID
router.get('/:postId', async (req, res) => {
    try {
        // Find the post by its ID and populate the author's details
        const post = await Post.findById(req.params.postId).populate('authorId');
        if (!post) return res.status(404).json({ message: 'Post not found' });
        // Respond with the post details
        res.json(post);
    } catch (err) {
        // Respond with an error message if something goes wrong
        res.status(400).json({ message: err.message });
    }
});

// Delete a stock post by its ID
router.delete('/:postId', authMiddleware, async (req, res) => {
    try {
        // Find and delete the post by its ID
        await Post.findByIdAndDelete(req.params.postId);
        // Respond with a success message
        res.json({ success: true, message: 'Post deleted successfully' });
    } catch (err) {
        // Respond with an error message if something goes wrong
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
