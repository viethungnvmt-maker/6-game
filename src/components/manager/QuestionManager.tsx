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
    <div className="min-h-screen bg-gray-50 p-8">
      <header className="max-w-7xl mx-auto flex justify-between items-center mb-12">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 font-bold transition-colors group"
        >
          <ChevronLeft className="group-hover:-translate-x-1 transition-transform" size={24} /> 
          TRANG CHỦ
        </button>
        <h2 className="text-4xl font-black text-gray-800 tracking-tighter">QUẢN LÝ CÂU HỎI</h2>
        <div className="flex gap-3">
          <button 
            onClick={onGenerateAI}
            disabled={!hasAIKey}
            className={`px-6 py-3 rounded-2xl flex items-center gap-2 font-bold transition-all shadow-lg ${
              hasAIKey 
                ? 'bg-yellow-400 text-indigo-900 hover:bg-yellow-300 shadow-yellow-400/20' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <Zap size={20} /> TẠO BẰNG AI
          </button>
          <button 
            onClick={onAdd}
            className="bg-blue-600 text-white px-6 py-3 rounded-2xl flex items-center gap-2 font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
          >
            <Plus size={20} /> THÊM MỚI
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8 border-b border-gray-100 bg-gray-50/50 flex flex-wrap gap-6 items-center">
          <div className="relative flex-1 min-w-[300px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Tìm kiếm nội dung câu hỏi..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-6 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
          
          <div className="flex gap-2">
            <label className="bg-emerald-600 text-white px-6 py-3 rounded-2xl flex items-center gap-2 hover:bg-emerald-700 transition-all cursor-pointer font-bold shadow-lg shadow-emerald-600/10">
              <FileText size={20} /> NHẬP ĐỀ (DOCX)
              <input type="file" accept=".docx" className="hidden" onChange={onImportDocx} />
            </label>
            <label className="bg-indigo-600 text-white px-6 py-3 rounded-2xl flex items-center gap-2 hover:bg-indigo-700 transition-all cursor-pointer font-bold shadow-lg shadow-indigo-600/10">
              <Upload size={20} /> NHẬP JSON
              <input type="file" accept=".json" className="hidden" onChange={onImportJson} />
            </label>
            <button 
              onClick={onExport}
              className="bg-gray-800 text-white px-6 py-3 rounded-2xl flex items-center gap-2 hover:bg-black transition-all font-bold shadow-lg"
            >
              <Download size={20} /> XUẤT FILE
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/80 border-b border-gray-100 uppercase text-xs tracking-widest text-gray-500 font-black">
              <tr>
                <th className="px-8 py-6">Nội dung câu hỏi</th>
                <th className="px-8 py-6">Đáp án đúng</th>
                <th className="px-8 py-6 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredQuestions.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-8 py-20 text-center text-gray-400 italic">
                    {searchTerm ? 'Không tìm thấy câu hỏi nào phù hợp.' : 'Kho câu hỏi trống. Hãy thêm câu hỏi hoặc nhập từ file.'}
                  </td>
                </tr>
              ) : (
                filteredQuestions.map(q => (
                  <tr key={q.id} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="font-medium text-gray-800 line-clamp-2 leading-relaxed">
                        {q.text}
                      </div>
                      <div className="flex gap-2 mt-2">
                        {q.options.map((opt, i) => (
                          <span key={i} className={`text-[10px] px-2 py-0.5 rounded-md border ${
                            String.fromCharCode(65 + i) === q.correctAnswer 
                              ? 'bg-green-50 border-green-200 text-green-700 font-bold' 
                              : 'bg-gray-50 border-gray-200 text-gray-400'
                          }`}>
                            {String.fromCharCode(65 + i)}. {opt}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="w-10 h-10 rounded-xl bg-green-100 text-green-700 flex items-center justify-center font-black text-xl">
                        {q.correctAnswer}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => onEdit(q)}
                          className="p-3 text-blue-600 hover:bg-white hover:shadow-md rounded-2xl transition-all"
                          title="Sửa"
                        >
                          <Edit size={20} />
                        </button>
                        <button 
                          onClick={() => onDelete(q.id)}
                          className="p-3 text-red-600 hover:bg-white hover:shadow-md rounded-2xl transition-all"
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
