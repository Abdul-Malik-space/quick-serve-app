const mongoose = require('mongoose');

const serviceProviderSchema = new mongoose.Schema({
    name: { type: String, required: true },
    skill: { type: String, default: 'Plumber' }, // فی الحال ہم پلمبر پر فوکس کر رہے ہیں
    phone: { type: String, required: true },
    hourlyRate: { type: Number, required: true },
    location: { type: String, required: true },
    isAvailable: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('ServiceProvider', serviceProviderSchema);