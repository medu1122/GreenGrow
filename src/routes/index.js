const express = require('express');
const router = express.Router();

const analysisController = require('../controllers/analysisController');

router.get('/', (req, res) => {
  res.render('upload');
});

router.post('/analyze', analysisController.uploadMiddleware, analysisController.analyzeImage);

module.exports = router;


