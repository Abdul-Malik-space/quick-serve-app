const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');

const connectDB = require('./config/db');
const providerRoutes = require('./routes/providerRoutes');
const Provider = require('./models/Provider'); // ماڈل امپورٹ کرنا ضروری ہے

dotenv.config();
connectDB();

const app = express();

// 1. مڈل ویئر سیٹ کریں
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 2. HTTP سرور بنائیں
const server = http.createServer(app);

// 3. Socket.io سیٹ کریں
const io = new Server(server, {
  cors: { origin: "http://localhost:3000" }
});

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('markOnline', async (providerId) => {
    socket.providerId = providerId;
    try {
      await Provider.findByIdAndUpdate(providerId, { isOnline: true });
      io.emit('statusChanged'); // سب کو بتائیں کہ کوئی آن لائن ہوا ہے
      console.log(`Provider ${providerId} is online`);
    } catch (err) {
      console.error(err);
    }
  });

  socket.on('disconnect', async () => {
    if (socket.providerId) {
      try {
        await Provider.findByIdAndUpdate(socket.providerId, { isOnline: false });
        io.emit('statusChanged');
        console.log('User disconnected and marked offline');
      } catch (err) {
        console.error(err);
      }
    }
  });
});

const authRoutes = require('./routes/authRoutes');

// روٹس والے حصے میں یہ لائن ڈالیں
app.use('/api/auth', authRoutes);

// 4. API روٹس
app.use('/api/providers', providerRoutes);

app.get('/', (req, res) => {
    res.send("QuickServe Backend is running with Sockets!");
});

// 5. صرف ایک بار سرور چلائیں (server.listen)
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});