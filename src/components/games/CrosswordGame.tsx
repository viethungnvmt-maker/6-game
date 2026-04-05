import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, Play } from 'lucide-react';
import { Question } from '../../types';
import { playCorrectSound, playTone } from '../../utils/audio';

interface CrosswordGameProps {
  questions: Question[];
  onBack: () => void;
}

const CrosswordGame: React.FC<CrosswordGameProps> = ({ questions, onBack }) => {
  const [gameState, setGameState] = useState<'start' | 'playing' | 'result'>('start');
  const [rows, setRows] = useState<{ word: string, hint: string, revealed: boolean, cells: string[] }[]>([]);
  const [activeTeam, setActiveTeam] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(15);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== 'playing' || activeTeam) return;
      if (e.key.toLowerCase() === 'a') {
        setActiveTeam('Đội A');
        playTone(880, 0.5, 'square');
        startTimer();
      } else if (e.key.toLowerCase() === 'l') {
        setActiveTeam('Đội L');
        playTone(660, 0.5, 'square');
        startTimer();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, activeTeam]);

  const startGame = () => {
    const available = questions.filter(q => {
      const idx = q.correctAnswer.charCodeAt(0) - 65;
      return q.options[idx] && q.options[idx].length <= 10;
    });
    
    if (available.length < 5) {
      alert('Cần ít nhất 5 câu hỏi có đáp án ngắn (<= 10 ký tự) để tạo ô chữ!');
      return;
    }
    
    const selected = available.sort(() => 0.5 - Math.random()).slice(0, 8);
    const newRows = selected.map(q => {
      const idx = q.correctAnswer.charCodeAt(0) - 65;
      const word = q.options[idx].toUpperCase();
      return {
        word,
        hint: q.text,
        revealed: false,
        cells: word.split('')
      };
    });

    setRows(newRows);
    setGameState('playing');
    setActiveTeam(null);
  };

  const startTimer = () => {
    setTimeLeft(15);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setActiveTeam(null);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const revealRow = (idx: number) => {
    const newRows = [...rows];
    newRows[idx].revealed = true;
    setRows(newRows);
    setActiveTeam(null);
    stopTimer();
    playCorrectSound();
  };

  if (gameState === 'start') {
    return (
      <div className="min-h-screen bg-indigo-900 flex flex-col items-center justify-center p-8 text-white">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-center">
          <div className="text-9xl mb-8">🧩</div>
          <h2 className="text-5xl font-bold mb-4">Ô CHỮ THẦN KỲ</h2>
          <p className="text-xl text-indigo-200 mb-12 max-w-md">
            Giải mã các hàng ngang để tìm ra từ khóa bí mật. Nhấn A hoặc L để giành quyền trả lời!
          </p>
          <button 
            onClick={startGame}
            className="bg-white text-indigo-900 px-12 py-4 rounded-full text-2xl font-bold hover:bg-indigo-100 transition-all shadow-xl"
          >
            BẮT ĐẦU GIẢI MÃ
          </button>
          <button onClick={onBack} className="block mt-6 text-indigo-400 hover:text-white transition-colors">
            Quay lại trang chủ
          </button>
        </motion.div>
      </div>
    );
  }

  if (gameState === 'playing') {
    return (
      <div className="min-h-screen bg-indigo-50 flex flex-col items-center p-8">
        <header className="w-full max-w-6xl flex justify-between items-center mb-8">
          <button onClick={() => setGameState('start')} className="text-indigo-700 font-bold flex items-center gap-2">
            <ChevronLeft /> Thoát
          </button>
          <div className="flex gap-4">
            {activeTeam && (
              <motion.div 
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                className="bg-yellow-400 text-indigo-900 px-6 py-2 rounded-full font-bold shadow-lg flex items-center gap-4"
              >
                <span className="animate-bounce">🔔</span> {activeTeam} đang trả lời: {timeLeft}s
              </motion.div>
            )}
          </div>
        </header>

        <main className="w-full max-w-5xl flex flex-col items-center">
          <div className="space-y-2 mb-12 overflow-x-auto w-full p-4">
            {rows.map((row, i) => (
              <div key={i} className="flex items-center gap-4 min-w-max">
                <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-sm shrink-0">
                  {i + 1}
                </div>
                <div className="flex gap-1">
                  {row.cells.map((char, j) => (
                    <div 
                      key={j} 
                      className={`w-12 h-12 border-2 flex items-center justify-center font-bold text-2xl rounded-lg transition-all ${
                        row.revealed ? 'bg-white border-indigo-500 text-indigo-900' : 'bg-indigo-200 border-indigo-300 text-transparent'
                      } ${j === 0 ? 'border-yellow-500 border-4' : ''}`}
                    >
                      {row.revealed ? char : ''}
                    </div>
                  ))}
                </div>
                <button 
                  onClick={() => revealRow(i)}
                  className="ml-4 p-2 text-indigo-600 hover:bg-indigo-100 rounded-lg shrink-0"
                  title="Mở hàng này"
                >
                  <Play size={20} />
                </button>
                <div className="text-sm text-indigo-400 max-w-xs truncate italic" title={row.hint}>
                  {row.hint}
                </div>
              </div>
            ))}
          </div>
          
          <div className="w-full max-w-2xl bg-indigo-600 text-white p-8 rounded-3xl shadow-xl text-center">
            <h4 className="text-xl font-bold mb-4 uppercase tracking-widest">Từ khóa hàng dọc</h4>
            <div className="flex justify-center gap-2">
              {rows.map((row, i) => (
                <div key={i} className={`w-14 h-14 border-4 rounded-xl flex items-center justify-center text-3xl font-black ${
                  row.revealed ? 'bg-yellow-400 border-white text-indigo-900' : 'bg-indigo-800 border-indigo-500 text-transparent'
                }`}>
                  {row.revealed ? row.cells[0] : '?'}
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-indigo-900 flex flex-col items-center justify-center p-8 text-white">
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-center">
        <div className="text-9xl mb-8">🏆</div>
        <h2 className="text-5xl font-bold mb-4">XUẤT SẮC!</h2>
        <p className="text-indigo-200 mb-12">Bạn đã giải mã thành công ô chữ!</p>
        <button onClick={onBack} className="bg-white text-indigo-900 px-8 py-3 rounded-2xl font-bold">TRANG CHỦ</button>
      </motion.div>
    </div>
  );
};

export default CrosswordGame;
