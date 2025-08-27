const Analysis = require('../models/Analysis');
const cloudinary = require('cloudinary').v2;
const axios = require('axios');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Plant.id API configuration
const PLANT_ID_API_KEY = process.env.PLANT_ID_API_KEY;
const PLANT_ID_BASE_URL = 'https://api.plant.id/v2';

class AnalysisController {
  // Upload image to Cloudinary
  static async uploadImage(imageBuffer) {
    try {
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            resource_type: 'image',
            folder: 'plant-analysis',
            transformation: [
              { width: 800, height: 600, crop: 'limit' },
              { quality: 'auto' }
            ]
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(imageBuffer);
      });

      return {
        url: result.secure_url,
        publicId: result.public_id
      };
    } catch (error) {
      throw new Error(`Image upload failed: ${error.message}`);
    }
  }

  // Analyze plant using Plant.id API
  static async analyzePlant(imageUrl) {
    try {
      const response = await axios.post(
        `${PLANT_ID_BASE_URL}/identify`,
        {
          images: [imageUrl],
          plant_details: ['common_names', 'url', 'wiki_description', 'taxonomy'],
          health: 'all'
        },
        {
          headers: {
            'Api-Key': PLANT_ID_API_KEY,
            'Content-Type': 'application/json'
          }
        }
      );

      const result = response.data;
      
      if (!result.suggestions || result.suggestions.length === 0) {
        throw new Error('No plant identification results found');
      }

      const topSuggestion = result.suggestions[0];
      const plantInfo = topSuggestion.plant_details;
      const healthAssessment = result.health || {};

      // Process diseases
      const diseases = [];
      if (healthAssessment.disease_suggestions) {
        healthAssessment.disease_suggestions.forEach(disease => {
          diseases.push({
            name: disease.name,
            confidence: Math.round(disease.probability * 100),
            description: disease.description || null,
            symptoms: disease.symptoms || [],
            treatments: disease.treatment || [],
            severity: this.calculateSeverity(disease.probability)
          });
        });
      }

      return {
        plantName: plantInfo.common_names ? plantInfo.common_names[0] : 'Unknown Plant',
        plantFamily: plantInfo.taxonomy?.family || null,
        plantGenus: plantInfo.taxonomy?.genus || null,
        plantSpecies: plantInfo.taxonomy?.species || null,
        confidence: Math.round(topSuggestion.probability * 100),
        diseases: diseases,
        healthStatus: diseases.length > 0 ? 'sick' : 'healthy',
        wikiDescription: plantInfo.wiki_description || null,
        wikiUrl: plantInfo.url || null
      };
    } catch (error) {
      console.error('Plant.id API error:', error.response?.data || error.message);
      throw new Error(`Plant analysis failed: ${error.message}`);
    }
  }

  // Calculate disease severity based on confidence
  static calculateSeverity(confidence) {
    if (confidence >= 0.8) return 'critical';
    if (confidence >= 0.6) return 'high';
    if (confidence >= 0.4) return 'medium';
    return 'low';
  }

  // Get weather data for location
  static async getWeatherData(lat, lon) {
    try {
      const weatherApiKey = process.env.OPENWEATHER_API_KEY;
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${weatherApiKey}&units=metric`
      );

      const weather = response.data;
      return {
        temperature: weather.main.temp,
        humidity: weather.main.humidity,
        description: weather.weather[0].description,
        location: weather.name
      };
    } catch (error) {
      console.error('Weather API error:', error.message);
      return null;
    }
  }

  // Create new analysis
  static async createAnalysis(req, res) {
    try {
      const startTime = Date.now();
      const { imageBuffer, location, notes } = req.body;
      const userId = req.user.id;

      if (!imageBuffer) {
        return res.status(400).json({ error: 'Image is required' });
      }

      // Convert base64 to buffer
      const buffer = Buffer.from(imageBuffer.split(',')[1], 'base64');

      // Upload image to Cloudinary
      const uploadResult = await this.uploadImage(buffer);

      // Create analysis record
      const analysis = new Analysis({
        user: userId,
        imageUrl: uploadResult.url,
        cloudinaryId: uploadResult.publicId,
        status: 'processing',
        notes: notes || null,
        location: location || { type: 'Point', coordinates: [0, 0] }
      });

      await analysis.save();

      // Analyze plant asynchronously
      this.processAnalysis(analysis._id, uploadResult.url, location);

      res.status(201).json({
        message: 'Analysis started',
        analysisId: analysis._id,
        imageUrl: uploadResult.url
      });

    } catch (error) {
      console.error('Create analysis error:', error);
      res.status(500).json({ error: error.message });
    }
  }

  // Process analysis asynchronously
  static async processAnalysis(analysisId, imageUrl, location) {
    try {
      const analysis = await Analysis.findById(analysisId);
      if (!analysis) return;

      // Update status to processing
      analysis.status = 'processing';
      await analysis.save();

      // Analyze plant
      const plantResult = await this.analyzePlant(imageUrl);

      // Get weather data if location provided
      let weatherData = null;
      if (location && location.coordinates && location.coordinates.length === 2) {
        weatherData = await this.getWeatherData(location.coordinates[1], location.coordinates[0]);
      }

      // Update analysis with results
      analysis.plantName = plantResult.plantName;
      analysis.plantFamily = plantResult.plantFamily;
      analysis.plantGenus = plantResult.plantGenus;
      analysis.plantSpecies = plantResult.plantSpecies;
      analysis.confidence = plantResult.confidence;
      analysis.diseases = plantResult.diseases;
      analysis.healthStatus = plantResult.healthStatus;
      analysis.weatherData = weatherData;
      analysis.status = 'completed';
      analysis.processingTime = Date.now() - analysis.createdAt.getTime();

      await analysis.save();

      console.log(`Analysis ${analysisId} completed successfully`);

    } catch (error) {
      console.error(`Analysis ${analysisId} failed:`, error);
      
      const analysis = await Analysis.findById(analysisId);
      if (analysis) {
        analysis.status = 'failed';
        await analysis.save();
      }
    }
  }

  // Get analysis by ID
  static async getAnalysis(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const analysis = await Analysis.findById(id)
        .populate('user', 'username fullName avatar')
        .lean();

      if (!analysis) {
        return res.status(404).json({ error: 'Analysis not found' });
      }

      // Check if user can access this analysis
      if (analysis.user._id.toString() !== userId && !analysis.isPublic) {
        return res.status(403).json({ error: 'Access denied' });
      }

      res.json(analysis);

    } catch (error) {
      console.error('Get analysis error:', error);
      res.status(500).json({ error: error.message });
    }
  }

  // Get user's analyses
  static async getUserAnalyses(req, res) {
    try {
      const userId = req.user.id;
      const { page = 1, limit = 10, status } = req.query;

      const query = { user: userId };
      if (status) query.status = status;

      const analyses = await Analysis.find(query)
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .populate('user', 'username fullName avatar')
        .lean();

      const total = await Analysis.countDocuments(query);

      res.json({
        analyses,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        total
      });

    } catch (error) {
      console.error('Get user analyses error:', error);
      res.status(500).json({ error: error.message });
    }
  }

  // Delete analysis
  static async deleteAnalysis(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const analysis = await Analysis.findById(id);
      if (!analysis) {
        return res.status(404).json({ error: 'Analysis not found' });
      }

      if (analysis.user.toString() !== userId) {
        return res.status(403).json({ error: 'Access denied' });
      }

      // Delete from Cloudinary
      if (analysis.cloudinaryId) {
        await cloudinary.uploader.destroy(analysis.cloudinaryId);
      }

      await Analysis.findByIdAndDelete(id);

      res.json({ message: 'Analysis deleted successfully' });

    } catch (error) {
      console.error('Delete analysis error:', error);
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = AnalysisController;
