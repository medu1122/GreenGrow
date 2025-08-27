const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true
  },
  sender: {
    type: String,
    enum: ['user', 'ai'],
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  messageType: {
    type: String,
    enum: ['text', 'image', 'analysis_result'],
    default: 'text'
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
});

const chatSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  analysis: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Analysis',
    default: null
  },
  title: {
    type: String,
    default: 'New Chat'
  },
  messages: [messageSchema],
  isActive: {
    type: Boolean,
    default: true
  },
  lastActivity: {
    type: Date,
    default: Date.now
  },
  tags: [{
    type: String
  }],
  summary: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

// Index for user queries
chatSchema.index({ user: 1, lastActivity: -1 });

// Index for analysis-related chats
chatSchema.index({ analysis: 1 });

// Method to add message
chatSchema.methods.addMessage = function(content, sender, messageType = 'text', metadata = {}) {
  this.messages.push({
    content,
    sender,
    messageType,
    metadata,
    timestamp: new Date()
  });
  this.lastActivity = new Date();
  return this.save();
};

// Method to get recent messages
chatSchema.methods.getRecentMessages = function(limit = 50) {
  return this.messages.slice(-limit);
};

// Method to generate chat summary
chatSchema.methods.generateSummary = function() {
  const userMessages = this.messages.filter(msg => msg.sender === 'user');
  if (userMessages.length === 0) return 'Empty chat';
  
  const topics = userMessages.map(msg => msg.content.substring(0, 50)).join(', ');
  return topics.length > 100 ? topics.substring(0, 100) + '...' : topics;
};

// Pre-save middleware to update summary
chatSchema.pre('save', function(next) {
  if (this.isModified('messages') && this.messages.length > 0) {
    this.summary = this.generateSummary();
  }
  next();
});

module.exports = mongoose.model('Chat', chatSchema);
