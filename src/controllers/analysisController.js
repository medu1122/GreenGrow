const path = require('path');
const fs = require('fs');
const multer = require('multer');
const { analyzePlantImage } = require('../services/aiService');

const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname) || '.jpg';
    cb(null, `plant-${unique}${ext}`);
  },
});

function fileFilter(req, file, cb) {
  const allowed = ['image/jpeg', 'image/png', 'image/webp'];
  if (!allowed.includes(file.mimetype)) {
    return cb(new Error('Chỉ chấp nhận file ảnh JPG, PNG, WEBP'));
  }
  cb(null, true);
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 8 * 1024 * 1024 },
});

exports.uploadMiddleware = upload.single('image');

exports.analyzeImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).render('upload', { error: 'Vui lòng chọn ảnh cây để phân tích.' });
    }

    const imagePath = req.file.path;
    const analysis = await analyzePlantImage(imagePath);

    return res.render('result', { analysis, imageUrl: `/public/uploads/${path.basename(imagePath)}` });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    return res.status(500).render('upload', { error: 'Có lỗi xảy ra khi phân tích ảnh. Vui lòng thử lại.' });
  }
};


