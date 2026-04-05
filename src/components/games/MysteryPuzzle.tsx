import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, HelpCircle, Image as ImageIcon, Eye } from 'lucide-react';
import { Question, GameHistory } from '../../types';
import { playCorrectSound, playWrongSound, playTone } from '../../utils/audio';

interface MysteryPuzzleProps {
  questions: Question[];
  onBack: () => void;
  addHistory: (entry: GameHistory) => void;
}

const MysteryPuzzle: React.FC<MysteryPuzzleProps> = ({ questions, onBack, addHistory }) => {
  const [gameState, setGameState] = useState<'start' | 'playing' | 'result'>('start');
  const gridSize = 4; // 4x4 = 16 pieces
  const [revealed, setRevealed] = useState<boolean[]>(new Array(gridSize * gridSize).fill(false));
  const [activeTile, setActiveTile] = useState<number | null>(null);
  const [puzzleQuestion, setPuzzleQuestion] = useState<Question | null>(null);
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&q=80&w=1000');

  const startGame = () => {
    if (questions.length < gridSize * gridSize) {
      alert(`Cần ít nhất ${gridSize * gridSize} câu hỏi để chơi giải mã ô chữ!`);
      return;
    }
    setRevealed(new Array(gridSize * gridSize).fill(false));
    setGameState('playing');
  };

  const handleTileClick = (idx: number) => {
    if (revealed[idx] || activeTile !== null) return;
    setActiveTile(idx);
    setPuzzleQuestion(questions[idx % questions.length]);
    playTone(523, 0.1, 'sine');
  };

  const handleAnswer = (answer: string) => {
    if (activeTile === null || !puzzleQuestion) return;

    if (answer === puzzleQuestion.correctAnswer) {
      playCorrectSound();
      const newRevealed = [...revealed];
      newRevealed[activeTile] = true;
      setRevealed(newRevealed);
      if (newRevealed.every(v => v)) {
        setTimeout(() => setGameState('result'), 1500);
      }
    } else {
      playWrongSound();
    }

    setActiveTile(null);
    setPuzzleQuestion(null);
  };

  if (gameState === 'start') {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-8 text-white">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center z-10">
          <div className="text-9xl mb-8 animate-pulse text-indigo-400">🧩</div>
          <h2 className="text-6xl font-black mb-4 tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500 uppercase">
            BÍ MẬT ẨN GIẤU
          </h2>
          <p className="text-xl text-slate-400 mb-12 max-w-md mx-auto leading-relaxed">
            Trả lời các câu hỏi để lật mở từng mảnh ghép. Hãy đoán xem hình ảnh đằng sau là gì nhé!
          </p>
          <button 
            onClick={startGame}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-12 py-4 rounded-[2rem] text-2xl font-black transition-all shadow-[0_0_50px_rgba(79,70,229,0.3)] hover:scale-105 active:scale-95 flex items-center gap-3 mx-auto"
          >
            <Eye size={28} /> BẮT ĐẦU GIẢI MÃ
          </button>
          <button onClick={onBack} className="block mt-8 text-slate-500 hover:text-white transition-colors font-bold uppercase tracking-widest text-xs">
            Hủy chuyến đi
          </button>
        </motion.div>
      </div>
    );
  }

  if (gameState === 'playing') {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center p-8 text-white relative">
        <header className="w-full max-w-4xl flex justify-between items-center mb-12 z-10">
          <button onClick={onBack} className="text-slate-500 hover:text-white flex items-center gap-2 font-bold uppercase tracking-widest text-xs">
            <ChevronLeft size={16} /> Thoát
          </button>
          <div className="text-center">
             <div className="text-4xl font-black tracking-tighter text-indigo-400 italic">MẢNH GHÉP SỐ {revealed.filter(v => v).length}/{revealed.length}</div>
             <p className="text-xs font-bold text-slate-500 mt-2 tracking-[0.3em] uppercase">Hãy chọn một ô để lật</p>
          </div>
          <div className="w-10" />
        </header>

        <main className="relative p-4 bg-white/5 rounded-[3rem] border border-white/10 shadow-2xl z-10">
          <div 
             className="grid grid-cols-4 gap-2 w-full max-w-2xl aspect-square relative"
             style={{
               backgroundImage: `url(${imageUrl})`,
               backgroundSize: 'cover',
               backgroundPosition: 'center'
             }}
          >
            {revealed.map((isRevealed, i) => (
              <motion.div
                key={i}
                whileHover={!isRevealed ? { scale: 1.05, zIndex: 10 } : {}}
                onClick={() => handleTileClick(i)}
                className={`flex items-center justify-center cursor-pointer transition-all duration-700 relative ${
                  isRevealed ? 'opacity-0' : 'bg-slate-900 border border-white/5 opacity-100'
                }`}
              >
                {!isRevealed && (
                  <div className="flex flex-col items-center gap-2">
                    <HelpCircle size={24} className="text-indigo-500/50" />
                    <span className="text-xl font-black text-slate-700 italic">{i + 1}</span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </main>

        <AnimatePresence>
          {activeTile !== null && puzzleQuestion && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-950/95 backdrop-blur-3xl z-50 flex items-center justify-center p-8"
            >
              <motion.div 
                initial={{ scale: 0.9, y: 50 }} animate={{ scale: 1, y: 0 }}
                className="bg-slate-900 border border-white/10 p-12 rounded-[4rem] max-w-2xl w-full shadow-2xl relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-2 bg-indigo-600" />
                <div className="text-center mb-10">
                  <span className="text-indigo-400 font-black uppercase tracking-widest text-[10px]">THỬ THÁCH MẢNH GHÉP #{activeTile + 1}</span>
                  <h3 className="text-3xl font-black mt-8 leading-relaxed">
                    {puzzleQuestion.text}
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {puzzleQuestion.options.map((opt, i) => {
                    const label = String.fromCharCode(65 + i);
                    return (
                      <button
                        key={i}
                        onClick={() => handleAnswer(label)}
                        className="p-6 rounded-3xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-indigo-500 transition-all flex items-center gap-4 group"
                      >
                        <span className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center font-black group-hover:bg-indigo-600 group-hover:text-white transition-colors">
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
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-8 text-white selection:bg-indigo-500">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center w-full max-w-4xl">
        <h2 className="text-6xl font-black mb-2 tracking-tighter italic text-indigo-400 uppercase">CHÚC MỪNG CHIẾN THẮNG!</h2>
        <p className="text-slate-500 mb-12 font-bold tracking-[0.5em] uppercase text-xs">Bức tranh bí mật đã được giải mã</p>
        
        <div className="w-full max-w-2xl mx-auto rounded-[3rem] overflow-hidden shadow-[0_0_100px_rgba(79,70,229,0.3)] border-8 border-white/10 mb-16">
          <img src={imageUrl} alt="Secret" className="w-full h-auto" />
        </div>

        <div className="flex gap-4 justify-center">
          <button onClick={startGame} className="bg-indigo-600 hover:bg-indigo-500 text-white px-12 py-4 rounded-[2rem] font-black transition-all shadow-xl shadow-indigo-600/20">CHƠI LẠI</button>
          <button onClick={onBack} className="bg-white/10 hover:bg-white/20 text-white px-12 py-4 rounded-[2rem] font-black transition-all border border-white/10">VỀ TRANG CHỦ</button>
        </div>
      </motion.div>
    </div>
  );
};

export default MysteryPuzzle;
