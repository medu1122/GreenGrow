const path = require('path');
const express = require('express');

module.exports = function serveUploads(app) {
  const uploadsPath = path.join(__dirname, '../../uploads');
  app.use('/public/uploads', express.static(uploadsPath));
};


