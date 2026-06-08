const User = require('../model/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');


const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// Register a new user
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
    try {
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const message = `Your OTP for registration is: ${otp}`;

    await sendEmail(email, 'OTP for Registration', message);

    const user = await User.create({ name, email, password: hashedPassword });

    res.status(201).json({
       _id: user._id,
       name: user.name,
       email: user.email,
       role: user.role,
       token: generateToken(user._id),
    });

  } catch (error) {
    console.error('Register error:', error.message);

    if (error.code === 'EAUTH') {
      return res.status(502).json({
        message: 'Email login failed. Check EMAIL_USER and Gmail app password in .env',
      });
    }

    if (error.code === 11000) {
      return res.status(400).json({ message: 'User already exists' });
    }

    res.status(500).json({ message: 'Server error' });
  }
};

// Login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    console.error('Get users error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUsers,
};
