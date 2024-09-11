const express = require('express');
const authMiddleware = require('../middleware/middleware');
const Comment = require('../models/comment');
const router = express.Router();

// Add a Comment to a Post
router.post('/:postId/comments', authMiddleware, async (req, res) => {
    const { comment } = req.body;
    try {
        const newComment = new Comment({ postId: req.params.postId, userId: req.user._id, comment });
        await newComment.save();
        res.json({ success: true, commentId: newComment._id, message: 'Comment added successfully' });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete a Comment
router.delete('/:postId/comments/:commentId', authMiddleware, async (req, res) => {
    try {
        await Comment.findByIdAndDelete(req.params.commentId);
        res.json({ success: true, message: 'Comment deleted successfully' });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
