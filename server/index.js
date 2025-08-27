const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  path: process.env.SOCKET_IO_PATH || '/socket.io',
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(helmet());
app.use(compression());
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check (no auth)
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime(), env: process.env.NODE_ENV || 'development' });
});

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/plant-disease-analyzer', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/analysis', require('./routes/analysis'));
app.use('/api/chat', require('./routes/chat'));
app.use('/api/weather', require('./routes/weather'));

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join-analysis', (analysisId) => {
    socket.join(analysisId);
    console.log(`User ${socket.id} joined analysis ${analysisId}`);
  });

  socket.on('chat-message', async (data) => {
    try {
      const chatController = require('./controllers/chatController');
      const response = await chatController.processMessage(data.message, data.analysisId);
      
      io.to(data.analysisId).emit('chat-response', {
        message: response,
        timestamp: new Date(),
        type: 'ai'
      });
    } catch (error) {
      console.error('Chat error:', error);
      socket.emit('chat-error', { message: 'Error processing message' });
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = { app, io };
