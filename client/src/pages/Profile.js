import React from 'react';
import { User, Settings } from 'lucide-react';

const Profile = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Hồ sơ cá nhân</h1>
          <p className="text-gray-600">Quản lý thông tin tài khoản của bạn</p>
        </div>

        <div className="card">
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <User className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Thông tin cá nhân
            </h2>
            <p className="text-gray-600 mb-6">
              Cập nhật thông tin hồ sơ và cài đặt tài khoản
            </p>
            
            <button className="btn-primary flex items-center justify-center space-x-2 mx-auto">
              <Settings className="w-5 h-5" />
              <span>Cập nhật hồ sơ</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
