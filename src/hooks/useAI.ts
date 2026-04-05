import { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { AISettings, Question } from '../types';

export function useAI() {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateQuestions = async (settings: AISettings, promptText: string): Promise<Question[]> => {
    if (!settings.apiKey) {
      throw new Error('Thiếu API Key cho Gemini!');
    }

    setIsGenerating(true);
    const genAI = new GoogleGenerativeAI(settings.apiKey);
    
    // Fallback models order
    const models = [settings.model, 'gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-1.5-pro'];
    const uniqueModels = Array.from(new Set(models));

    let lastError = null;

    for (const modelName of uniqueModels) {
      try {
        console.log(`Đang thử model: ${modelName}`);
        const model = genAI.getGenerativeModel({ model: modelName });
        
        const systemPrompt = `
          Bạn là chuyên gia soạn thảo câu hỏi trắc nghiệm giáo dục. 
          Hãy tạo ra 10 câu hỏi trắc nghiệm dựa trên chủ đề sau.
          Yêu cầu định dạng trả về là JSON array, mỗi đối tượng có:
          - text: nội dung câu hỏi
          - options: mảng 4 lựa chọn [A, B, C, D]
          - correctAnswer: "A", "B", "C", hoặc "D"
          
          Chỉ trả về JSON, không thêm văn bản giải thích.
        `;

        const result = await model.generateContent([systemPrompt, promptText]);
        const response = await result.response;
        const text = response.text();
        
        // Clean JSON from markdown if exists
        const jsonMatch = text.match(/\[[\s\S]*\]/);
        if (!jsonMatch) throw new Error('Không tìm thấy JSON hợp lệ trong phản hồi.');
        
        const questions: Question[] = JSON.parse(jsonMatch[0]);
        setIsGenerating(false);
        return questions.map(q => ({
          ...q,
          id: Math.random().toString(36).substr(2, 9),
          createdAt: Date.now()
        }));

      } catch (error) {
        console.warn(`Lỗi với model ${modelName}:`, error);
        lastError = error;
        continue; // Try next model
      }
    }

    setIsGenerating(false);
    throw lastError || new Error('Tất cả các mô hình AI đều thất bại.');
  };

  return { generateQuestions, isGenerating };
}
