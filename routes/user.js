const express = require('express');
const authMiddleware = require('../middleware/middleware');
const User = require('../models/user');
const router = express.Router();

// Get User Profile
router.get('/profile/:userId', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update User Profile
router.put('/profile', authMiddleware, async (req, res) => {
    const { username, bio, profilePicture } = req.body;
    try {
        await User.findByIdAndUpdate(req.user._id, { username, bio, profilePicture });
        res.json({ success: true, message: 'Profile updated' });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
