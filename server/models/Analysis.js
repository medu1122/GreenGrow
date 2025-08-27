const mongoose = require('mongoose');

const analysisSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  cloudinaryId: {
    type: String,
    required: true
  },
  plantName: {
    type: String,
    required: true
  },
  plantFamily: {
    type: String,
    default: null
  },
  plantGenus: {
    type: String,
    default: null
  },
  plantSpecies: {
    type: String,
    default: null
  },
  confidence: {
    type: Number,
    min: 0,
    max: 100,
    required: true
  },
  diseases: [{
    name: {
      type: String,
      required: true
    },
    confidence: {
      type: Number,
      min: 0,
      max: 100,
      required: true
    },
    description: {
      type: String,
      default: null
    },
    symptoms: [{
      type: String
    }],
    treatments: [{
      type: String
    }],
    severity: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'low'
    }
  }],
  healthStatus: {
    type: String,
    enum: ['healthy', 'sick', 'unknown'],
    default: 'unknown'
  },
  weatherData: {
    temperature: Number,
    humidity: Number,
    description: String,
    location: String
  },
  location: {
    type: {
      type: String,
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      default: [0, 0]
    }
  },
  notes: {
    type: String,
    default: null
  },
  tags: [{
    type: String
  }],
  isPublic: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending'
  },
  processingTime: {
    type: Number, // in milliseconds
    default: null
  }
}, {
  timestamps: true
});

// Index for geospatial queries
analysisSchema.index({ location: '2dsphere' });

// Index for user queries
analysisSchema.index({ user: 1, createdAt: -1 });

// Index for public analyses
analysisSchema.index({ isPublic: 1, createdAt: -1 });

// Virtual for plant info
analysisSchema.virtual('plantInfo').get(function() {
  return {
    name: this.plantName,
    family: this.plantFamily,
    genus: this.plantGenus,
    species: this.plantSpecies,
    confidence: this.confidence
  };
});

// Method to get severity level
analysisSchema.methods.getSeverityLevel = function() {
  if (this.diseases.length === 0) return 'healthy';
  
  const maxSeverity = this.diseases.reduce((max, disease) => {
    const severityLevels = { low: 1, medium: 2, high: 3, critical: 4 };
    return Math.max(max, severityLevels[disease.severity] || 1);
  }, 1);
  
  const severityMap = { 1: 'low', 2: 'medium', 3: 'high', 4: 'critical' };
  return severityMap[maxSeverity];
};

module.exports = mongoose.model('Analysis', analysisSchema);
