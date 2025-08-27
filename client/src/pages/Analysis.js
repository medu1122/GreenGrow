import React from 'react';
import { Camera, Upload } from 'lucide-react';

const Analysis = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Phân tích cây trồng</h1>
          <p className="text-gray-600">Upload ảnh cây trồng để nhận diện và phát hiện bệnh</p>
        </div>

        <div className="card">
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Camera className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Chụp ảnh hoặc upload ảnh cây trồng
            </h2>
            <p className="text-gray-600 mb-6">
              Hệ thống sẽ phân tích và cho bạn biết loại cây và tình trạng sức khỏe
            </p>
            
            <div className="space-y-4">
              <button className="btn-primary flex items-center justify-center space-x-2 mx-auto">
                <Camera className="w-5 h-5" />
                <span>Chụp ảnh</span>
              </button>
              
              <button className="btn-secondary flex items-center justify-center space-x-2 mx-auto">
                <Upload className="w-5 h-5" />
                <span>Upload ảnh</span>
              </button>
            </div>

            <div className="mt-8 text-sm text-gray-500">
              <p>Hỗ trợ: JPG, PNG, GIF (tối đa 10MB)</p>
              <p>Để có kết quả tốt nhất, hãy chụp ảnh rõ nét và đủ ánh sáng</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analysis;
