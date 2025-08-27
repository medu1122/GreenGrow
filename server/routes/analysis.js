const express = require('express');
const router = express.Router();
const AnalysisController = require('../controllers/analysisController');
const auth = require('../middleware/auth');

// Apply auth middleware to all routes
router.use(auth);

// Create new analysis
router.post('/', AnalysisController.createAnalysis);

// Get analysis by ID
router.get('/:id', AnalysisController.getAnalysis);

// Get user's analyses
router.get('/', AnalysisController.getUserAnalyses);

// Delete analysis
router.delete('/:id', AnalysisController.deleteAnalysis);

module.exports = router;
