import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft } from 'lucide-react';
import { Question, GameHistory } from '../../types';
import { playCorrectSound, playWrongSound } from '../../utils/audio';

interface RaceGameProps {
  questions: Question[];
  onBack: () => void;
  addHistory: (entry: GameHistory) => void;
}

const RaceGame: React.FC<RaceGameProps> = ({ questions, onBack, addHistory }) => {
  const [gameState, setGameState] = useState<'start' | 'playing' | 'result'>('start');
  const [position, setPosition] = useState(0);
  const [currentQ, setCurrentQ] = useState<Question | null>(null);
  const [isJumping, setIsJumping] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [score, setScore] = useState(0);

  const obstacles: Record<number, string> = { 5: '🌵', 10: '🗻', 15: '🌊' };
  const totalSteps = 20;

  const startGame = () => {
    if (questions.length === 0) {
      alert('Cần có câu hỏi để bắt đầu trò chơi!');
      return;
    }
    setGameState('playing');
    setPosition(0);
    setScore(0);
    nextQuestion();
  };

  const nextQuestion = () => {
    const q = questions[Math.floor(Math.random() * questions.length)];
    setCurrentQ(q);
  };

  const handleAnswer = (answer: string) => {
    if (answer === currentQ?.correctAnswer) {
      playCorrectSound();
      setIsJumping(true);
      setTimeout(() => setIsJumping(false), 500);
      
      const newPos = position + 1;
      setPosition(newPos);
      const newScore = score + 100;
      setScore(newScore);

      if (newPos >= totalSteps) {
        setGameState('result');
        addHistory({ gameName: 'Vượt chướng ngại vật', score: newScore, date: Date.now() });
      } else {
        nextQuestion();
      }
    } else {
      playWrongSound();
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      setScore(prev => Math.max(0, prev - 50));
      nextQuestion();
    }
  };

  if (gameState === 'start') {
    return (
      <div className="min-h-screen bg-emerald-900 flex flex-col items-center justify-center p-8 text-white">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-center">
          <div className="text-9xl mb-8">🏃</div>
          <h2 className="text-5xl font-bold mb-4">VƯỢT CHƯỚNG NGẠI VẬT</h2>
          <p className="text-xl text-emerald-200 mb-12 max-w-md">
            Vượt qua 20 ô thử thách để về đích. Trả lời đúng để tiến bước!
          </p>
          <button 
            onClick={startGame}
            className="bg-white text-emerald-900 px-12 py-4 rounded-full text-2xl font-bold hover:bg-emerald-100 transition-all shadow-xl"
          >
            BẮT ĐẦU ĐUA
          </button>
          <button onClick={onBack} className="block mt-6 text-emerald-400 hover:text-white transition-colors">
            Quay lại trang chủ
          </button>
        </motion.div>
      </div>
    );
  }

  if (gameState === 'playing' && currentQ) {
    return (
      <div className="min-h-screen bg-emerald-50 flex flex-col items-center p-8">
        <header className="w-full max-w-6xl flex justify-between items-center mb-8">
          <button onClick={() => setGameState('start')} className="text-emerald-700 font-bold flex items-center gap-2">
            <ChevronLeft /> Thoát
          </button>
          <div className="text-2xl font-bold text-emerald-900">Điểm: {score}</div>
        </header>

        <main className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Track Section */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-8 shadow-xl border border-emerald-100 flex flex-col justify-center">
            <div className="relative h-32 bg-emerald-100 rounded-2xl mb-12 flex items-center px-4 overflow-hidden">
              {/* Finish Line */}
              <div className="absolute right-0 top-0 bottom-0 w-8 bg-black/10 flex flex-col justify-around py-2">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className={`w-full h-2 ${i % 2 === 0 ? 'bg-white' : 'bg-black'}`} />
                ))}
              </div>

              {/* Progress Cells */}
              <div className="flex-1 flex justify-between relative z-10">
                {[...Array(totalSteps + 1)].map((_, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div className={`w-2 h-2 rounded-full ${i <= position ? 'bg-emerald-500' : 'bg-emerald-200'}`} />
                    {obstacles[i] && (
                      <span className="absolute -top-8 text-2xl">{obstacles[i]}</span>
                    )}
                  </div>
                ))}
              </div>

              {/* Character */}
              <motion.div 
                animate={{ 
                  left: `${(position / totalSteps) * 90 + 5}%`,
                  y: isJumping ? -40 : 0,
                  x: isShaking ? [0, -5, 5, -5, 5, 0] : 0
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="absolute text-5xl z-20"
                style={{ marginLeft: '-1.5rem' }}
              >
                🏃
              </motion.div>
            </div>

            <div className="flex justify-between text-emerald-800 font-bold px-2">
              <span>XUẤT PHÁT</span>
              <span>ĐÍCH</span>
            </div>
          </div>

          {/* Question Section */}
          <div className="bg-emerald-600 text-white rounded-3xl p-8 shadow-xl flex flex-col">
            <div className="mb-6">
              <span className="bg-emerald-500 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider">
                Câu hỏi hiện tại
              </span>
              <h3 className="text-2xl font-bold mt-4 leading-tight">{currentQ.text}</h3>
              {currentQ.image && (
                <img src={currentQ.image} alt="Q" className="mt-4 rounded-xl border border-emerald-500 w-full" />
              )}
            </div>
            <div className="grid grid-cols-1 gap-3 mt-auto">
              {currentQ.options.map((opt, i) => {
                const label = String.fromCharCode(65 + i);
                return (
                  <button
                    key={i}
                    onClick={() => handleAnswer(label)}
                    className="bg-white/10 hover:bg-white/20 border border-white/20 p-4 rounded-xl text-left flex items-center gap-3 transition-all group"
                  >
                    <span className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center font-bold group-hover:bg-white group-hover:text-emerald-600 transition-colors">
                      {label}
                    </span>
                    <span>{opt}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-emerald-900 flex flex-col items-center justify-center p-8 text-white">
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-center">
        <div className="text-9xl mb-8">🏁</div>
        <h2 className="text-5xl font-bold mb-2">CHÚC MỪNG!</h2>
        <p className="text-emerald-200 mb-8">Bạn đã về đích an toàn!</p>
        <div className="text-6xl font-bold mb-12">{score} ĐIỂM</div>
        <div className="flex gap-4 justify-center">
          <button onClick={startGame} className="bg-white text-emerald-900 px-8 py-3 rounded-2xl font-bold">CHƠI LẠI</button>
          <button onClick={onBack} className="bg-emerald-700 text-white px-8 py-3 rounded-2xl font-bold">TRANG CHỦ</button>
        </div>
      </motion.div>
    </div>
  );
};

export default RaceGame;
