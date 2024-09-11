const express = require('express');
const authMiddleware = require('../middleware/middleware');
const Comment = require('../models/comment');
const router = express.Router();

// Add a comment to a post
router.post('/:postId/comments', authMiddleware, async (req, res) => {
    const { comment } = req.body;
    try {
        // Create a new comment instance
        const newComment = new Comment({ 
            postId: req.params.postId, // ID of the post to which the comment belongs
            userId: req.user._id, // ID of the user making the comment
            comment // The comment text
        });
        // Save the comment to the database
        await newComment.save();
        // Respond with success message and new comment ID
        res.json({ success: true, commentId: newComment._id, message: 'Comment added successfully' });
    } catch (err) {
        // Respond with an error message if something goes wrong
        res.status(400).json({ message: err.message });
    }
});

// Delete a comment
router.delete('/:postId/comments/:commentId', authMiddleware, async (req, res) => {
    try {
        // Find and delete the comment by its ID
        await Comment.findByIdAndDelete(req.params.commentId);
        // Respond with success message
        res.json({ success: true, message: 'Comment deleted successfully' });
    } catch (err) {
        // Respond with an error message if something goes wrong
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
