import React from 'react';
import { MessageCircle, Send } from 'lucide-react';

const Chat = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">AI Chat Assistant</h1>
          <p className="text-gray-600">Hỏi đáp về cây trồng, bệnh và cách điều trị</p>
        </div>

        <div className="card h-96 flex flex-col">
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-primary-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                Bắt đầu cuộc trò chuyện
              </h2>
              <p className="text-gray-600 mb-4">
                Hỏi tôi về cây trồng, bệnh và cách chăm sóc
              </p>
            </div>
          </div>

          <div className="border-t border-gray-200 p-4">
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Nhập câu hỏi của bạn..."
                className="flex-1 input-field"
              />
              <button className="btn-primary">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
