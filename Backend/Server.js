const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db'); // بیکنڈ جوڑنے والا فنکشن
const providerRoutes = require('./routes/providerRoutes'); // روٹس

dotenv.config();
connectDB(); // ڈیٹا بیس سے رابطہ کریں

const app = express();
app.use(cors());
app.use(express.json());

// پلمبر کے لیے API روٹ
app.use('/api/providers', providerRoutes);

app.get('/', (req, res) => {
    res.send("QuickServe Backend is running with DB!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});