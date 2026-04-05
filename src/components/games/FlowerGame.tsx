import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft } from 'lucide-react';
import { Question, GameHistory } from '../../types';
import { playCorrectSound, playWrongSound } from '../../utils/audio';

interface FlowerGameProps {
  questions: Question[];
  onBack: () => void;
  addHistory: (entry: GameHistory) => void;
}

const FlowerGame: React.FC<FlowerGameProps> = ({ questions, onBack, addHistory }) => {
  const [gameState, setGameState] = useState<'start' | 'playing' | 'result'>('start');
  const [flowers, setFlowers] = useState<{ id: number, question: Question, isPicked: boolean, isCorrect?: boolean }[]>([]);
  const [activeFlower, setActiveFlower] = useState<number | null>(null);
  const [score, setScore] = useState(0);

  const startGame = () => {
    if (questions.length < 12) {
      alert('Cần ít nhất 12 câu hỏi để bắt đầu!');
      return;
    }
    const shuffled = [...questions].sort(() => 0.5 - Math.random()).slice(0, 12);
    setFlowers(shuffled.map((q, i) => ({ id: i, question: q, isPicked: false })));
    setGameState('playing');
    setScore(0);
  };

  const handleFlowerClick = (id: number) => {
    if (flowers[id].isPicked) return;
    setActiveFlower(id);
  };

  const handleAnswer = (answer: string) => {
    if (activeFlower === null) return;
    
    const isCorrect = answer === flowers[activeFlower].question.correctAnswer;
    if (isCorrect) {
      playCorrectSound();
      setScore(prev => prev + 100);
    } else {
      playWrongSound();
    }

    const newFlowers = [...flowers];
    newFlowers[activeFlower].isPicked = true;
    newFlowers[activeFlower].isCorrect = isCorrect;
    setFlowers(newFlowers);
    setActiveFlower(null);

    if (newFlowers.every(f => f.isPicked)) {
      setGameState('result');
      addHistory({ gameName: 'Hái hoa dân chủ', score: score + (isCorrect ? 100 : 0), date: Date.now() });
    }
  };

  const flowerPositions = [
    { x: 200, y: 150 }, { x: 400, y: 100 }, { x: 600, y: 150 },
    { x: 150, y: 300 }, { x: 350, y: 250 }, { x: 550, y: 300 }, { x: 750, y: 250 },
    { x: 250, y: 450 }, { x: 450, y: 400 }, { x: 650, y: 450 },
    { x: 350, y: 550 }, { x: 550, y: 550 }
  ];

  if (gameState === 'start') {
    return (
      <div className="min-h-screen bg-blue-900 flex flex-col items-center justify-center p-8 text-white">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-center">
          <div className="text-9xl mb-8">🌸</div>
          <h2 className="text-5xl font-bold mb-4">HÁI HOA DÂN CHỦ</h2>
          <p className="text-xl text-blue-200 mb-12 max-w-md">
            Chọn những bông hoa rực rỡ trên cây và trả lời câu hỏi để nhận quà!
          </p>
          <button 
            onClick={startGame}
            className="bg-white text-blue-900 px-12 py-4 rounded-full text-2xl font-bold hover:bg-blue-100 transition-all shadow-xl"
          >
            BẮT ĐẦU CHƠI
          </button>
          <button onClick={onBack} className="block mt-6 text-blue-400 hover:text-white transition-colors">
            Quay lại trang chủ
          </button>
        </motion.div>
      </div>
    );
  }

  if (gameState === 'playing') {
    return (
      <div className="min-h-screen bg-blue-50 flex flex-col items-center p-8 overflow-hidden">
        <header className="w-full max-w-6xl flex justify-between items-center mb-4">
          <button onClick={() => setGameState('start')} className="text-blue-700 font-bold flex items-center gap-2">
            <ChevronLeft /> Thoát
          </button>
          <div className="text-2xl font-bold text-blue-900">Điểm: {score}</div>
        </header>

        <main className="relative w-full max-w-4xl aspect-square flex items-center justify-center">
          <svg viewBox="0 0 800 800" className="w-full h-full">
            <path d="M400 750 Q400 400 400 100" stroke="#5D4037" strokeWidth="40" fill="none" strokeLinecap="round" />
            <path d="M400 500 Q200 400 150 200" stroke="#5D4037" strokeWidth="20" fill="none" strokeLinecap="round" />
            <path d="M400 450 Q600 350 700 200" stroke="#5D4037" strokeWidth="20" fill="none" strokeLinecap="round" />
            <path d="M400 300 Q300 150 350 50" stroke="#5D4037" strokeWidth="15" fill="none" strokeLinecap="round" />
            <path d="M400 350 Q550 200 500 50" stroke="#5D4037" strokeWidth="15" fill="none" strokeLinecap="round" />
            
            <circle cx="400" cy="150" r="120" fill="#4CAF50" fillOpacity="0.6" />
            <circle cx="250" cy="250" r="100" fill="#4CAF50" fillOpacity="0.6" />
            <circle cx="550" cy="250" r="100" fill="#4CAF50" fillOpacity="0.6" />
            <circle cx="350" cy="400" r="130" fill="#4CAF50" fillOpacity="0.6" />
            <circle cx="500" cy="400" r="110" fill="#4CAF50" fillOpacity="0.6" />

            {flowers.map((f, i) => (
              <g 
                key={f.id} 
                transform={`translate(${flowerPositions[i].x}, ${flowerPositions[i].y})`}
                onClick={() => handleFlowerClick(f.id)}
                className="cursor-pointer group"
              >
                <motion.circle 
                  r="25" 
                  fill={f.isPicked ? (f.isCorrect ? '#FFEB3B' : '#9E9E9E') : '#FF4081'} 
                  whileHover={{ scale: 1.2 }}
                  className="transition-colors duration-500"
                />
                <motion.path 
                  d="M0 -20 Q10 -30 20 -20 Q30 -10 20 0 Q10 10 0 0 Q-10 10 -20 0 Q-30 -10 -20 -20 Q-10 -30 0 -20" 
                  fill="none" 
                  stroke="white" 
                  strokeWidth="2"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: f.isCorrect ? 1 : 0 }}
                />
                <text y="5" textAnchor="middle" fill="white" className="text-xs font-bold pointer-events-none">
                  {f.isPicked ? (f.isCorrect ? '✓' : '✗') : i + 1}
                </text>
              </g>
            ))}
          </svg>
        </main>

        <AnimatePresence>
          {activeFlower !== null && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-8"
            >
              <motion.div 
                initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
                className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl text-center"
              >
                <div className="text-6xl mb-6">🌸</div>
                <h3 className="text-3xl font-bold mb-8 text-gray-800">
                  {flowers[activeFlower].question.text}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {flowers[activeFlower].question.options.map((opt, i) => {
                    const label = String.fromCharCode(65 + i);
                    return (
                      <button
                        key={i}
                        onClick={() => handleAnswer(label)}
                        className="bg-blue-50 hover:bg-blue-600 hover:text-white p-6 rounded-2xl text-xl font-bold transition-all border-2 border-blue-100"
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-900 flex flex-col items-center justify-center p-8 text-white">
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-center">
        <div className="text-9xl mb-8">🧺</div>
        <h2 className="text-5xl font-bold mb-4">HOÀN THÀNH HÁI HOA</h2>
        <p className="text-blue-200 mb-12">Bạn đã hái hết những bông hoa kiến thức trên cây.</p>
        <div className="text-6xl font-bold mb-12">{score} ĐIỂM</div>
        <div className="flex gap-4 justify-center">
          <button onClick={startGame} className="bg-white text-blue-900 px-8 py-3 rounded-2xl font-bold">CHƠI LẠI</button>
          <button onClick={onBack} className="bg-blue-700 text-white px-8 py-3 rounded-2xl font-bold">TRANG CHỦ</button>
        </div>
      </motion.div>
    </div>
  );
};

export default FlowerGame;
