const express = require('express');
const router = express.Router();
const Provider = require('../models/Provider');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

// تمام پلمبرز حاصل کرنے کا راستہ
router.get('/all', async (req, res) => {
    try {
        const providers = await Provider.find();
        res.json(providers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// نیا پلمبر ایڈ کرنے کا راستہ
router.post('/add', async (req, res) => {
    const newProvider = new Provider(req.body);
    try {
        const savedProvider = await newProvider.save();
        res.status(201).json(savedProvider);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// پلمبر ڈیلیٹ کرنے کا راستہ
router.delete('/delete/:id', async (req, res) => {
    try {
        await Provider.findByIdAndDelete(req.params.id);
        res.json({ message: "Deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// لاگ ان کا لاجک
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const admin = await Admin.findOne({ username });
        if (!admin) {
            return res.status(400).json({ msg: "ایڈمن کا نام غلط ہے" });
        }
        if (password !== admin.password) {
            return res.status(400).json({ msg: "پاس ورڈ درست نہیں ہے" });
        }
        const token = jwt.sign({ id: admin._id }, 'secret_key', { expiresIn: '1h' });
        res.json({ token, msg: "لاگ ان کامیاب ہو گیا!" });
    } catch (err) {
        res.status(500).json({ error: "سرور میں کوئی مسئلہ ہے" });
    }
});






module.exports = router;