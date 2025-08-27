import React from 'react';
import { Link } from 'react-router-dom';
import { BarChart3, Leaf, MessageCircle, Camera } from 'lucide-react';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Chào mừng bạn đến với PlantAI Dashboard</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                <Leaf className="w-6 h-6 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tổng phân tích</p>
                <p className="text-2xl font-bold text-gray-900">0</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Cây khỏe mạnh</p>
                <p className="text-2xl font-bold text-gray-900">0</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Cây bị bệnh</p>
                <p className="text-2xl font-bold text-gray-900">0</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Camera className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Chat sessions</p>
                <p className="text-2xl font-bold text-gray-900">0</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Phân tích gần đây</h2>
            <div className="text-center py-8">
              <Leaf className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Chưa có phân tích nào</p>
              <Link to="/analysis" className="btn-primary mt-4 inline-block">
                Bắt đầu phân tích
              </Link>
            </div>
          </div>

          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Chat gần đây</h2>
            <div className="text-center py-8">
              <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Chưa có cuộc trò chuyện nào</p>
              <Link to="/chat" className="btn-primary mt-4 inline-block">
                Bắt đầu chat
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
