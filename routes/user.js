const express = require('express');
const authMiddleware = require('../middleware/middleware');
const User = require('../models/user');
const router = express.Router();

// Get user profile by user ID
router.get('/profile/:userId', authMiddleware, async (req, res) => {
    try {
        // Find the user by ID
        const user = await User.findById(req.params.userId);
        if (!user) return res.status(404).json({ message: 'User not found' });
        // Respond with user profile details
        res.json(user);
    } catch (err) {
        // Respond with an error message if something goes wrong
        res.status(400).json({ message: err.message });
    }
});

// Update the authenticated user's profile
router.put('/profile', authMiddleware, async (req, res) => {
    const { username, bio, profilePicture } = req.body;
    try {
        // Update the user's profile information
        await User.findByIdAndUpdate(req.user._id, { username, bio, profilePicture });
        // Respond with a success message
        res.json({ success: true, message: 'Profile updated' });
    } catch (err) {
        // Respond with an error message if something goes wrong
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
