const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// رجسٹریشن روٹ (سائن اپ)
router.post('/register', async (req, res) => {
    const { email, password } = req.body;

    // پاسورڈ کے قوانین: 8 حروف، 1 کیپیٹل، 1 اسپیشل کریکٹر
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,})/;

    if (!passwordRegex.test(password)) {
        return res.status(400).json({ 
            message: "پاسورڈ کم از کم 8 حروف، ایک بڑا حرف اور ایک اسپیشل کریکٹر (!@#$) پر مشتمل ہونا چاہیے۔" 
        });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ email, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ success: true, message: "اکاؤنٹ کامیابی سے بن گیا ہے!" });
    } catch (err) {
        res.status(500).json({ message: "ای میل پہلے سے رجسٹرڈ ہے یا سرور کا مسئلہ ہے۔" });
    }
});

// لاگ ان روٹ
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ message: "غلط ای میل یا پاسورڈ" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: "غلط ای میل یا پاسورڈ" });

        const token = jwt.sign({ id: user._id }, 'USER_SECRET_KEY', { expiresIn: '7d' });
        res.json({ success: true, token, message: "خوش آمدید!" });
    } catch (err) {
        res.status(500).json({ message: "سرور کا مسئلہ" });
    }
});

module.exports = router;