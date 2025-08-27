import React from 'react';
import { useParams } from 'react-router-dom';
import { Leaf, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const AnalysisDetail = () => {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link to="/analysis" className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại phân tích
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Chi tiết phân tích</h1>
          <p className="text-gray-600">ID: {id}</p>
        </div>

        <div className="card">
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Leaf className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Chi tiết phân tích
            </h2>
            <p className="text-gray-600 mb-6">
              Thông tin chi tiết về kết quả phân tích cây trồng
            </p>
            
            <div className="text-sm text-gray-500">
              <p>Trang này sẽ hiển thị kết quả phân tích chi tiết</p>
              <p>Bao gồm: loại cây, bệnh, cách điều trị, v.v.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisDetail;
