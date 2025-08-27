const Chat = require('../models/Chat');
const Analysis = require('../models/Analysis');

class ChatController {
  // Process user message and generate AI response
  static async processMessage(message, analysisId = null) {
    try {
      // Simple AI response logic - in production, you might use OpenAI API or similar
      const response = await this.generateAIResponse(message, analysisId);
      return response;
    } catch (error) {
      console.error('Chat processing error:', error);
      return 'Xin lỗi, tôi gặp vấn đề khi xử lý tin nhắn của bạn. Vui lòng thử lại sau.';
    }
  }

  // Generate AI response based on message content and context
  static async generateAIResponse(message, analysisId) {
    const lowerMessage = message.toLowerCase();
    
    // Get analysis context if available
    let analysis = null;
    if (analysisId) {
      analysis = await Analysis.findById(analysisId).lean();
    }

    // Handle different types of questions
    if (lowerMessage.includes('bệnh') || lowerMessage.includes('disease')) {
      return this.handleDiseaseQuestion(message, analysis);
    }
    
    if (lowerMessage.includes('điều trị') || lowerMessage.includes('treatment') || lowerMessage.includes('cách chữa')) {
      return this.handleTreatmentQuestion(message, analysis);
    }
    
    if (lowerMessage.includes('chăm sóc') || lowerMessage.includes('care') || lowerMessage.includes('nuôi trồng')) {
      return this.handleCareQuestion(message, analysis);
    }
    
    if (lowerMessage.includes('thời tiết') || lowerMessage.includes('weather')) {
      return this.handleWeatherQuestion(message, analysis);
    }
    
    if (lowerMessage.includes('phân bón') || lowerMessage.includes('fertilizer')) {
      return this.handleFertilizerQuestion(message, analysis);
    }
    
    if (lowerMessage.includes('tưới nước') || lowerMessage.includes('watering')) {
      return this.handleWateringQuestion(message, analysis);
    }

    // Default response
    return this.getDefaultResponse(message, analysis);
  }

  // Handle disease-related questions
  static handleDiseaseQuestion(message, analysis) {
    if (!analysis || !analysis.diseases || analysis.diseases.length === 0) {
      return `Dựa trên phân tích, cây của bạn có vẻ khỏe mạnh và không có dấu hiệu bệnh rõ ràng. Tuy nhiên, hãy chú ý đến các dấu hiệu sau:
      
🌱 **Dấu hiệu cây khỏe mạnh:**
- Lá xanh tươi, không có đốm vàng hoặc nâu
- Thân cây cứng cáp, không bị mềm
- Rễ phát triển tốt
- Cây phát triển đều đặn

🔍 **Cần theo dõi:**
- Thay đổi màu sắc lá
- Lá rụng bất thường
- Đốm đen hoặc trắng trên lá
- Thân cây bị thối

Bạn có thể chia sẻ thêm thông tin về tình trạng cụ thể của cây không?`;
    }

    const diseases = analysis.diseases;
    let response = `🔍 **Kết quả phân tích bệnh:**\n\n`;

    diseases.forEach((disease, index) => {
      response += `**${index + 1}. ${disease.name}**\n`;
      response += `- Độ tin cậy: ${disease.confidence}%\n`;
      response += `- Mức độ nghiêm trọng: ${this.getSeverityText(disease.severity)}\n`;
      
      if (disease.description) {
        response += `- Mô tả: ${disease.description}\n`;
      }
      
      if (disease.symptoms && disease.symptoms.length > 0) {
        response += `- Triệu chứng: ${disease.symptoms.join(', ')}\n`;
      }
      
      response += '\n';
    });

    response += `💡 **Khuyến nghị:** Hãy tham khảo phần điều trị để biết cách chữa bệnh cụ thể.`;
    
    return response;
  }

  // Handle treatment-related questions
  static handleTreatmentQuestion(message, analysis) {
    if (!analysis || !analysis.diseases || analysis.diseases.length === 0) {
      return `Cây của bạn hiện tại khỏe mạnh! Để duy trì sức khỏe tốt, hãy:

🌿 **Chăm sóc phòng bệnh:**
- Tưới nước đều đặn, không để úng nước
- Đảm bảo ánh sáng phù hợp
- Bón phân định kỳ
- Kiểm tra sâu bệnh thường xuyên
- Cắt tỉa lá già, bệnh

🌱 **Dinh dưỡng:**
- Sử dụng phân hữu cơ
- Bổ sung vi lượng khi cần
- Không bón quá nhiều phân

Bạn có cần tư vấn về cách chăm sóc cụ thể cho loại cây này không?`;
    }

    const diseases = analysis.diseases;
    let response = `💊 **Hướng dẫn điều trị:**\n\n`;

    diseases.forEach((disease, index) => {
      response += `**${disease.name}** (${this.getSeverityText(disease.severity)})\n`;
      
      if (disease.treatments && disease.treatments.length > 0) {
        response += `**Cách điều trị:**\n`;
        disease.treatments.forEach((treatment, tIndex) => {
          response += `${tIndex + 1}. ${treatment}\n`;
        });
      } else {
        response += `**Cách điều trị chung:**\n`;
        response += `1. Cách ly cây bệnh khỏi cây khỏe\n`;
        response += `2. Cắt bỏ phần bị bệnh\n`;
        response += `3. Sử dụng thuốc trừ bệnh phù hợp\n`;
        response += `4. Cải thiện điều kiện môi trường\n`;
      }
      
      response += '\n';
    });

    response += `⚠️ **Lưu ý:** Luôn đọc kỹ hướng dẫn sử dụng thuốc và đeo đồ bảo hộ khi phun thuốc.`;
    
    return response;
  }

