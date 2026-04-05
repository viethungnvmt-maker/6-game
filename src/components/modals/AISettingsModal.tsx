import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Save, Zap, AlertTriangle } from 'lucide-react';
import { AISettings } from '../../types';

interface AISettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AISettings;
  onSave: (settings: AISettings) => void;
}

const AISettingsModal: React.FC<AISettingsModalProps> = ({ isOpen, onClose, settings, onSave }) => {
  const [localSettings, setLocalSettings] = useState<AISettings>(settings);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(localSettings);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative bg-slate-900 border border-white/10 p-8 rounded-3xl max-w-md w-full shadow-2xl overflow-hidden"
          >
            {/* Background elements */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-black text-white flex items-center gap-2">
                <Zap className="text-yellow-400" /> CÀI ĐẶT AI
              </h3>
              <button 
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-white rounded-xl transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-400 mb-2 uppercase tracking-widest">
                  Gemini API Key
                </label>
                <input 
                  type="password"
                  value={localSettings.apiKey}
                  onChange={e => setLocalSettings({ ...localSettings, apiKey: e.target.value })}
                  placeholder="Nhập API Key ở đây..."
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
                <p className="mt-2 text-xs text-slate-500 italic">
                  * Khóa của bạn được lưu cục bộ trong trình duyệt.
                </p>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-400 mb-2 uppercase tracking-widest">
                  Mô hình ưu tiên
                </label>
                <select 
                  value={localSettings.model}
                  onChange={e => setLocalSettings({ ...localSettings, model: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none"
                >
                  <option value="gemini-2.0-flash">Gemini 2.0 Flash (Nhanh nhất)</option>
                  <option value="gemini-1.5-flash">Gemini 1.5 Flash (Ổn định)</option>
                  <option value="gemini-1.5-pro">Gemini 1.5 Pro (Thông minh nhất)</option>
                </select>
              </div>

              <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-2xl flex items-start gap-4">
                <AlertTriangle className="text-yellow-500 shrink-0" size={20} />
                <p className="text-xs text-yellow-200/70 leading-relaxed">
                  Hệ thống sẽ tự động chuyển đổi sang mô hình dự phòng nếu mô hình ưu tiên gặp lỗi hoặc hết hạn mức.
                </p>
              </div>

              <button 
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/20 group"
              >
                <Save size={20} className="group-hover:scale-110 transition-transform" /> 
                LƯU CÀI ĐẶT
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AISettingsModal;
