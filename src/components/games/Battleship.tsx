import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Target, Anchor, Bomb, Waves } from 'lucide-react';
import { Question, GameHistory } from '../../types';
import { playCorrectSound, playWrongSound, playTone } from '../../utils/audio';

interface BattleshipProps {
  questions: Question[];
  onBack: () => void;
  addHistory: (entry: GameHistory) => void;
}

const Battleship: React.FC<BattleshipProps> = ({ questions, onBack, addHistory }) => {
  const [gameState, setGameState] = useState<'start' | 'playing' | 'result'>('start');
  const gridSize = 6;
  const [grid, setGrid] = useState<('hit' | 'miss' | null)[]>(new Array(gridSize * gridSize).fill(null));
  const [ships, setShips] = useState<number[]>([]);
  const [activeTile, setActiveTile] = useState<number | null>(null);
  const [battleQuestion, setBattleQuestion] = useState<Question | null>(null);
  const [shots, setShots] = useState(0);

  const startGame = () => {
    // Randomize 5 ships
    const newShips: number[] = [];
    while (newShips.length < 5) {
      const pos = Math.floor(Math.random() * (gridSize * gridSize));
      if (!newShips.includes(pos)) newShips.push(pos);
    }
    setShips(newShips);
    setGrid(new Array(gridSize * gridSize).fill(null));
    setGameState('playing');
    setShots(0);
  };

  const handleTileClick = (idx: number) => {
    if (grid[idx] !== null || activeTile !== null) return;
    setActiveTile(idx);
    setBattleQuestion(questions[Math.floor(Math.random() * questions.length)]);
    playTone(200, 0.4, 'sine'); // Sonar
  };

  const handleAnswer = (answer: string) => {
    if (activeTile === null || !battleQuestion) return;

    if (answer === battleQuestion.correctAnswer) {
      playCorrectSound();
      const isHit = ships.includes(activeTile);
      const newGrid = [...grid];
      newGrid[activeTile] = isHit ? 'hit' : 'miss';
      setGrid(newGrid);
      if (isHit) playTone(150, 0.5, 'sawtooth'); // Explosion
    } else {
      playWrongSound();
    }

    setShots(prev => prev + 1);
    setActiveTile(null);
    setBattleQuestion(null);

    // Check if won
    const hits = grid.filter((v, i) => v === 'hit' || (i === activeTile && ships.includes(i) && answer === battleQuestion.correctAnswer)).length;
    if (hits === 5) {
      setTimeout(() => setGameState('result'), 1500);
    }
  };

  if (gameState === 'start') {
    return (
      <div className="min-h-screen bg-blue-950 flex flex-col items-center justify-center p-8 text-white">
        <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-center">
          <div className="text-9xl mb-8 animate-bounce-slow text-cyan-400">🚢</div>
          <h2 className="text-6xl font-black mb-4 tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-500 uppercase">
            HẢI CHIẾN ĐẠI DƯƠNG
          </h2>
          <p className="text-xl text-blue-200/70 mb-12 max-w-md mx-auto leading-relaxed">
            Tìm và tiêu diệt các tàu địch đang ẩn nấp trong đại dương bằng cách trả lời đúng các câu hỏi!
          </p>
          <button 
            onClick={startGame}
            className="bg-cyan-600 hover:bg-cyan-500 text-white px-12 py-4 rounded-[2rem] text-2xl font-black transition-all shadow-[0_0_50px_rgba(8,145,178,0.3)] hover:scale-105 active:scale-95 flex items-center gap-3 mx-auto"
          >
            <Bomb size={28} /> KHAI HỎA
          </button>
          <button onClick={onBack} className="block mt-8 text-blue-500 hover:text-white transition-colors font-bold uppercase tracking-widest text-xs">
            Hủy chiến dịch
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center p-8 text-white relative">
      <header className="w-full max-w-4xl flex justify-between items-center mb-12 z-10">
        <div className="flex items-center gap-3 bg-white/5 px-6 py-3 rounded-2xl border border-white/10">
           <Target className="text-cyan-400" size={24} />
           <div className="text-2xl font-black tracking-tighter">{grid.filter(v => v === 'hit').length}/5 CHÚM</div>
        </div>
        
        <div className="text-center">
          <div className="text-3xl font-black tracking-tighter uppercase italic text-cyan-400">Đại dương số {shots}</div>
          <p className="text-xs font-bold text-slate-500 mt-2 tracking-[0.3em] uppercase">Hãy chọn tọa độ khai hỏa</p>
        </div>

        <button onClick={onBack} className="text-slate-500 hover:text-white flex items-center gap-2 font-bold uppercase tracking-widest text-xs">
          <ChevronLeft size={16} /> Thoát
        </button>
      </header>

      <main className="relative p-6 bg-blue-900/20 rounded-[3rem] border border-blue-500/10 shadow-2xl z-10 backdrop-blur-sm">
        <div className="grid grid-cols-6 gap-3">
          {grid.map((cell, i) => (
            <motion.div
              key={i}
              whileHover={cell === null ? { scale: 1.1, backgroundColor: 'rgba(34, 211, 238, 0.1)' } : {}}
              onClick={() => handleTileClick(i)}
              className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl border-2 flex items-center justify-center cursor-pointer transition-all duration-300 relative overflow-hidden ${
                cell === 'hit' ? 'bg-red-600 border-red-400 shadow-[0_0_20px_rgba(220,38,38,0.4)]' :
                cell === 'miss' ? 'bg-blue-600/20 border-blue-500/20 shadow-inner' :
                'bg-blue-950/40 border-blue-500/10 hover:border-cyan-400'
              }`}
            >
              {cell === 'hit' ? (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex flex-col items-center">
                  <Bomb size={32} className="text-white animate-pulse" />
                </motion.div>
              ) : cell === 'miss' ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <Waves size={24} className="text-blue-400/30" />
                </motion.div>
              ) : (
                <span className="text-[10px] font-black text-blue-500/20 uppercase tracking-tighter">
                  {String.fromCharCode(65 + Math.floor(i / 6))}{i % 6 + 1}
                </span>
              )}
            </motion.div>
          ))}
        </div>
      </main>

      <AnimatePresence>
        {activeTile !== null && battleQuestion && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/95 backdrop-blur-3xl z-50 flex items-center justify-center p-8"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 50 }} animate={{ scale: 1, y: 0 }}
              className="bg-slate-900 border border-cyan-500/30 p-12 rounded-[4rem] max-w-2xl w-full shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-cyan-600" />
              <div className="text-center mb-10">
                <div className="flex justify-center mb-6">
                   <div className="w-16 h-16 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400">
                      <Anchor size={32} />
                   </div>
                </div>
                <span className="text-cyan-400 font-black uppercase tracking-widest text-[10px]">Tọa độ khai hỏa: {String.fromCharCode(65 + Math.floor(activeTile / 6))}{activeTile % 6 + 1}</span>
                <h3 className="text-3xl font-black mt-8 leading-relaxed">
                  {battleQuestion.text}
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {battleQuestion.options.map((opt, i) => {
                  const label = String.fromCharCode(65 + i);
                  return (
                    <button
                      key={i}
                      onClick={() => handleAnswer(label)}
                      className="p-6 rounded-3xl bg-white/5 hover:bg-cyan-500/10 border border-white/10 hover:border-cyan-500 transition-all flex items-center gap-4 group"
                    >
                      <span className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center font-black group-hover:bg-cyan-600 group-hover:text-white transition-colors">
                        {label}
                      </span>
                      <span className="text-lg font-bold">{opt}</span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {gameState === 'result' && (
         <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="fixed inset-0 bg-blue-950 z-[100] flex flex-col items-center justify-center p-8 text-center"
         >
            <div className="text-9xl mb-8">🎖️</div>
            <h2 className="text-6xl font-black mb-2 tracking-tighter text-cyan-400 uppercase italic">HẢI CHIẾN THẮNG LỢI</h2>
            <p className="text-slate-400 mb-12 font-bold tracking-[0.4em] uppercase text-xs">Bạn đã tiêu diệt toàn bộ hạm đội địch sau {shots} lần khai hỏa</p>
            
            <div className="flex gap-4">
              <button onClick={startGame} className="bg-cyan-600 hover:bg-cyan-500 text-white px-12 py-4 rounded-[2rem] font-black transition-all">CHƠI LẠI</button>
              <button onClick={onBack} className="bg-white/10 hover:bg-white/20 text-white px-12 py-4 rounded-[2rem] font-black transition-all border border-white/10">TRANG CHỦ</button>
            </div>
         </motion.div>
      )}
    </div>
  );
};

export default Battleship;
