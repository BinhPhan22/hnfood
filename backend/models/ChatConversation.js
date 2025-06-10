const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['user', 'assistant', 'system'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  tokens_used: {
    type: Number,
    default: 0
  }
});

const ChatConversationSchema = new mongoose.Schema({
  session_id: {
    type: String,
    required: true,
    unique: true
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null // null for anonymous users
  },
  user_ip: {
    type: String,
    required: true
  },
  user_agent: {
    type: String,
    default: ''
  },
  language: {
    type: String,
    default: 'vi',
    enum: ['vi', 'en']
  },
  
  // Conversation data
  messages: [MessageSchema],
  
  // Status
  status: {
    type: String,
    enum: ['active', 'ended', 'timeout'],
    default: 'active'
  },
  
  // Analytics
  total_messages: {
    type: Number,
    default: 0
  },
  total_tokens: {
    type: Number,
    default: 0
  },
  duration: {
    type: Number, // in seconds
    default: 0
  },
  
  // User feedback
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: null
  },
  feedback: {
    type: String,
    default: ''
  },
  
  // Metadata
  started_at: {
    type: Date,
    default: Date.now
  },
  ended_at: {
    type: Date,
    default: null
  },
  last_activity: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes
ChatConversationSchema.index({ session_id: 1 });
ChatConversationSchema.index({ user_id: 1 });
ChatConversationSchema.index({ user_ip: 1 });
ChatConversationSchema.index({ status: 1 });
ChatConversationSchema.index({ createdAt: -1 });

// Methods
ChatConversationSchema.methods.addMessage = function(role, content, tokensUsed = 0) {
  this.messages.push({
    role,
    content,
    tokens_used: tokensUsed
  });
  
  this.total_messages = this.messages.length;
  this.total_tokens += tokensUsed;
  this.last_activity = new Date();
  
  return this.save();
};

ChatConversationSchema.methods.endConversation = function(rating = null, feedback = '') {
  this.status = 'ended';
  this.ended_at = new Date();
  this.duration = Math.floor((this.ended_at - this.started_at) / 1000);
  
  if (rating) {
    this.rating = rating;
  }
  
  if (feedback) {
    this.feedback = feedback;
  }
  
  return this.save();
};

ChatConversationSchema.methods.getRecentMessages = function(limit = 10) {
  return this.messages
    .slice(-limit)
    .map(msg => ({
      role: msg.role,
      content: msg.content
    }));
};

// Static methods
ChatConversationSchema.statics.createConversation = async function(sessionId, userIp, userAgent = '', userId = null, language = 'vi') {
  return this.create({
    session_id: sessionId,
    user_id: userId,
    user_ip: userIp,
    user_agent: userAgent,
    language
  });
};

ChatConversationSchema.statics.findBySessionId = function(sessionId) {
  return this.findOne({ session_id: sessionId, status: 'active' });
};

ChatConversationSchema.statics.getActiveConversations = function() {
  return this.find({ status: 'active' });
};

ChatConversationSchema.statics.getConversationStats = async function(startDate, endDate) {
  const pipeline = [
    {
      $match: {
        createdAt: {
          $gte: startDate,
          $lte: endDate
        }
      }
    },
    {
      $group: {
        _id: null,
        totalConversations: { $sum: 1 },
        totalMessages: { $sum: '$total_messages' },
        totalTokens: { $sum: '$total_tokens' },
        averageDuration: { $avg: '$duration' },
        averageRating: { $avg: '$rating' },
        completedConversations: {
          $sum: {
            $cond: [{ $eq: ['$status', 'ended'] }, 1, 0]
          }
        }
      }
    }
  ];
  
  const result = await this.aggregate(pipeline);
  return result[0] || {
    totalConversations: 0,
    totalMessages: 0,
    totalTokens: 0,
    averageDuration: 0,
    averageRating: 0,
    completedConversations: 0
  };
};

// Auto-timeout inactive conversations (30 minutes)
ChatConversationSchema.statics.timeoutInactiveConversations = async function() {
  const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
  
  return this.updateMany(
    {
      status: 'active',
      last_activity: { $lt: thirtyMinutesAgo }
    },
    {
      status: 'timeout',
      ended_at: new Date()
    }
  );
};

module.exports = mongoose.model('ChatConversation', ChatConversationSchema);
