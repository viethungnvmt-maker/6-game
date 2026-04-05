import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit, 
  Download, 
  Upload, 
  ChevronLeft, 
  Search, 
  Filter,
  FileText,
  Zap
} from 'lucide-react';
import { motion } from 'motion/react';
import { Question } from '../../types';

interface QuestionManagerProps {
  questions: Question[];
  onBack: () => void;
  onAdd: () => void;
  onEdit: (q: Question) => void;
  onDelete: (id: string) => void;
  onImportDocx: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onImportJson: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onExport: () => void;
  onGenerateAI: () => void;
  hasAIKey: boolean;
}

const QuestionManager: React.FC<QuestionManagerProps> = ({ 
  questions, onBack, onAdd, onEdit, onDelete, onImportDocx, onImportJson, onExport, onGenerateAI, hasAIKey 
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredQuestions = questions.filter(q => 
    q.text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-950 p-6 md:p-12 flex flex-col items-center">
      <div className="w-full max-w-7xl mb-8 flex justify-between items-center">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic">Kho dữ liệu câu hỏi</h2>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Tổng cộng: {questions.length} câu</p>
        </motion.div>
        
        <div className="flex gap-4">
          <button 
            onClick={onGenerateAI}
            disabled={!hasAIKey}
            className={`px-6 py-3 rounded-2xl flex items-center gap-2 font-black text-xs transition-all shadow-lg ${
              hasAIKey 
                ? 'bg-yellow-400 text-indigo-900 hover:bg-yellow-300 shadow-yellow-400/20' 
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-white/5'
            }`}
          >
            <Zap size={18} /> TẠO BẰNG AI
          </button>
          <button 
            onClick={onAdd}
            className="bg-blue-600 text-white px-6 py-3 rounded-2xl flex items-center gap-2 font-black text-xs hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20"
          >
            <Plus size={18} /> THÊM MỚI
          </button>
        </div>
      </div>

      <main className="w-full max-w-7xl bg-slate-900/50 backdrop-blur-md rounded-[3rem] shadow-2xl border border-white/5 overflow-hidden">
        <div className="p-8 border-b border-white/5 bg-white/5 flex flex-wrap gap-6 items-center">
          <div className="relative flex-1 min-w-[300px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
            <input 
              type="text" 
              placeholder="Tìm kiếm nội dung câu hỏi..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950/50 text-white pl-12 pr-6 py-4 rounded-2xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
          
          <div className="flex gap-3">
            <label className="bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 px-6 py-3 rounded-2xl flex items-center gap-2 hover:bg-emerald-600/30 transition-all cursor-pointer font-black text-xs shadow-lg">
              <Plus size={18} /> NHẬP ĐỀ (DOCX)
              <input type="file" accept=".docx" className="hidden" onChange={onImportDocx} />
            </label>
            <label className="bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 px-6 py-3 rounded-2xl flex items-center gap-2 hover:bg-indigo-600/30 transition-all cursor-pointer font-black text-xs shadow-lg">
              <Upload size={18} /> NHẬP JSON
              <input type="file" accept=".json" className="hidden" onChange={onImportJson} />
            </label>
            <button 
              onClick={onExport}
              className="bg-white/5 text-white border border-white/10 px-6 py-3 rounded-2xl flex items-center gap-2 hover:bg-white/10 transition-all font-black text-xs"
            >
              <Download size={18} /> XUẤT FILE
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-950/50 border-b border-white/5 uppercase text-[10px] tracking-[0.3em] text-slate-500 font-black">
              <tr>
                <th className="px-8 py-6">Nội dung câu hỏi</th>
                <th className="px-8 py-6 text-center">Đáp án</th>
                <th className="px-8 py-6 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredQuestions.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-8 py-20 text-center text-slate-600 font-bold italic">
                    {searchTerm ? 'Không tìm thấy câu hỏi nào phù hợp.' : 'Kho câu hỏi trống. Hãy thêm câu hỏi hoặc nhập từ file.'}
                  </td>
                </tr>
              ) : (
                filteredQuestions.map(q => (
                  <tr key={q.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-8 py-8">
                      <div className="font-bold text-white line-clamp-2 leading-relaxed text-lg mb-4">
                        {q.text}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {q.options.map((opt, i) => {
                          const isCorrect = String.fromCharCode(65 + i) === q.correctAnswer;
                          return (
                            <span key={i} className={`text-[10px] px-3 py-1 rounded-lg border font-black uppercase tracking-wider ${
                              isCorrect 
                                ? 'bg-green-500/10 border-green-500/30 text-green-400' 
                                : 'bg-slate-950 border-white/10 text-slate-500'
                            }`}>
                              {String.fromCharCode(65 + i)}. {opt}
                            </span>
                          );
                        })}
                      </div>
                    </td>
                    <td className="px-8 py-8">
                      <div className="flex justify-center">
                        <span className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black text-xl shadow-lg shadow-blue-600/20 uppercase">
                          {q.correctAnswer}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-8 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                        <button 
                          onClick={() => onEdit(q)}
                          className="p-3 text-blue-400 hover:bg-blue-400/10 rounded-2xl transition-all"
                          title="Sửa"
                        >
                          <Edit size={20} />
                        </button>
                        <button 
                          onClick={() => onDelete(q.id)}
                          className="p-3 text-rose-500 hover:bg-rose-500/10 rounded-2xl transition-all"
                          title="Xóa"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
      
      <p className="max-w-7xl mx-auto mt-8 text-center text-gray-400 text-sm font-medium">
        Tổng số: <span className="text-gray-900 font-bold">{questions.length}</span> câu hỏi
      </p>
    </div>
  );
};

export default QuestionManager;
