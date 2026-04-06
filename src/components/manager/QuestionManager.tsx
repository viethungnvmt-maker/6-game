import React, { useState } from 'react';
import { 
  Plus, Trash2, Edit, Download, Upload, Search, Zap,
  BookOpen, GraduationCap, School, ChevronLeft, Settings, Timer, Users
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Question, Subject, Topic, ClassRoom, GameSettings } from '../../types';

type Tab = 'questions' | 'subjects' | 'import' | 'classes' | 'settings';

interface QuestionManagerProps {
  questions: Question[];
  subjects: Subject[];
  classRooms: ClassRoom[];
  gameSettings: GameSettings;
  onBack: () => void;
  onAdd: () => void;
  onEdit: (q: Question) => void;
  onDelete: (id: string) => void;
  onImportDocx: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onImportJson: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onExport: () => void;
  onGenerateAI: () => void;
  hasAIKey: boolean;
  onSubjectsChange: (s: Subject[]) => void;
  onClassRoomsChange: (c: ClassRoom[]) => void;
  onGameSettingsChange: (g: GameSettings) => void;
}

const PRESET_COLORS = [
  '#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#a855f7',
  '#ec4899', '#14b8a6', '#f97316', '#6366f1', '#64748b'
];

const QuestionManager: React.FC<QuestionManagerProps> = ({ 
  questions, subjects, classRooms, gameSettings,
  onBack, onAdd, onEdit, onDelete, 
  onImportDocx, onImportJson, onExport, onGenerateAI, hasAIKey,
  onSubjectsChange, onClassRoomsChange, onGameSettingsChange
}) => {
  const [activeTab, setActiveTab] = useState<Tab>('questions');
  const [searchTerm, setSearchTerm] = useState('');

  // Subject form
  const [subjectName, setSubjectName] = useState('');
  const [subjectColor, setSubjectColor] = useState(PRESET_COLORS[0]);
  const [editingSubjectId, setEditingSubjectId] = useState<string | null>(null);

  // Topic form
  const [topicSubjectId, setTopicSubjectId] = useState('');
  const [topicName, setTopicName] = useState('');

  // Class form
  const [className, setClassName] = useState('');
  const [editingClassId, setEditingClassId] = useState<string | null>(null);
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [studentName, setStudentName] = useState('');

  const filteredQuestions = questions.filter(q => 
    q.text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'questions', label: `Câu hỏi (${questions.length})`, icon: <BookOpen size={16} /> },
    { id: 'subjects', label: 'Môn học & Chủ đề', icon: <GraduationCap size={16} /> },
    { id: 'import', label: 'Nhập / Xuất', icon: <Upload size={16} /> },
    { id: 'classes', label: 'Lớp học', icon: <School size={16} /> },
    { id: 'settings', label: 'Cài đặt Game', icon: <Settings size={16} /> },
  ];

  // === Subject handlers ===
  const handleSaveSubject = () => {
    if (!subjectName.trim()) return;
    if (editingSubjectId) {
      onSubjectsChange(subjects.map(s => s.id === editingSubjectId ? { ...s, name: subjectName, color: subjectColor } : s));
      setEditingSubjectId(null);
    } else {
      onSubjectsChange([...subjects, { id: Date.now().toString(), name: subjectName, color: subjectColor, topics: [] }]);
    }
    setSubjectName(''); setSubjectColor(PRESET_COLORS[0]);
  };

  const handleDeleteSubject = (id: string) => {
    if (!confirm('Xóa môn học này và tất cả chủ đề bên trong?')) return;
    onSubjectsChange(subjects.filter(s => s.id !== id));
  };

  const handleEditSubject = (s: Subject) => {
    setEditingSubjectId(s.id); setSubjectName(s.name); setSubjectColor(s.color);
  };

  const handleAddTopic = (subjectId: string) => {
    const name = prompt('Nhập tên chủ đề:');
    if (!name?.trim()) return;
    onSubjectsChange(subjects.map(s => s.id === subjectId 
      ? { ...s, topics: [...s.topics, { id: Date.now().toString(), name: name.trim() }] } 
      : s
    ));
  };

  const handleDeleteTopic = (subjectId: string, topicId: string) => {
    onSubjectsChange(subjects.map(s => s.id === subjectId 
      ? { ...s, topics: s.topics.filter(t => t.id !== topicId) } 
      : s
    ));
  };

  const handleEditTopic = (subjectId: string, topicId: string) => {
    const topic = subjects.find(s => s.id === subjectId)?.topics.find(t => t.id === topicId);
    if (!topic) return;
    const name = prompt('Sửa tên chủ đề:', topic.name);
    if (!name?.trim()) return;
    onSubjectsChange(subjects.map(s => s.id === subjectId 
      ? { ...s, topics: s.topics.map(t => t.id === topicId ? { ...t, name: name.trim() } : t) }
      : s
    ));
  };

  const handleSaveTopic = () => {
    if (!topicSubjectId || !topicName.trim()) return;
    onSubjectsChange(subjects.map(s => s.id === topicSubjectId 
      ? { ...s, topics: [...s.topics, { id: Date.now().toString(), name: topicName.trim() }] }
      : s
    ));
    setTopicName('');
  };

  // === ClassRoom handlers ===
  const handleSaveClass = () => {
    if (!className.trim()) return;
    if (editingClassId) {
      onClassRoomsChange(classRooms.map(c => c.id === editingClassId ? { ...c, name: className } : c));
      setEditingClassId(null);
    } else {
      const newClass: ClassRoom = { id: Date.now().toString(), name: className.trim(), students: [] };
      onClassRoomsChange([...classRooms, newClass]);
      setSelectedClassId(newClass.id);
    }
    setClassName('');
  };

  const handleDeleteClass = (id: string) => {
    if (!confirm('Xóa lớp học này?')) return;
    onClassRoomsChange(classRooms.filter(c => c.id !== id));
    if (selectedClassId === id) setSelectedClassId(null);
  };

  const handleAddStudent = () => {
    if (!selectedClassId || !studentName.trim()) return;
    onClassRoomsChange(classRooms.map(c => c.id === selectedClassId
      ? { ...c, students: [...c.students, studentName.trim()] }
      : c
    ));
    setStudentName('');
  };

  const handleRemoveStudent = (idx: number) => {
    if (!selectedClassId) return;
    onClassRoomsChange(classRooms.map(c => c.id === selectedClassId
      ? { ...c, students: c.students.filter((_, i) => i !== idx) }
      : c
    ));
  };

  const selectedClass = classRooms.find(c => c.id === selectedClassId);

  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-950 p-4 md:p-8 flex flex-col items-center">
      {/* Header */}
      <div className="w-full max-w-7xl mb-6 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="text-slate-500 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-xl">
            <ChevronLeft size={20} />
          </button>
          <div>
            <h2 className="text-2xl font-black text-white tracking-tighter uppercase">Quản lý kho câu hỏi</h2>
          </div>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={onGenerateAI} disabled={!hasAIKey}
            className={`px-5 py-2.5 rounded-xl flex items-center gap-2 font-black text-xs transition-all ${hasAIKey ? 'bg-yellow-400 text-indigo-900 hover:bg-yellow-300' : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-white/5'}`}
          >
            <Zap size={16} /> TẠO BẰNG AI
          </button>
        </div>
      </div>

      {/* Alert: API Key */}
      {!hasAIKey && (
        <div className="w-full max-w-7xl mb-6 bg-rose-950/50 border border-rose-500/30 rounded-2xl px-6 py-4 flex items-center justify-between">
          <p className="text-rose-400 text-sm font-bold flex items-center gap-2">🔑 Hãy lấy API KEY để sử dụng tính năng AI</p>
        </div>
      )}

      {/* Tabs */}
      <div className="w-full max-w-7xl mb-6 flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-3 rounded-xl font-black text-xs flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === tab.id 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-white/5'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="w-full max-w-7xl">
        <AnimatePresence mode="wait">
          {/* ========== TAB: QUESTIONS ========== */}
          {activeTab === 'questions' && (
            <motion.div key="questions" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="bg-slate-900/50 rounded-[2rem] border border-white/5 overflow-hidden">
                {/* Search + Add */}
                <div className="p-6 border-b border-white/5 bg-white/5 flex flex-wrap gap-4 items-center">
                  <div className="relative flex-1 min-w-[250px]">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input 
                      type="text" placeholder="Tìm kiếm câu hỏi..." value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                      className="w-full bg-slate-950/50 text-white pl-11 pr-4 py-3 rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                  <button onClick={onAdd} className="bg-blue-600 text-white px-5 py-3 rounded-xl flex items-center gap-2 font-black text-xs hover:bg-blue-500 transition-all">
                    <Plus size={16} /> THÊM CÂU HỎI
                  </button>
                </div>
                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-slate-950/50 border-b border-white/5 uppercase text-[10px] tracking-[0.2em] text-slate-500 font-black">
                      <tr>
                        <th className="px-6 py-5">Nội dung câu hỏi</th>
                        <th className="px-6 py-5 text-center">Đáp án</th>
                        <th className="px-6 py-5 text-right">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {filteredQuestions.length === 0 ? (
                        <tr>
                          <td colSpan={3} className="px-6 py-16 text-center text-slate-600 font-bold italic">
                            {searchTerm ? 'Không tìm thấy câu hỏi nào.' : 'Kho câu hỏi trống. Hãy thêm hoặc nhập từ file.'}
                          </td>
                        </tr>
                      ) : filteredQuestions.map(q => (
                        <tr key={q.id} className="hover:bg-white/5 transition-colors group">
                          <td className="px-6 py-6">
                            <div className="font-bold text-white line-clamp-2 leading-relaxed mb-3">{q.text}</div>
                            <div className="flex flex-wrap gap-1.5">
                              {q.options.map((opt, i) => {
                                const isCorrect = String.fromCharCode(65 + i) === q.correctAnswer;
                                return (
                                  <span key={i} className={`text-[10px] px-2.5 py-1 rounded-lg border font-bold ${isCorrect ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-slate-950 border-white/10 text-slate-500'}`}>
                                    {String.fromCharCode(65 + i)}. {opt}
                                  </span>
                                );
                              })}
                            </div>
                          </td>
                          <td className="px-6 py-6">
                            <div className="flex justify-center">
                              <span className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-lg shadow-lg shadow-blue-600/20">{q.correctAnswer}</span>
                            </div>
                          </td>
                          <td className="px-6 py-6 text-right">
                            <div className="flex justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-all">
                              <button onClick={() => onEdit(q)} className="p-2.5 text-blue-400 hover:bg-blue-400/10 rounded-xl transition-all" title="Sửa"><Edit size={18} /></button>
                              <button onClick={() => onDelete(q.id)} className="p-2.5 text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all" title="Xóa"><Trash2 size={18} /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* ========== TAB: SUBJECTS & TOPICS ========== */}
          {activeTab === 'subjects' && (
            <motion.div key="subjects" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-6">
                {/* Left: Forms */}
                <div className="space-y-6">
                  {/* Add Subject */}
                  <div className="bg-slate-900/50 rounded-2xl border border-white/5 p-6">
                    <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-5">
                      {editingSubjectId ? '✏️ Sửa môn học' : '➕ Thêm mới'}
                    </h4>
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Môn học</label>
                        <input value={subjectName} onChange={e => setSubjectName(e.target.value)} placeholder="Tên môn học"
                          className="w-full bg-slate-950 text-white px-4 py-3 rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Màu sắc</label>
                        <div className="flex gap-2 flex-wrap">
                          {PRESET_COLORS.map(c => (
                            <button key={c} onClick={() => setSubjectColor(c)}
                              className={`w-8 h-8 rounded-lg transition-all ${subjectColor === c ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-900 scale-110' : 'hover:scale-105'}`}
                              style={{ backgroundColor: c }}
                            />
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-3 pt-2">
                        <button onClick={handleSaveSubject} className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl font-black text-xs transition-all">
                          {editingSubjectId ? 'Cập nhật' : 'Lưu môn'}
                        </button>
                        <button onClick={() => { setSubjectName(''); setEditingSubjectId(null); }} className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 py-3 rounded-xl font-black text-xs transition-all border border-white/5">
                          Hủy
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Add Topic */}
                  <div className="bg-slate-900/50 rounded-2xl border border-white/5 p-6">
                    <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-5">📁 Chủ đề</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Chọn môn học</label>
                        <select value={topicSubjectId} onChange={e => setTopicSubjectId(e.target.value)}
                          className="w-full bg-slate-950 text-white px-4 py-3 rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
                          <option value="">-- Chọn môn học --</option>
                          {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                      </div>
                      <input value={topicName} onChange={e => setTopicName(e.target.value)} placeholder="Tên chủ đề"
                        className="w-full bg-slate-950 text-white px-4 py-3 rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                      <div className="flex gap-3">
                        <button onClick={handleSaveTopic} className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl font-black text-xs transition-all">Lưu chủ đề</button>
                        <button onClick={() => setTopicName('')} className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 py-3 rounded-xl font-black text-xs transition-all border border-white/5">Hủy</button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: Subject list */}
                <div className="bg-slate-900/50 rounded-2xl border border-white/5 p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h4 className="text-sm font-black text-white uppercase tracking-widest">📚 Danh sách môn học</h4>
                  </div>
                  {subjects.length === 0 ? (
                    <p className="text-slate-600 text-sm font-bold italic text-center py-12">Chưa có môn học nào. Tạo môn học ở bên trái.</p>
                  ) : (
                    <div className="space-y-4">
                      {subjects.map(s => (
                        <div key={s.id} className="bg-slate-950/50 border border-white/5 rounded-2xl p-5">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className="w-4 h-4 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
                              <h5 className="font-black text-white text-lg">{s.name}</h5>
                            </div>
                            <div className="flex gap-1.5">
                              <button onClick={() => handleAddTopic(s.id)} className="p-2 text-emerald-400 hover:bg-emerald-400/10 rounded-lg transition-all" title="Thêm chủ đề"><Plus size={16} /></button>
                              <button onClick={() => handleEditSubject(s)} className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-lg transition-all" title="Sửa"><Edit size={16} /></button>
                              <button onClick={() => handleDeleteSubject(s.id)} className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all" title="Xóa"><Trash2 size={16} /></button>
                            </div>
                          </div>
                          {s.topics.length > 0 && (
                            <div className="flex flex-wrap gap-2 pl-7">
                              {s.topics.map(t => (
                                <div key={t.id} className="flex items-center gap-1.5 bg-slate-900 border border-white/10 rounded-lg px-3 py-1.5 group/topic">
                                  <span className="text-sm text-slate-300 font-medium">{t.name}</span>
                                  <button onClick={() => handleEditTopic(s.id, t.id)} className="text-blue-400 hover:text-blue-300 opacity-0 group-hover/topic:opacity-100 transition-all"><Edit size={13} /></button>
                                  <button onClick={() => handleDeleteTopic(s.id, t.id)} className="text-rose-400 hover:text-rose-300 opacity-0 group-hover/topic:opacity-100 transition-all"><Trash2 size={13} /></button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* ========== TAB: IMPORT / EXPORT ========== */}
          {activeTab === 'import' && (
            <motion.div key="import" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="bg-slate-900/50 rounded-2xl border border-white/5 p-8">
                <h4 className="text-sm font-black text-white uppercase tracking-widest mb-8">📥 Nhập / Xuất dữ liệu</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <label className="flex flex-col items-center gap-4 p-8 bg-emerald-600/10 border-2 border-dashed border-emerald-500/30 rounded-2xl cursor-pointer hover:bg-emerald-600/20 transition-all group text-center">
                    <div className="w-16 h-16 rounded-2xl bg-emerald-600/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Upload size={28} className="text-emerald-400" />
                    </div>
                    <div>
                      <p className="font-black text-emerald-400 text-sm mb-1">NHẬP TỪ WORD</p>
                      <p className="text-slate-500 text-xs">Chọn file .docx để nhập câu hỏi</p>
                    </div>
                    <input type="file" accept=".docx" className="hidden" onChange={onImportDocx} />
                  </label>

                  <label className="flex flex-col items-center gap-4 p-8 bg-indigo-600/10 border-2 border-dashed border-indigo-500/30 rounded-2xl cursor-pointer hover:bg-indigo-600/20 transition-all group text-center">
                    <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Upload size={28} className="text-indigo-400" />
                    </div>
                    <div>
                      <p className="font-black text-indigo-400 text-sm mb-1">NHẬP TỪ JSON</p>
                      <p className="text-slate-500 text-xs">Chọn file .json đã xuất trước đó</p>
                    </div>
                    <input type="file" accept=".json" className="hidden" onChange={onImportJson} />
                  </label>

                  <button onClick={onExport} className="flex flex-col items-center gap-4 p-8 bg-white/5 border-2 border-dashed border-white/10 rounded-2xl hover:bg-white/10 transition-all group text-center">
                    <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Download size={28} className="text-white" />
                    </div>
                    <div>
                      <p className="font-black text-white text-sm mb-1">XUẤT FILE JSON</p>
                      <p className="text-slate-500 text-xs">Sao lưu {questions.length} câu hỏi</p>
                    </div>
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ========== TAB: CLASSES ========== */}
          {activeTab === 'classes' && (
            <motion.div key="classes" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
                {/* Left: Class list */}
                <div className="bg-slate-900/50 rounded-2xl border border-white/5 p-6">
                  <div className="flex items-center justify-between mb-5">
                    <h4 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                      <School size={16} /> Danh sách lớp
                    </h4>
                    <button onClick={() => { setEditingClassId(null); setClassName(''); }}
                      className="w-8 h-8 bg-blue-600 hover:bg-blue-500 text-white rounded-lg flex items-center justify-center transition-all">
                      <Plus size={16} />
                    </button>
                  </div>

                  {/* Add/Edit class form */}
                  <div className="mb-5 space-y-3">
                    <input value={className} onChange={e => setClassName(e.target.value)} placeholder="Tên lớp (VD: 4A1)"
                      className="w-full bg-slate-950 text-white px-4 py-3 rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      onKeyDown={e => e.key === 'Enter' && handleSaveClass()}
                    />
                    <button onClick={handleSaveClass} className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-xl font-black text-xs transition-all">
                      {editingClassId ? 'Cập nhật' : 'Tạo lớp mới'}
                    </button>
                  </div>

                  {classRooms.length === 0 ? (
                    <p className="text-slate-600 text-xs font-bold italic text-center py-6">Chưa có lớp nào</p>
                  ) : (
                    <div className="space-y-2">
                      {classRooms.map(c => (
                        <div key={c.id} onClick={() => setSelectedClassId(c.id)}
                          className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all group ${
                            selectedClassId === c.id ? 'bg-blue-600/20 border border-blue-500/30' : 'hover:bg-white/5 border border-transparent'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <School size={16} className={selectedClassId === c.id ? 'text-blue-400' : 'text-slate-500'} />
                            <div>
                              <p className={`font-bold text-sm ${selectedClassId === c.id ? 'text-blue-400' : 'text-white'}`}>{c.name}</p>
                              <p className="text-[10px] text-slate-500">{c.students.length} học sinh</p>
                            </div>
                          </div>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                            <button onClick={(e) => { e.stopPropagation(); setEditingClassId(c.id); setClassName(c.name); }} className="p-1.5 text-blue-400 hover:bg-blue-400/10 rounded-lg"><Edit size={14} /></button>
                            <button onClick={(e) => { e.stopPropagation(); handleDeleteClass(c.id); }} className="p-1.5 text-rose-400 hover:bg-rose-400/10 rounded-lg"><Trash2 size={14} /></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Right: Students */}
                <div className="bg-slate-900/50 rounded-2xl border border-white/5 p-6">
                  {selectedClass ? (
                    <>
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <h4 className="text-lg font-black text-white">{selectedClass.name}</h4>
                          <p className="text-xs text-slate-500 font-bold">{selectedClass.students.length} học sinh</p>
                        </div>
                      </div>

                      {/* Add student */}
                      <div className="flex gap-3 mb-6">
                        <input value={studentName} onChange={e => setStudentName(e.target.value)} placeholder="Tên học sinh..."
                          className="flex-1 bg-slate-950 text-white px-4 py-3 rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                          onKeyDown={e => e.key === 'Enter' && handleAddStudent()}
                        />
                        <button onClick={handleAddStudent} className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-3 rounded-xl font-black text-xs transition-all flex items-center gap-2">
                          <Plus size={16} /> Thêm
                        </button>
                      </div>

                      {/* Student list */}
                      {selectedClass.students.length === 0 ? (
                        <p className="text-slate-600 text-sm font-bold italic text-center py-12">Chưa có học sinh. Nhập tên và nhấn Thêm.</p>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                          {selectedClass.students.map((s, i) => (
                            <div key={i} className="flex items-center justify-between bg-slate-950/50 border border-white/5 rounded-xl px-4 py-3 group hover:border-white/10 transition-all">
                              <div className="flex items-center gap-3">
                                <span className="w-7 h-7 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center font-black text-xs">{i + 1}</span>
                                <span className="text-sm text-white font-medium">{s}</span>
                              </div>
                              <button onClick={() => handleRemoveStudent(i)} className="text-rose-500 hover:bg-rose-500/10 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all">
                                <Trash2 size={14} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                      <School size={48} className="text-slate-700 mb-4" />
                      <p className="text-slate-500 font-bold mb-1">Chọn hoặc tạo lớp học</p>
                      <p className="text-slate-600 text-xs">Nhấn nút + ở bên trái để tạo lớp mới</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* ========== TAB: GAME SETTINGS ========== */}
          {activeTab === 'settings' && (
            <motion.div key="settings" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="space-y-6">
                {/* Timer Settings */}
                <div className="bg-slate-900/50 rounded-2xl border border-white/5 p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <Timer size={20} className="text-amber-400" />
                    <h4 className="text-lg font-black text-white">Cài đặt trò chơi</h4>
                  </div>
                  <p className="text-slate-500 text-xs mb-6">Thiết lập thời gian và tùy chọn cho từng trò chơi. Nhấn "Lưu thay đổi" để áp dụng.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                      { id: 'game-millionaire', icon: '💰', name: 'Ai là triệu phú', hint: 'Thời gian cho mỗi câu hỏi' },
                      { id: 'game-cards', icon: '🃏', name: 'Lật thẻ bí ẩn', hint: '0 = không giới hạn' },
                      { id: 'game-race', icon: '🏃', name: 'Đường đua vượt chướng ngại vật', hint: '0 = không giới hạn' },
                      { id: 'game-bell', icon: '🔔', name: 'Rung chuông vàng', hint: '0 = không giới hạn' },
                      { id: 'game-crossword', icon: '🧩', name: 'Ô chữ bí mật', hint: 'Thời gian cho mỗi ô chữ' },
                      { id: 'game-flower', icon: '🌸', name: 'Hái hoa dân chủ', hint: '0 = không giới hạn' },
                      { id: 'game-castle', icon: '🏰', name: 'Chiếm Lâu Đài', hint: 'Thời gian tấn công/phòng thủ' },
                      { id: 'game-territory', icon: '🗺️', name: 'Tranh Lãnh Thổ', hint: 'Thời gian chiến đấu' },
                      { id: 'game-race-to-finish', icon: '🏁', name: 'Đua Đến Đích', hint: 'Thời gian mỗi lượt' },
                      { id: 'game-puzzle', icon: '🖼️', name: 'Ghép Hình Bí Ẩn', hint: 'Thời gian mỗi mảnh ghép' },
                      { id: 'game-battleship', icon: '🚢', name: 'Đánh Tàu Chiến', hint: 'Thời gian mỗi phát' },
                      { id: 'game-tower', icon: '🧱', name: 'Xây Tháp', hint: 'Thời gian xây tầng' },
                      { id: 'game-wheel', icon: '🎡', name: 'Vòng Quay May Mắn', hint: 'Thời gian trả lời' },
                      { id: 'game-auction', icon: '🔨', name: 'Đấu Giá Tri Thức', hint: 'Thời gian đấu giá 5 s/câu' },
                      { id: 'game-survival', icon: '🏝️', name: 'Đảo Sinh Tồn', hint: 'Thời gian sinh tồn' },
                    ].map(game => (
                      <div key={game.id} className="bg-slate-950/50 border border-white/5 rounded-xl p-4 hover:border-white/10 transition-all">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-lg">{game.icon}</span>
                          <span className="text-sm font-bold text-white">{game.name}</span>
                        </div>
                        <p className="text-[10px] text-slate-500 mb-3">{game.hint}</p>
                        <div className="flex items-center gap-2">
                          <Timer size={14} className="text-slate-500" />
                          <span className="text-xs text-slate-400">Thời gian:</span>
                          <input
                            type="number" min={0} max={300}
                            value={gameSettings.timers[game.id] ?? 0}
                            onChange={e => onGameSettingsChange({
                              ...gameSettings,
                              timers: { ...gameSettings.timers, [game.id]: parseInt(e.target.value) || 0 }
                            })}
                            className="w-16 bg-slate-900 text-white text-center px-2 py-1.5 rounded-lg border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-bold"
                          />
                          <span className="text-xs text-slate-500">giây</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Puzzle Settings */}
                <div className="bg-slate-900/50 rounded-2xl border border-white/5 p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xl">🖼️</span>
                    <h4 className="text-lg font-black text-white">Cài đặt Ghép Hình Bí Ẩn</h4>
                  </div>
                  <p className="text-slate-500 text-xs mb-6">Thiết lập từ khóa bí mật và hình ảnh bí mật.</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">🔑 Từ khóa bí mật</label>
                      <input value={gameSettings.puzzleKeyword} onChange={e => onGameSettingsChange({ ...gameSettings, puzzleKeyword: e.target.value })}
                        placeholder="VD: TOÁN HỌC" className="w-full bg-slate-950 text-white text-center px-4 py-4 rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg font-black uppercase tracking-widest" />
                      <p className="text-[10px] text-slate-600 mt-2">Để trống = random ngẫu nhiên (TOÁN HỌC, KHOA HỌC...)</p>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">🖼️ Hình ảnh bí mật</label>
                      <input value={gameSettings.puzzleImage} onChange={e => onGameSettingsChange({ ...gameSettings, puzzleImage: e.target.value })}
                        placeholder="URL hình ảnh (PNG, JPG, WEBP)" className="w-full bg-slate-950 text-white px-4 py-3 rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm mb-3" />
                      <div className="flex gap-3 items-start">
                        <label className="flex-1 flex flex-col items-center gap-2 p-4 bg-slate-950 border-2 border-dashed border-white/10 rounded-xl cursor-pointer hover:border-blue-500/50 hover:bg-blue-600/5 transition-all group">
                          <Upload size={20} className="text-slate-500 group-hover:text-blue-400 transition-colors" />
                          <span className="text-[10px] text-slate-500 group-hover:text-blue-400 font-bold transition-colors">Nhấn để tải ảnh lên</span>
                          <span className="text-[9px] text-slate-600">(PNG, JPG, WEBP đều được)</span>
                          <input type="file" accept="image/*" className="hidden" onChange={e => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            if (file.size > 5 * 1024 * 1024) { alert('Ảnh quá lớn! Tối đa 5MB.'); return; }
                            const reader = new FileReader();
                            reader.onload = (ev) => {
                              onGameSettingsChange({ ...gameSettings, puzzleImage: ev.target?.result as string });
                            };
                            reader.readAsDataURL(file);
                          }} />
                        </label>
                        {gameSettings.puzzleImage && (
                          <div className="relative w-24 h-24 rounded-xl overflow-hidden border border-white/10 shrink-0 group">
                            <img src={gameSettings.puzzleImage} alt="Preview" className="w-full h-full object-cover" />
                            <button onClick={() => onGameSettingsChange({ ...gameSettings, puzzleImage: '' })}
                              className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                              <Trash2 size={16} className="text-rose-400" />
                            </button>
                          </div>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-600 mt-2">Để trống = dùng ảnh mặc định có sẵn</p>
                    </div>
                  </div>
                </div>

                {/* Race, Wheel, Auction specific */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-slate-900/50 rounded-2xl border border-white/5 p-6">
                    <div className="flex items-center gap-2 mb-1"><span>🏁</span><h5 className="font-black text-white text-sm">Đua Đến Đích</h5></div>
                    <p className="text-[10px] text-slate-500 mb-4">Số ô trên đường đua</p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400">Đường đua:</span>
                      <input type="number" min={10} max={100} value={gameSettings.raceTrackLength}
                        onChange={e => onGameSettingsChange({ ...gameSettings, raceTrackLength: parseInt(e.target.value) || 30 })}
                        className="w-16 bg-slate-950 text-white text-center px-2 py-1.5 rounded-lg border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-bold" />
                      <span className="text-xs text-slate-500">ô</span>
                    </div>
                  </div>
                  <div className="bg-slate-900/50 rounded-2xl border border-white/5 p-6">
                    <div className="flex items-center gap-2 mb-1"><span>🎡</span><h5 className="font-black text-white text-sm">Vòng Quay May Mắn</h5></div>
                    <p className="text-[10px] text-slate-500 mb-4">Điểm mục tiêu để thắng</p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400">Mục tiêu:</span>
                      <input type="number" min={100} max={10000} step={100} value={gameSettings.wheelTargetScore}
                        onChange={e => onGameSettingsChange({ ...gameSettings, wheelTargetScore: parseInt(e.target.value) || 500 })}
                        className="w-20 bg-slate-950 text-white text-center px-2 py-1.5 rounded-lg border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-bold" />
                      <span className="text-xs text-slate-500">điểm</span>
                    </div>
                  </div>
                  <div className="bg-slate-900/50 rounded-2xl border border-white/5 p-6">
                    <div className="flex items-center gap-2 mb-1"><span>🔨</span><h5 className="font-black text-white text-sm">Đấu Giá Tri Thức</h5></div>
                    <p className="text-[10px] text-slate-500 mb-4">Số xu ban đầu và số vòng</p>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-amber-400">🪙</span><span className="text-xs text-slate-400">Xu:</span>
                        <input type="number" min={100} max={10000} step={100} value={gameSettings.auctionStartCoins}
                          onChange={e => onGameSettingsChange({ ...gameSettings, auctionStartCoins: parseInt(e.target.value) || 1000 })}
                          className="w-20 bg-slate-950 text-white text-center px-2 py-1.5 rounded-lg border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-bold" />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-blue-400">🔄</span><span className="text-xs text-slate-400">Vòng:</span>
                        <input type="number" min={3} max={30} value={gameSettings.auctionRounds}
                          onChange={e => onGameSettingsChange({ ...gameSettings, auctionRounds: parseInt(e.target.value) || 10 })}
                          className="w-16 bg-slate-950 text-white text-center px-2 py-1.5 rounded-lg border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-bold" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Team settings */}
                <div className="bg-slate-900/50 rounded-2xl border border-white/5 p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <Users size={20} className="text-blue-400" />
                    <h4 className="text-lg font-black text-white">Cài đặt đội chơi</h4>
                  </div>
                  <p className="text-slate-500 text-xs mb-6">Chọn số đội tham gia trò chơi (2-4 đội). Áp dụng cho tất cả game.</p>
                  <div className="flex gap-3 mb-6">
                    {[2, 3, 4].map(n => (
                      <button key={n} onClick={() => {
                        const names = Array.from({ length: n }, (_, i) => gameSettings.teams.names[i] || `Đội ${i + 1}`);
                        onGameSettingsChange({ ...gameSettings, teams: { count: n, names } });
                      }}
                        className={`flex-1 py-3 rounded-xl font-black text-sm transition-all ${
                          gameSettings.teams.count === n ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'bg-slate-950 text-slate-400 border border-white/5 hover:border-white/10'
                        }`}
                      >
                        {n} đội
                      </button>
                    ))}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                    {gameSettings.teams.names.slice(0, gameSettings.teams.count).map((name, i) => (
                      <input key={i} value={name}
                        onChange={e => {
                          const names = [...gameSettings.teams.names];
                          names[i] = e.target.value;
                          onGameSettingsChange({ ...gameSettings, teams: { ...gameSettings.teams, names } });
                        }}
                        className={`px-4 py-3 rounded-xl border text-white text-center font-bold text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          i === 0 ? 'bg-blue-600/20 border-blue-500/30' :
                          i === 1 ? 'bg-rose-600/20 border-rose-500/30' :
                          i === 2 ? 'bg-emerald-600/20 border-emerald-500/30' :
                          'bg-amber-600/20 border-amber-500/30'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default QuestionManager;
