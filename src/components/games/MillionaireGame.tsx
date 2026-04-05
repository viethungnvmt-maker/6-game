import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Users } from 'lucide-react';
import { Question, GameHistory } from '../../types';
import { playCorrectSound, playWrongSound, playTone } from '../../utils/audio';

interface MillionaireGameProps {
  questions: Question[];
  onBack: () => void;
  addHistory: (entry: GameHistory) => void;
}

const MillionaireGame: React.FC<MillionaireGameProps> = ({ questions, onBack, addHistory }) => {
  const [gameState, setGameState] = useState<'start' | 'playing' | 'result'>('start');
  const [currentLevel, setCurrentLevel] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [score, setScore] = useState(0);
  const [selectedQuestions, setSelectedQuestions] = useState<Question[]>([]);
  const [usedHelps, setUsedHelps] = useState({ fifty: false, friend: false, class: false });
  const [showHelp, setShowHelp] = useState<{ type: 'friend' | 'class', data: string | number[] } | null>(null);
  const [currentQ, setCurrentQ] = useState<Question | null>(null);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const levels = [
    5000, 10000, 20000, 40000, 80000, 160000, 
    320000, 640000, 1250000, 2500000, 5000000, 10000000
  ];

  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleTimeout();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState, timeLeft]);

  const startGame = () => {
    if (questions.length < 12) {
      alert('Cần ít nhất 12 câu hỏi để chơi trò này!');
      return;
    }
    const shuffled = [...questions].sort(() => 0.5 - Math.random()).slice(0, 12);
    setSelectedQuestions(shuffled);
    setGameState('playing');
    setCurrentLevel(0);
    setScore(0);
    setTimeLeft(30);
    setCurrentQ(shuffled[0]);
    setUsedHelps({ fifty: false, friend: false, class: false });
  };

  const handleTimeout = () => {
    playWrongSound();
    setGameState('result');
    addHistory({ gameName: 'Ai là triệu phú', score, date: Date.now() });
  };

  const handleAnswer = (answer: string) => {
    if (answer === currentQ?.correctAnswer) {
      playCorrectSound();
      const newScore = levels[currentLevel];
      setScore(newScore);

      if (currentLevel === 11) {
        setGameState('result');
        addHistory({ gameName: 'Ai là triệu phú', score: newScore, date: Date.now() });
      } else {
        const nextIdx = currentLevel + 1;
        setCurrentLevel(nextIdx);
        setCurrentQ(selectedQuestions[nextIdx]);
        setTimeLeft(30);
      }
    } else {
      playWrongSound();
      setGameState('result');
      addHistory({ gameName: 'Ai là triệu phú', score, date: Date.now() });
    }
  };

  const useFiftyFifty = () => {
    if (!currentQ || usedHelps.fifty) return;
    setUsedHelps(prev => ({ ...prev, fifty: true }));
    playTone(880, 0.2);
    
    const correctIdx = currentQ.correctAnswer.charCodeAt(0) - 65;
    let removedCount = 0;
    const newOptions = [...currentQ.options];
    const indices = [0, 1, 2, 3].filter(i => i !== correctIdx).sort(() => 0.5 - Math.random());
    
    indices.slice(0, 2).forEach(idx => {
      newOptions[idx] = '';
    });
    
    setCurrentQ({ ...currentQ, options: newOptions });
  };

  const useHelpFriend = () => {
    if (!currentQ || usedHelps.friend) return;
    setUsedHelps(prev => ({ ...prev, friend: true }));
    playTone(880, 0.2);
    
    const messages = [
      `Tớ nghĩ đáp án là ${currentQ.correctAnswer}, tớ khá chắc chắn!`,
      `Câu này khó thế, nhưng tớ đoán là ${currentQ.correctAnswer}.`,
      `Chắc chắn là ${currentQ.correctAnswer} rồi, tin tớ đi!`,
      `Hình như là ${Math.random() > 0.3 ? currentQ.correctAnswer : 'B'} đó.`
    ];
    setShowHelp({ type: 'friend', data: messages[Math.floor(Math.random() * messages.length)] });
  };

  const useHelpClass = () => {
    if (!currentQ || usedHelps.class) return;
    setUsedHelps(prev => ({ ...prev, class: true }));
    playTone(880, 0.2);
    
    const correctIdx = currentQ.correctAnswer.charCodeAt(0) - 65;
    const stats = [0, 0, 0, 0];
    let remaining = 100;
    
    stats[correctIdx] = 40 + Math.floor(Math.random() * 40);
    remaining -= stats[correctIdx];
    
    for (let i = 0; i < 3; i++) {
      const idx = [0, 1, 2, 3].filter(j => j !== correctIdx)[i];
      if (i === 2) {
        stats[idx] = remaining;
      } else {
        const val = Math.floor(Math.random() * remaining);
        stats[idx] = val;
        remaining -= val;
      }
    }
    
    setShowHelp({ type: 'class', data: stats });
  };

  const getTimerColor = () => {
    if (timeLeft <= 5) return 'text-red-500 animate-pulse';
    if (timeLeft <= 15) return 'text-yellow-400';
    return 'text-white';
  };

  if (gameState === 'start') {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(30,58,138,0.5),transparent)] pointer-events-none" />
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center z-10">
          <div className="text-9xl mb-8 filter drop-shadow-[0_0_30px_rgba(59,130,246,0.5)]">💎</div>
          <h2 className="text-6xl font-black mb-4 tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400">
            AI LÀ TRIỆU PHÚ
          </h2>
          <p className="text-xl text-slate-400 mb-12 max-w-md">12 câu hỏi thử thách kiến thức để chinh phục 10.000.000 điểm thưởng!</p>
          <button 
            onClick={startGame}
            className="bg-blue-600 hover:bg-blue-500 text-white px-12 py-4 rounded-full text-2xl font-bold transition-all shadow-[0_0_40px_rgba(37,99,235,0.4)] hover:scale-105 active:scale-95"
          >
            BẮT ĐẦU THỬ THÁCH
          </button>
          <button onClick={onBack} className="block mt-8 text-slate-500 hover:text-white transition-colors">
            Quay lại trang chủ
          </button>
        </motion.div>
      </div>
    );
  }

  if (gameState === 'playing' && currentQ) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center p-8 text-white relative overflow-hidden">
        <header className="w-full max-w-6xl flex justify-between items-center mb-12 z-10">
          <button onClick={() => setGameState('start')} className="text-slate-400 hover:text-white transition-colors flex items-center gap-2">
            <ChevronLeft /> Thoát
          </button>
          <div className="flex gap-4">
            <button 
              onClick={useFiftyFifty}
              disabled={usedHelps.fifty}
              className={`w-16 h-16 rounded-full border-2 flex items-center justify-center font-bold text-2xl transition-all ${
                usedHelps.fifty ? 'border-slate-700 text-slate-700 opacity-50' : 'border-blue-400 text-blue-400 hover:bg-blue-400/10'
              }`}
            >
              50:50
            </button>
            <button 
              onClick={useHelpFriend}
              disabled={usedHelps.friend}
              className={`w-16 h-16 rounded-full border-2 flex items-center justify-center transition-all ${
                usedHelps.friend ? 'border-slate-700 text-slate-700 opacity-50' : 'border-emerald-400 text-emerald-400 hover:bg-emerald-400/10'
              }`}
            >
              <Users size={32} />
            </button>
            <button 
              onClick={useHelpClass}
              disabled={usedHelps.class}
              className={`w-16 h-16 rounded-full border-2 flex items-center justify-center transition-all ${
                usedHelps.class ? 'border-slate-700 text-slate-700 opacity-50' : 'border-purple-400 text-purple-400 hover:bg-purple-400/10'
              }`}
            >
              <Users size={32} className="rotate-180" />
            </button>
          </div>
          <div className={`text-6xl font-mono font-bold ${getTimerColor()}`}>
            {timeLeft}s
          </div>
          <div className="text-right">
            <div className="text-slate-400 uppercase tracking-widest text-sm mb-1">Tiền thưởng</div>
            <div className="text-3xl font-bold text-yellow-400">{levels[currentLevel].toLocaleString()}</div>
          </div>
        </header>

        <main className="w-full max-w-4xl z-10 flex flex-col items-center">
          <div className="w-full bg-slate-900/80 backdrop-blur-md border border-white/10 p-8 rounded-3xl mb-8 text-center shadow-2xl">
            <div className="text-blue-400 font-bold mb-4 uppercase tracking-widest">Câu hỏi {currentLevel + 1}/12</div>
            <h3 className="text-3xl font-medium leading-relaxed">{currentQ.text}</h3>
            {currentQ.image && (
              <img src={currentQ.image} alt="Question" className="mt-6 max-h-48 mx-auto rounded-xl border border-white/10" />
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            {currentQ.options.map((opt, i) => {
              const label = String.fromCharCode(65 + i);
              if (!opt) return <div key={i} className="p-6"></div>;
              return (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleAnswer(label)}
                  className="bg-slate-900/50 hover:bg-blue-600/20 border border-white/10 hover:border-blue-500 p-6 rounded-2xl text-left flex items-center gap-4 transition-all group"
                >
                  <span className="w-10 h-10 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold group-hover:bg-blue-500 group-hover:text-white transition-colors">
                    {label}
                  </span>
                  <span className="text-xl">{opt}</span>
                </motion.button>
              );
            })}
          </div>
        </main>

        <AnimatePresence>
          {showHelp && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-8"
              onClick={() => setShowHelp(null)}
            >
              <motion.div 
                initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
                className="bg-slate-900 border border-white/10 p-8 rounded-3xl max-w-md w-full text-center shadow-2xl"
                onClick={e => e.stopPropagation()}
              >
                <div className="text-5xl mb-6">
                  {showHelp.type === 'friend' ? '💡' : '📊'}
                </div>
                <h4 className="text-2xl font-bold mb-4">
                  {showHelp.type === 'friend' ? 'Hỏi bạn bên cạnh' : 'Hỏi ý kiến cả lớp'}
                </h4>
                
                {showHelp.type === 'friend' ? (
                  <p className="text-xl text-slate-300 italic">"{showHelp.data}"</p>
                ) : (
                  <div className="flex items-end justify-center gap-4 h-48 mt-8">
                    {(showHelp.data as number[]).map((v, i) => (
                      <div key={i} className="flex flex-col items-center flex-1">
                        <div className="text-xs font-bold mb-2 text-slate-400">{v}%</div>
                        <motion.div 
                          initial={{ height: 0 }} animate={{ height: `${v}%` }}
                          className={`w-full rounded-t-lg ${currentQ && i === (currentQ.correctAnswer.charCodeAt(0) - 65) ? 'bg-blue-500' : 'bg-slate-700'}`}
                        />
                        <div className="mt-2 font-bold">{String.fromCharCode(65 + i)}</div>
                      </div>
                    ))}
                  </div>
                )}

                <button 
                  onClick={() => setShowHelp(null)}
                  className="mt-8 bg-white text-black px-8 py-2 rounded-xl font-bold hover:bg-slate-200 transition-colors"
                >
                  Đã hiểu
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-8 text-white">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-lg">
        <div className="text-9xl mb-8">{score > 50000 ? '🏆' : '🎮'}</div>
        <h2 className="text-4xl font-bold mb-2">KẾT THÚC LƯỢT CHƠI</h2>
        <p className="text-slate-400 mb-8">Bạn đã dừng lại ở câu hỏi số {currentLevel + (gameState === 'result' ? 0 : 1)}</p>
        
        <div className="bg-white/5 border border-white/10 p-8 rounded-3xl mb-12">
          <div className="text-slate-400 uppercase tracking-widest text-sm mb-2">Tổng điểm nhận được</div>
          <div className="text-6xl font-bold text-yellow-400">{score.toLocaleString()}</div>
        </div>

        <div className="flex gap-4 justify-center">
          <button 
            onClick={startGame}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-2xl font-bold transition-all"
          >
            CHƠI LẠI
          </button>
          <button 
            onClick={onBack}
            className="bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-2xl font-bold transition-all"
          >
            TRANG CHỦ
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default MillionaireGame;
