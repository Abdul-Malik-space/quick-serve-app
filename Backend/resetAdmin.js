const mongoose = require('mongoose');
const Admin = require('./models/Admin'); 
const bcrypt = require('bcrypt'); // اگر آپ bcrypt استعمال کر رہے ہیں

mongoose.connect('mongodb://localhost:27017/quickserve');

const reset = async () => {
    await Admin.deleteMany({}); // پرانا ڈیٹا صاف
    const hashedPassword = await bcrypt.hash('admin123', 10); // پاسورڈ کو محفوظ بنائیں
    
    const newAdmin = new Admin({
        username: 'admin',
        password: hashedPassword 
    });

    await newAdmin.save();
    console.log("Admin Reset! User: admin | Pass: admin123");
    process.exit();
};
reset();