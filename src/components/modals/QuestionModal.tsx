import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Save, AlertCircle } from 'lucide-react';
import { Question } from '../../types';

interface QuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingQuestion: Question | null;
  onSave: (question: Question) => void;
}

const QuestionModal: React.FC<QuestionModalProps> = ({ isOpen, onClose, editingQuestion, onSave }) => {
  const [formData, setFormData] = useState<Partial<Question>>(
    editingQuestion || {
      text: '',
      options: ['', '', '', ''],
      correctAnswer: 'A',
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.text || !formData.options || formData.options.some(o => !o)) {
      alert('Vui lòng điền đầy đủ thông tin!');
      return;
    }
    
    const newQ: Question = {
      ...formData as Question,
      id: editingQuestion?.id || Math.random().toString(36).substr(2, 9),
      createdAt: editingQuestion?.createdAt || Date.now()
    };

    onSave(newQ);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
            className="relative bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800">
                {editingQuestion ? 'SỬA CÂU HỎI' : 'THÊM CÂU HỎI MỚI'}
              </h3>
              <button 
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-xl transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Nội dung câu hỏi</label>
                <textarea 
                  required
                  value={formData.text}
                  onChange={e => setFormData({ ...formData, text: e.target.value })}
                  placeholder="Nhập nội dung câu hỏi ở đây..."
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none h-32 transition-all"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {formData.options?.map((opt, i) => (
                  <div key={i}>
                    <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-widest">
                      ĐÁP ÁN {String.fromCharCode(65 + i)}
                    </label>
                    <input 
                      required
                      type="text"
                      value={opt}
                      onChange={e => {
                        const newOpts = [...(formData.options || [])];
                        newOpts[i] = e.target.value;
                        setFormData({ ...formData, options: newOpts });
                      }}
                      placeholder={`Lựa chọn ${String.fromCharCode(65 + i)}`}
                      className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    />
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Đáp án đúng</label>
                  <select 
                    value={formData.correctAnswer}
                    onChange={e => setFormData({ ...formData, correctAnswer: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500 transition-all appearance-none"
                  >
                    <option value="A">Lựa chọn A</option>
                    <option value="B">Lựa chọn B</option>
                    <option value="C">Lựa chọn C</option>
                    <option value="D">Lựa chọn D</option>
                  </select>
                </div>
                <div className="bg-blue-50 p-4 rounded-2xl flex items-start gap-4">
                  <AlertCircle className="text-blue-500 shrink-0" size={20} />
                  <p className="text-xs text-blue-700 leading-relaxed font-medium">
                    Lưu ý: Bạn có thể nhập nhanh bằng cách nhấn nút "Nhập AI" ở trang quản lý nếu có API Key.
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6">
                <button 
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 rounded-2xl font-bold text-gray-500 hover:bg-gray-100 transition-colors"
                >
                  HỦY
                </button>
                <button 
                  type="submit"
                  className="px-10 py-3 rounded-2xl font-bold bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/20 flex items-center gap-2 transition-all"
                >
                  <Save size={20} /> LƯU CÂU HỎI
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default QuestionModal;
