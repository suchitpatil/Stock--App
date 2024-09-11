const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const router = express.Router();

// Handle user registration
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        // Hash the password with bcrypt
        const passwordHash = await bcrypt.hash(password, 10);
        // Create a new user instance
        const user = new User({ username, email, passwordHash });
        // Save the user to the database
        await user.save();
        // Respond with success message and user ID
        res.json({ success: true, message: 'User registered successfully', userId: user._id });
    } catch (err) {
        // Handle errors and respond with a message
        res.status(400).json({ message: err.message });
    }
});

// Handle user login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        // Find the user by email
        const user = await User.findOne({ email });
        // Check if the user exists and the password is correct
        if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        // Generate a JWT token for the user
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        // Respond with the token and user information
        res.json({ token, user: { id: user._id, username: user.username, email: user.email } });
    } catch (err) {
        // Handle errors and respond with a message
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
