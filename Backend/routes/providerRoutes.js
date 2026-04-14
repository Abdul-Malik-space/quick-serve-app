const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Provider = require('../models/Provider');

// تصویر سیو کرنے کی سیٹنگ (Multer Storage)
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// نیا ماہر ایڈ کرنے کا روٹ (تصویر کے ساتھ)
router.post('/add', upload.single('image'), async (req, res) => {
  try {
    const { name, phone, hourlyRate, location, skill } = req.body;
    const newProvider = new Provider({
      name,
      phone,
      hourlyRate,
      location,
      skill,
      image: req.file ? req.file.path : '' 
    });

    const saved = await newProvider.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// تمام ڈیٹا حاصل کرنے کا روٹ
router.get('/all', async (req, res) => {
  try {
    const providers = await Provider.find();
    res.json(providers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// فون نمبر کے ذریعے پلمبر کو تلاش کرنا (لاگ ان کے لیے)
router.post('/login', async (req, res) => {
  try {
    const { phone } = req.body;
    const provider = await Provider.findOne({ phone: phone });
    
    if (!provider) {
      return res.status(404).json({ message: "اس نمبر سے کوئی ماہر رجسٹرڈ نہیں ہے۔" });
    }
    res.json(provider);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// اسٹیٹس کو آن لائن یا آف لائن کرنے کا روٹ
router.patch('/toggle-status/:id', async (req, res) => {
  try {
    const provider = await Provider.findById(req.params.id);
    if (!provider) {
      return res.status(404).json({ message: "ماہر نہیں ملا" });
    }
    
    // اسٹیٹس کو الٹ دیں (اگر true ہے تو false، اور اگر false ہے تو true)
    provider.isOnline = !provider.isOnline;
    
    await provider.save();
    res.json(provider);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ڈیٹا ڈیلیٹ کرنے کا روٹ (اگر پہلے سے نہیں ہے)
router.delete('/delete/:id', async (req, res) => {
  try {
    await Provider.findByIdAndDelete(req.params.id);
    res.json({ message: "ڈیلیٹ کر دیا گیا" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;