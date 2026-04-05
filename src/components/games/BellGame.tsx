import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Download } from 'lucide-react';
import { Question } from '../../types';

interface BellGameProps {
  questions: Question[];
  onBack: () => void;
}

const BellGame: React.FC<BellGameProps> = ({ questions, onBack }) => {
  const [gameState, setGameState] = useState<'start' | 'playing' | 'result'>('start');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedQuestions, setSelectedQuestions] = useState<Question[]>([]);
  const [showAnswer, setShowAnswer] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15);
  const [logs] = useState<{ question: string, isCorrect: boolean }[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== 'playing') return;
      if (e.code === 'Space') {
        e.preventDefault();
        handleNext();
      } else if (e.code === 'Enter') {
        e.preventDefault();
        setShowAnswer(true);
        stopTimer();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, currentIdx, showAnswer]);

  const startGame = () => {
    if (questions.length === 0) {
      alert('Cần có câu hỏi để bắt đầu!');
      return;
    }
    const shuffled = [...questions].sort(() => 0.5 - Math.random());
    setSelectedQuestions(shuffled);
    setGameState('playing');
    setCurrentIdx(0);
    setShowAnswer(false);
    startTimer();
    
    try {
      document.documentElement.requestFullscreen();
    } catch (e) {
      console.warn('Fullscreen not supported');
    }
  };

  const startTimer = () => {
    setTimeLeft(15);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setShowAnswer(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const handleNext = () => {
    if (currentIdx < selectedQuestions.length - 1) {
      setCurrentIdx(prev => prev + 1);
      setShowAnswer(false);
      startTimer();
    } else {
      setGameState('result');
      if (document.fullscreenElement) document.exitFullscreen();
    }
  };

  const downloadLogs = () => {
    const data = JSON.stringify({
      game: 'Rung chuông vàng',
      date: new Date().toISOString(),
      totalQuestions: selectedQuestions.length,
      logs: logs
    }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rung-chuong-vang-log-${Date.now()}.json`;
    a.click();
  };

  if (gameState === 'start') {
    return (
      <div className="min-h-screen bg-red-900 flex flex-col items-center justify-center p-8 text-white">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-center">
          <div className="text-9xl mb-8">🔔</div>
          <h2 className="text-5xl font-bold mb-4">RUNG CHUÔNG VÀNG</h2>
          <p className="text-xl text-red-200 mb-12 max-w-md">
            Đấu trường trí tuệ. Trả lời nhanh trước khi chuông reo!
          </p>
          <div className="bg-white/10 p-6 rounded-2xl mb-12 text-left">
            <h4 className="font-bold mb-2">Phím tắt điều khiển:</h4>
            <ul className="text-sm space-y-1 text-red-100">
              <li>• <b>Space:</b> Chuyển câu hỏi tiếp theo</li>
              <li>• <b>Enter:</b> Hiện đáp án / Dừng giờ</li>
            </ul>
          </div>
          <button 
            onClick={startGame}
            className="bg-white text-red-900 px-12 py-4 rounded-full text-2xl font-bold hover:bg-red-100 transition-all shadow-xl"
          >
            BẮT ĐẦU
          </button>
          <button onClick={onBack} className="block mt-6 text-red-400 hover:text-white transition-colors">
            Quay lại trang chủ
          </button>
        </motion.div>
      </div>
    );
  }

  if (gameState === 'playing' && selectedQuestions.length > 0) {
    const q = selectedQuestions[currentIdx];
    return (
      <div className="min-h-screen bg-red-600 flex flex-col items-center p-8 text-white">
        <header className="w-full max-w-6xl flex justify-between items-center mb-12">
          <div className="text-2xl font-bold">Câu {currentIdx + 1}/{selectedQuestions.length}</div>
          <div className="flex-1 mx-12 h-4 bg-red-900/30 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${((currentIdx + 1) / selectedQuestions.length) * 100}%` }}
              className="h-full bg-yellow-400"
            />
          </div>
          <div className={`text-5xl font-mono font-bold ${timeLeft <= 5 ? 'text-yellow-300 animate-pulse' : ''}`}>
            {timeLeft}s
          </div>
        </header>

        <main className="w-full max-w-5xl flex flex-col items-center">
          <div className="w-full bg-white text-red-900 rounded-3xl p-12 shadow-2xl mb-12 text-center relative">
            <h3 className="text-4xl font-bold leading-tight">{q.text}</h3>
            {q.image && (
              <img src={q.image} alt="Q" className="mt-8 max-h-64 mx-auto rounded-2xl shadow-lg" />
            )}
            
            <AnimatePresence>
              {showAnswer && (
                <motion.div 
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="absolute inset-0 bg-yellow-400 rounded-3xl flex flex-col items-center justify-center p-8 border-8 border-white"
                >
                  <div className="text-red-900 uppercase tracking-widest font-bold mb-4">Đáp án chính xác</div>
                  <div className="text-8xl font-black text-red-600 mb-8">{q.correctAnswer}</div>
                  <div className="text-2xl font-bold text-red-900">
                    {q.options[q.correctAnswer.charCodeAt(0) - 65]}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="grid grid-cols-2 gap-6 w-full">
            {q.options.map((opt, i) => (
              <div key={i} className="bg-red-700/50 border border-white/20 p-6 rounded-2xl flex items-center gap-4">
                <span className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center font-bold text-2xl">
                  {String.fromCharCode(65 + i)}
                </span>
                <span className="text-2xl">{opt}</span>
              </div>
            ))}
          </div>
        </main>

        <footer className="mt-auto pt-12 flex gap-4">
          <button onClick={() => setShowAnswer(true)} className="bg-yellow-400 text-red-900 px-8 py-3 rounded-2xl font-bold">HIỆN ĐÁP ÁN (Enter)</button>
          <button onClick={handleNext} className="bg-white text-red-900 px-8 py-3 rounded-2xl font-bold">CÂU TIẾP THEO (Space)</button>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-red-900 flex flex-col items-center justify-center p-8 text-white">
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-center">
        <div className="text-9xl mb-8">🎖️</div>
        <h2 className="text-5xl font-bold mb-4">KẾT THÚC BUỔI HỌC</h2>
        <p className="text-red-200 mb-12">Bạn đã hoàn thành tất cả các câu hỏi trong ngày hôm nay.</p>
        <div className="flex gap-4 justify-center">
          <button onClick={downloadLogs} className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold flex items-center gap-2">
            <Download size={20} /> Tải log buổi học
          </button>
          <button onClick={onBack} className="bg-white text-red-900 px-8 py-3 rounded-2xl font-bold">TRANG CHỦ</button>
        </div>
      </motion.div>
    </div>
  );
};

export default BellGame;