  // Handle care-related questions
  static handleCareQuestion(message, analysis) {
    const plantName = analysis?.plantName || 'cây trồng';
    
    return `🌱 **Hướng dẫn chăm sóc ${plantName}:**\n\n

💧 **Tưới nước:**
- Tưới khi đất khô 2-3cm bề mặt
- Không để úng nước
- Tưới vào sáng sớm hoặc chiều tối
- Sử dụng nước sạch, không có clo

☀️ **Ánh sáng:**
- Đặt cây ở nơi có ánh sáng gián tiếp
- Tránh ánh nắng trực tiếp mạnh
- Xoay chậu định kỳ để cây phát triển đều

🌡️ **Nhiệt độ:**
- Nhiệt độ lý tưởng: 18-25°C
- Tránh nhiệt độ quá cao hoặc quá thấp
- Bảo vệ khỏi gió lạnh

🌿 **Dinh dưỡng:**
- Bón phân 2-4 tuần/lần trong mùa sinh trưởng
- Giảm bón phân vào mùa đông
- Sử dụng phân hữu cơ hoặc phân bón chậm tan

🔄 **Cắt tỉa:**
- Loại bỏ lá già, bệnh
- Cắt tỉa để tạo hình dáng đẹp
- Khử trùng dụng cụ cắt tỉa

Bạn có cần tư vấn thêm về khía cạnh nào không?`;
  }

  // Handle weather-related questions
  static handleWeatherQuestion(message, analysis) {
    if (!analysis || !analysis.weatherData) {
      return `🌤️ **Thông tin thời tiết:**\n\n
Hiện tại tôi không có thông tin thời tiết cho vị trí của bạn. Để có thông tin chính xác:

1. **Bật định vị** khi phân tích cây
2. **Kiểm tra thời tiết** tại địa phương
3. **Điều chỉnh chăm sóc** theo điều kiện thời tiết

**Lưu ý chung:**
- Tưới nhiều hơn khi trời nóng, khô
- Giảm tưới khi trời mưa, ẩm
- Bảo vệ cây khỏi gió mạnh
- Che chắn khi nhiệt độ quá cao/thấp`;
    }

    const weather = analysis.weatherData;
    return `🌤️ **Thời tiết hiện tại tại ${weather.location}:**\n\n

🌡️ **Nhiệt độ:** ${weather.temperature}°C
💧 **Độ ẩm:** ${weather.humidity}%
☁️ **Thời tiết:** ${weather.description}

💡 **Khuyến nghị chăm sóc:**
${this.getWeatherCareAdvice(weather.temperature, weather.humidity)}`;
  }

  // Handle fertilizer questions
  static handleFertilizerQuestion(message, analysis) {
    const plantName = analysis?.plantName || 'cây trồng';
    
    return `🌿 **Hướng dẫn bón phân cho ${plantName}:**\n\n

📅 **Lịch bón phân:**
- **Mùa xuân-hè:** Bón 2-4 tuần/lần
- **Mùa thu:** Giảm xuống 4-6 tuần/lần  
- **Mùa đông:** Ngừng bón hoặc bón rất ít

🌱 **Loại phân phù hợp:**
- **Phân hữu cơ:** Phân chuồng, phân trùn quế
- **Phân NPK:** 20-20-20 cho cây lá, 10-30-20 cho cây hoa
- **Phân vi lượng:** Bổ sung khi cần

⚖️ **Liều lượng:**
- Tuân theo hướng dẫn trên bao bì
- Bón ít hơn khuyến nghị 20-30%
- Không bón phân khi cây bị bệnh

💧 **Cách bón:**
- Tưới nước trước khi bón
- Rải phân đều quanh gốc
- Tưới nước sau khi bón
- Tránh để phân dính vào lá

⚠️ **Lưu ý:**
- Không bón phân quá liều
- Ngừng bón khi cây có dấu hiệu bất thường
- Sử dụng phân chất lượng tốt`;
  }

