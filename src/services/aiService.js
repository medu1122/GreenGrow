const fs = require('fs');
const axios = require('axios');

const HUGGING_FACE_SPECIES_ENDPOINT = process.env.HF_SPECIES_ENDPOINT || process.env.HF_ENDPOINT || '';
const HUGGING_FACE_DISEASE_ENDPOINT = process.env.HF_DISEASE_ENDPOINT || '';
const HUGGING_FACE_TOKEN = process.env.HF_TOKEN || '';

async function callHuggingFace(endpoint, imageBuffer) {
  if (!endpoint || !HUGGING_FACE_TOKEN) {
    throw new Error('HF config missing');
  }
  const resp = await axios.post(
    endpoint,
    imageBuffer,
    {
      headers: {
        Authorization: `Bearer ${HUGGING_FACE_TOKEN}`,
        'Content-Type': 'application/octet-stream',
      },
      timeout: 20000,
    }
  );
  return resp.data;
}

function mockAnalysis() {
  return {
    species: 'Tomato (Solanum lycopersicum)',
    disease: 'Early Blight (Alternaria solani) – nghi ngờ',
    confidence: 0.72,
    recommendations: [
      'Cắt bỏ lá bị bệnh, tiêu hủy đúng cách',
      'Giữ tán lá khô, tưới gốc thay vì tưới lá',
      'Xoay vòng cây trồng và cải thiện thoát nước',
      'Có thể dùng thuốc gốc đồng theo hướng dẫn địa phương',
    ],
  };
}

function normalizeClassification(hfData) {
  // Example normalization. Adjust based on your chosen model's output.
  if (Array.isArray(hfData) && hfData.length > 0) {
    const top = hfData[0];
    return {
      species: top.label || 'Unknown plant',
      confidence: top.score || 0.5,
    };
  }
  return { species: 'Unknown', confidence: 0.0 };
}

exports.analyzePlantImage = async (imagePath) => {
  const buffer = fs.readFileSync(imagePath);
  try {
    // Species classification
    let species = 'Unknown';
    let speciesConfidence = 0.0;
    if (HUGGING_FACE_SPECIES_ENDPOINT) {
      try {
        const speciesRaw = await callHuggingFace(HUGGING_FACE_SPECIES_ENDPOINT, buffer);
        const s = normalizeClassification(speciesRaw);
        species = s.species;
        speciesConfidence = s.confidence;
      } catch (_) {
        // ignore species error, fallback later
      }
    }

    // Disease classification
    let disease = 'Không rõ bệnh';
    let diseaseConfidence = 0.0;
    if (HUGGING_FACE_DISEASE_ENDPOINT) {
      try {
        const diseaseRaw = await callHuggingFace(HUGGING_FACE_DISEASE_ENDPOINT, buffer);
        const d = normalizeClassification(diseaseRaw);
        disease = d.species; // using same normalizer: label→name
        diseaseConfidence = d.confidence;
      } catch (_) {
        // ignore disease error
      }
    }

    // Thresholding
    const SPECIES_THRESHOLD = Number(process.env.SPECIES_THRESHOLD || 0.55);
    const DISEASE_THRESHOLD = Number(process.env.DISEASE_THRESHOLD || 0.60);

    const finalSpecies = speciesConfidence >= SPECIES_THRESHOLD ? species : 'Không xác định (thiếu độ tin cậy)';
    const finalDisease = diseaseConfidence >= DISEASE_THRESHOLD ? disease : 'Không rõ bệnh';

    const recommendations = buildRecommendations(finalDisease, finalSpecies);

    return {
      species: finalSpecies,
      disease: finalDisease,
      confidence: Math.max(speciesConfidence, diseaseConfidence),
      recommendations,
    };
  } catch (e) {
    return mockAnalysis();
  }
};

function buildRecommendations(diseaseName, speciesName) {
  const recs = [];
  if (diseaseName.toLowerCase().includes('blight') || /bệnh/i.test(diseaseName)) {
    recs.push('Cắt bỏ phần bị bệnh và tiêu hủy an toàn');
    recs.push('Tránh làm ướt lá, tưới vào gốc');
  }
  if (/tomato|cà chua|Solanum lycopersicum/i.test(speciesName)) {
    recs.push('Duy trì khoảng cách cây đủ thoáng cho cà chua');
  }
  if (recs.length === 0) {
    recs.push('Theo dõi thêm 48-72 giờ để xác nhận triệu chứng');
    recs.push('Cải thiện thông thoáng, tránh úng nước');
  }
  return recs;
}


