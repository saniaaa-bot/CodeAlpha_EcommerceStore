const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 1. REGISTER (Naya user banana)
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check karein ke user pehle se hai ya nahi
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: "User already exists" });

        // Password ko secure (hash) karein
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Naya user save karein
        user = new User({ name, email, password: hashedPassword });
        await user.save();

        res.status(201).json({ message: "User registered successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// 2. LOGIN (User ko login karana aur Token dena)
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check karein user exist karta hai ya nahi
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid credentials" });

        // Password match karein
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        // JWT Token banayein
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.json({ message: "Login successful", token, user: { id: user._id, name: user.name, email: user.email } });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

module.exports = router;