  // Handle watering questions
  static handleWateringQuestion(message, analysis) {
    const plantName = analysis?.plantName || 'cây trồng';
    
    return `💧 **Hướng dẫn tưới nước cho ${plantName}:**\n\n

⏰ **Tần suất tưới:**
- **Mùa hè:** 1-2 lần/ngày
- **Mùa xuân/thu:** 2-3 lần/tuần
- **Mùa đông:** 1-2 lần/tuần

🌡️ **Điều kiện tưới:**
- Kiểm tra độ ẩm đất trước khi tưới
- Tưới khi đất khô 2-3cm bề mặt
- Không tưới khi đất còn ẩm

💧 **Lượng nước:**
- Tưới đủ ẩm, không úng nước
- Nước chảy ra lỗ thoát nước
- Để ráo nước hoàn toàn

⏰ **Thời gian tưới:**
- **Sáng sớm:** 6-8h (tốt nhất)
- **Chiều tối:** 17-19h
- Tránh tưới giữa trưa nắng

🌱 **Cách tưới:**
- Tưới vào gốc, tránh lá
- Sử dụng bình tưới có vòi nhỏ
- Tưới từ từ, đều đặn

⚠️ **Lưu ý:**
- Không tưới quá nhiều gây úng rễ
- Điều chỉnh theo điều kiện thời tiết
- Quan sát phản ứng của cây`;
  }

  // Get default response
  static getDefaultResponse(message, analysis) {
    const plantName = analysis?.plantName || 'cây trồng';
    
    return `🌱 **Xin chào! Tôi là AI Assistant chuyên về cây trồng.**\n\n

Tôi có thể giúp bạn với các vấn đề về ${plantName}:

🔍 **Phân tích bệnh:** Hỏi về bệnh và triệu chứng
💊 **Điều trị:** Hướng dẫn cách chữa bệnh
🌿 **Chăm sóc:** Tư vấn nuôi trồng
🌤️ **Thời tiết:** Ảnh hưởng thời tiết
🌱 **Phân bón:** Hướng dẫn bón phân
💧 **Tưới nước:** Kỹ thuật tưới nước

Bạn muốn tư vấn về vấn đề gì? Hãy đặt câu hỏi cụ thể để tôi có thể giúp bạn tốt nhất!`;
  }

  // Get severity text in Vietnamese
  static getSeverityText(severity) {
    const severityMap = {
      'low': 'Nhẹ',
      'medium': 'Trung bình', 
      'high': 'Nặng',
      'critical': 'Nghiêm trọng'
    };
    return severityMap[severity] || 'Không xác định';
  }

  // Get weather care advice
  static getWeatherCareAdvice(temperature, humidity) {
    let advice = '';
    
    if (temperature > 30) {
      advice += '🌡️ **Nhiệt độ cao:** Tưới nhiều hơn, che nắng\n';
    } else if (temperature < 15) {
      advice += '❄️ **Nhiệt độ thấp:** Giảm tưới, bảo vệ khỏi lạnh\n';
    }
    
    if (humidity > 80) {
      advice += '💧 **Độ ẩm cao:** Giảm tưới, tăng thông gió\n';
    } else if (humidity < 40) {
      advice += '🌵 **Độ ẩm thấp:** Tăng tưới, phun sương\n';
    }
    
    return advice || '🌤️ **Thời tiết thuận lợi:** Duy trì chế độ chăm sóc bình thường';
  }

  // Create or get chat session
  static async createOrGetChat(userId, analysisId = null) {
    try {
      let chat = await Chat.findOne({
        user: userId,
        analysis: analysisId,
        isActive: true
      });

      if (!chat) {
        chat = new Chat({
          user: userId,
          analysis: analysisId,
          title: analysisId ? 'Chat về phân tích cây' : 'Chat mới'
        });
        await chat.save();
      }

      return chat;
    } catch (error) {
      console.error('Create/get chat error:', error);
      throw error;
    }
  }

  // Get chat history
  static async getChatHistory(userId, chatId) {
    try {
      const chat = await Chat.findOne({
        _id: chatId,
        user: userId
      }).populate('analysis', 'plantName imageUrl');

      if (!chat) {
        throw new Error('Chat not found');
      }

      return chat;
    } catch (error) {
      console.error('Get chat history error:', error);
      throw error;
    }
  }

  // Get user's chats
  static async getUserChats(userId, page = 1, limit = 10) {
    try {
      const chats = await Chat.find({ user: userId })
        .sort({ lastActivity: -1 })
        .limit(limit)
        .skip((page - 1) * limit)
        .populate('analysis', 'plantName imageUrl')
        .lean();

      const total = await Chat.countDocuments({ user: userId });

      return {
        chats,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        total
      };
    } catch (error) {
      console.error('Get user chats error:', error);
      throw error;
    }
  }
}

module.exports = ChatController;
