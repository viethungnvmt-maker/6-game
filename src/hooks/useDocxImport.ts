import { useState } from 'react';
import mammoth from 'mammoth';
import { Question } from '../types';

export function useDocxImport() {
  const [isImporting, setIsImporting] = useState(false);

  const importDocx = async (file: File): Promise<Question[]> => {
    setIsImporting(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      const text = result.value;

      // Simple heuristic for parsing questions from text:
      // Assuming format: Question text? A. opt1 B. opt2 C. opt3 D. opt4 (Correct: A)
      const questions: Question[] = [];
      const lines = text.split('\n').filter(l => l.trim());
      
      let currentQ: Partial<Question> = { options: [] };
      
      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.match(/^\d+\./) || trimmed.endsWith('?') || trimmed.toLowerCase().startsWith('câu')) {
          if (currentQ.text && currentQ.options?.length === 4) {
            questions.push({
              ...currentQ as Question,
              id: Math.random().toString(36).substr(2, 9),
              createdAt: Date.now()
            });
          }
          currentQ = { text: trimmed.replace(/^\d+\./, '').trim(), options: [], correctAnswer: 'A' };
        } else if (trimmed.match(/^[A-D][\.\:]/)) {
          currentQ.options?.push(trimmed.substring(2).trim());
        } else if (trimmed.toLowerCase().includes('đáp án:') || trimmed.toLowerCase().includes('correct:')) {
          const match = trimmed.match(/[A-D]/i);
          if (match) currentQ.correctAnswer = match[0].toUpperCase();
        }
      }

      // Add last question
      if (currentQ.text && currentQ.options?.length === 4) {
        questions.push({
          ...currentQ as Question,
          id: Math.random().toString(36).substr(2, 9),
          createdAt: Date.now()
        });
      }

      setIsImporting(false);
      return questions;
    } catch (error) {
      console.error('Lỗi khi parser file Word:', error);
      setIsImporting(false);
      throw new Error('Không thể xử lý file Word này. Hãy kiểm tra lại định dạng.');
    }
  };

  return { importDocx, isImporting };
}
