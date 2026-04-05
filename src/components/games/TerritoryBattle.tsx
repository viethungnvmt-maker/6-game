import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Map, Flag, Target } from 'lucide-react';
import { Question, GameHistory } from '../../types';
import { playCorrectSound, playWrongSound, playTone } from '../../utils/audio';

interface TerritoryBattleProps {
  questions: Question[];
  onBack: () => void;
  addHistory: (entry: GameHistory) => void;
}

const TerritoryBattle: React.FC<TerritoryBattleProps> = ({ questions, onBack, addHistory }) => {
  const [gameState, setGameState] = useState<'start' | 'playing' | 'result'>('start');
  const gridSize = 5;
  const [grid, setGrid] = useState<('A' | 'B' | null)[]>(new Array(gridSize * gridSize).fill(null));
  const [currentTurn, setCurrentTurn] = useState<'A' | 'B'>('A');
  const [activeTile, setActiveTile] = useState<number | null>(null);
  const [battleQuestion, setBattleQuestion] = useState<Question | null>(null);

  const startGame = () => {
    if (questions.length < 10) {
      alert('Cần ít nhất 10 câu hỏi để chơi tranh giành lãnh thổ!');
      return;
    }
    const newGrid = new Array(gridSize * gridSize).fill(null);
    newGrid[0] = 'A'; // Team A start
    newGrid[gridSize * gridSize - 1] = 'B'; // Team B start
    setGrid(newGrid);
    setGameState('playing');
    setCurrentTurn('A');
  };

  const isAdjacent = (idx: number, team: 'A' | 'B') => {
    const r = Math.floor(idx / gridSize);
    const c = idx % gridSize;
    const neighbors = [
      { r: r - 1, c }, { r: r + 1, c },
      { r, c: c - 1 }, { r, c: c + 1 }
    ];
    return neighbors.some(n => 
      n.r >= 0 && n.r < gridSize && 
      n.c >= 0 && n.c < gridSize && 
      grid[n.r * gridSize + n.c] === team
    );
  };

  const handleTileClick = (idx: number) => {
    if (grid[idx] === currentTurn || activeTile !== null) return;
    if (!isAdjacent(idx, currentTurn)) {
      playTone(220, 0.1, 'sawtooth');
      return;
    }

    setActiveTile(idx);
    setBattleQuestion(questions[Math.floor(Math.random() * questions.length)]);
    playTone(440, 0.2);
  };

  const handleAnswer = (answer: string) => {
    if (activeTile === null || !battleQuestion) return;

    if (answer === battleQuestion.correctAnswer) {
      playCorrectSound();
      const newGrid = [...grid];
      newGrid[activeTile] = currentTurn;
      setGrid(newGrid);
    } else {
      playWrongSound();
    }

    setActiveTile(null);
    setBattleQuestion(null);
    setCurrentTurn(prev => prev === 'A' ? 'B' : 'A');

    // Check if ending
    if (grid.every(cell => cell !== null) || questions.length === 0) {
       // Calculation and end
    }
  };

  const scoreA = grid.filter(c => c === 'A').length;
  const scoreB = grid.filter(c => c === 'B').length;

  if (gameState === 'start') {
    return (
      <div className="min-h-screen bg-emerald-950 flex flex-col items-center justify-center p-8 text-white">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center">
          <div className="text-9xl mb-8 filter drop-shadow-[0_0_30px_rgba(16,185,129,0.4)]">🗺️</div>
          <h2 className="text-6xl font-black mb-4 tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-500">
            TRANH GIÀNH LÃNH THỔ
          </h2>
          <p className="text-xl text-emerald-200/70 mb-12 max-w-md mx-auto">
            Chiến thuật và kiến thức! Mở rộng lãnh thổ của đội mình bằng cách trả lời đúng để đánh chiếm các ô đất mới.
          </p>
          <button 
            onClick={startGame}
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-12 py-4 rounded-3xl text-2xl font-black transition-all shadow-[0_0_40px_rgba(16,185,129,0.3)] hover:scale-105 active:scale-95 flex items-center gap-3"
          >
            <Flag /> BẮT ĐẦU CHINH PHỤC
          </button>
          <button onClick={onBack} className="block mt-8 text-emerald-500 hover:text-white transition-colors font-bold uppercase tracking-widest text-xs">
            TRỞ VỀ TRANG CHỦ
          </button>
        </motion.div>
      </div>
    );
  }

  if (gameState === 'playing') {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center p-8 text-white">
        <header className="w-full max-w-6xl flex justify-between items-center mb-12">
          <div className={`p-6 rounded-[2rem] border-2 transition-all ${currentTurn === 'A' ? 'border-emerald-500 bg-emerald-500/10 shadow-[0_0_30px_rgba(16,185,129,0.2)]' : 'border-transparent opacity-40'}`}>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
              <span className="text-3xl font-black text-emerald-500 tracking-tighter">{scoreA}</span>
            </div>
            <div className="text-[10px] font-black uppercase text-emerald-400/50 mt-1">Lãnh thổ xanh</div>
          </div>

          <div className="text-center group cursor-help" onClick={() => setGameState('result')}>
            <div className={`text-5xl font-black tracking-tighter transition-colors ${currentTurn === 'A' ? 'text-emerald-500' : 'text-blue-500'}`}>
               ĐẾN LƯỢT ĐỘI {currentTurn === 'A' ? 'XANH' : 'XANH DƯƠNG'}
            </div>
            <div className="text-xs font-bold text-slate-500 mt-2 tracking-widest uppercase italic">Hãy chọn một ô đất tiếp giáp</div>
          </div>

          <div className={`p-6 rounded-[2rem] border-2 transition-all ${currentTurn === 'B' ? 'border-blue-500 bg-blue-500/10 shadow-[0_0_30px_rgba(59,130,246,0.2)]' : 'border-transparent opacity-40'}`}>
            <div className="flex items-center gap-3">
              <span className="text-3xl font-black text-blue-500 tracking-tighter">{scoreB}</span>
              <div className="w-4 h-4 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
            </div>
            <div className="text-[10px] font-black uppercase text-blue-400/50 mt-1">Lãnh thổ dưng</div>
          </div>
        </header>

        <main className="relative p-6 bg-slate-900 rounded-[3rem] border border-white/5 shadow-2xl">
          <div className="grid grid-cols-5 gap-3">
            {grid.map((cell, i) => {
              const canCapture = !cell && isAdjacent(i, currentTurn);
              const isContested = cell && cell !== currentTurn && isAdjacent(i, currentTurn);
              
              return (
                <motion.div
                  key={i}
                  whileHover={canCapture || isContested ? { scale: 1.1, zIndex: 10 } : {}}
                  onClick={() => (canCapture || isContested) && handleTileClick(i)}
                  className={`w-24 h-24 rounded-2xl border-4 flex items-center justify-center cursor-pointer transition-all duration-500 relative ${
                    cell === 'A' ? 'bg-emerald-600 border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)]' :
                    cell === 'B' ? 'bg-blue-600 border-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.3)]' :
                    canCapture ? 'bg-slate-800 border-white/20 hover:border-white animate-pulse' :
                    isContested ? 'bg-orange-600/50 border-orange-500 hover:bg-orange-500' :
                    'bg-slate-900 border-white/5 opacity-50'
                  }`}
                >
                  {cell ? (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                      <Target size={32} className="text-white/30" />
                    </motion.div>
                  ) : (canCapture || isContested) ? (
                    <Target size={32} className="text-white/10" />
                  ) : null}
                </motion.div>
              );
            })}
          </div>
        </main>

        <AnimatePresence>
          {activeTile !== null && battleQuestion && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-950/95 backdrop-blur-xl z-50 flex items-center justify-center p-8"
            >
              <div className="relative w-full max-w-2xl bg-slate-900 border border-white/10 rounded-[3rem] p-12 shadow-2xl overflow-hidden">
                <div className={`absolute top-0 left-0 w-full h-3 ${currentTurn === 'A' ? 'bg-emerald-500' : 'bg-blue-500'}`} />
                <div className="text-center mb-10">
                   <div className="text-sm font-black text-slate-500 uppercase tracking-widest mb-4">Chiếm đóng lãnh thổ</div>
                   <h3 className="text-3xl font-black leading-relaxed">{battleQuestion.text}</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {battleQuestion.options.map((opt, i) => {
                    const label = String.fromCharCode(65 + i);
                    return (
                      <button
                        key={i}
                        onClick={() => handleAnswer(label)}
                        className={`p-6 rounded-2xl text-left flex items-center gap-4 transition-all group border-2 ${
                          currentTurn === 'A' ? 'border-emerald-500/10 hover:bg-emerald-500/10 hover:border-emerald-500' : 
                          'border-blue-500/10 hover:bg-blue-500/10 hover:border-blue-500'
                        }`}
                      >
                        <span className={`w-10 h-10 rounded-xl flex items-center justify-center font-black transition-colors ${
                          currentTurn === 'A' ? 'bg-emerald-500/20 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white' : 
                          'bg-blue-500/20 text-blue-400 group-hover:bg-blue-500 group-hover:text-white'
                        }`}>
                          {label}
                        </span>
                        <span className="text-lg font-bold">{opt}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button onClick={onBack} className="mt-12 text-slate-500 hover:text-white flex items-center gap-2 font-black uppercase text-xs">
          <ChevronLeft size={16} /> BỎ CUỘC
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-8 text-white">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center max-w-xl">
        <h2 className="text-6xl font-black mb-2 tracking-tighter italic text-emerald-400">CHIẾN DỊCH KẾT THÚC</h2>
        <p className="text-slate-500 mb-12 font-bold uppercase tracking-[0.4em] text-xs">Phân chia quyền lực lãnh thổ</p>
        
        <div className="flex gap-1 items-end h-64 mb-16 px-12">
          <div className="flex-1 flex flex-col items-center">
            <div className="text-4xl font-black text-emerald-500 mb-4">{scoreA}</div>
            <motion.div initial={{ height: 0 }} animate={{ height: `${(scoreA/25)*100}%` }} className="w-full bg-emerald-600 rounded-t-3xl shadow-[0_0_40px_rgba(16,185,129,0.3)]" />
            <div className="mt-4 font-black uppercase text-xs text-emerald-400">Team Xanh</div>
          </div>
          <div className="w-8" />
          <div className="flex-1 flex flex-col items-center">
            <div className="text-4xl font-black text-blue-500 mb-4">{scoreB}</div>
            <motion.div initial={{ height: 0 }} animate={{ height: `${(scoreB/25)*100}%` }} className="w-full bg-blue-600 rounded-t-3xl shadow-[0_0_40px_rgba(59,130,246,0.3)]" />
            <div className="mt-4 font-black uppercase text-xs text-blue-400">Team Dương</div>
          </div>
        </div>

        <div className="text-5xl font-black mb-12 animate-pulse text-white">
          {scoreA > scoreB ? 'XANH CHINH PHỤC THÀNH CÔNG!' : 
           scoreB > scoreA ? 'XANH DƯƠNG LÊN NGÔI!' : 
           'BẤT PHÂN THẮNG BẠI!'}
        </div>

        <div className="flex gap-4 justify-center">
          <button onClick={startGame} className="bg-emerald-600 hover:bg-emerald-500 text-white px-12 py-4 rounded-3xl font-black transition-all">CHƠI LẠI</button>
          <button onClick={onBack} className="bg-white/10 hover:bg-white/20 text-white px-12 py-4 rounded-3xl font-black transition-all border border-white/10">TRANG CHỦ</button>
        </div>
      </motion.div>
    </div>
  );
};

export default TerritoryBattle;
