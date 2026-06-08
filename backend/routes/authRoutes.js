const express = require('express');
const userRouter = express.Router();
const User = require('../model/user');
const { registerUser, loginUser, getUsers } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

// Placeholder auth routes
userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.get('/users', protect, admin, getUsers);
userRouter.post('/verify-email', async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'Email is registered' });
    } catch (error) {
        console.error('Email verification error:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = userRouter;