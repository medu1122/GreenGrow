const express = require('express');
const router = express.Router();
const ChatController = require('../controllers/chatController');
const auth = require('../middleware/auth');

// Apply auth middleware to all routes
router.use(auth);

// Get user's chats
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const result = await ChatController.getUserChats(req.user.id, page, limit);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get chat history
router.get('/:chatId', async (req, res) => {
  try {
    const chat = await ChatController.getChatHistory(req.user.id, req.params.chatId);
    res.json(chat);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// Create new chat
router.post('/', async (req, res) => {
  try {
    const { analysisId } = req.body;
    const chat = await ChatController.createOrGetChat(req.user.id, analysisId);
    res.json(chat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Send message (for REST API - WebSocket is preferred)
router.post('/:chatId/message', async (req, res) => {
  try {
    const { message } = req.body;
    const response = await ChatController.processMessage(message, req.params.chatId);
    res.json({ response });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
