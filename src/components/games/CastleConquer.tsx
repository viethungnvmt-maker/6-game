import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Shield, Swords, TowerControl as Tower } from 'lucide-react';
import { Question, GameHistory } from '../../types';
import { playCorrectSound, playWrongSound, playTone } from '../../utils/audio';

interface CastleConquerProps {
  questions: Question[];
  onBack: () => void;
  addHistory: (entry: GameHistory) => void;
}

const CastleConquer: React.FC<CastleConquerProps> = ({ questions, onBack, addHistory }) => {
  const [gameState, setGameState] = useState<'start' | 'playing' | 'result'>('start');
  const [castles, setCastles] = useState<{ id: number, owner: 'A' | 'B' | null, question: Question }[]>([]);
  const [activeCastle, setActiveCastle] = useState<number | null>(null);
  const [currentTurn, setCurrentTurn] = useState<'A' | 'B'>('A');
  const [scores, setScores] = useState({ A: 0, B: 0 });

  const startGame = () => {
    if (questions.length < 9) {
      alert('Cần ít nhất 9 câu hỏi để chơi công thành chiến!');
      return;
    }
    const shuffled = [...questions].sort(() => 0.5 - Math.random()).slice(0, 9);
    setCastles(shuffled.map((q, i) => ({ id: i, owner: null, question: q })));
    setGameState('playing');
    setScores({ A: 0, B: 0 });
    setCurrentTurn('A');
  };

  const handleCastleClick = (id: number) => {
    if (castles[id].owner || activeCastle !== null) return;
    setActiveCastle(id);
    playTone(440, 0.2, 'sawtooth');
  };

  const handleAnswer = (answer: string) => {
    if (activeCastle === null) return;
    
    const isCorrect = answer === castles[activeCastle].question.correctAnswer;
    if (isCorrect) {
      playCorrectSound();
      const newCastles = [...castles];
      newCastles[activeCastle].owner = currentTurn;
      setCastles(newCastles);
      setScores(prev => ({ ...prev, [currentTurn]: prev[currentTurn] + 1 }));
    } else {
      playWrongSound();
    }

    setActiveCastle(null);
    setCurrentTurn(prev => prev === 'A' ? 'B' : 'A');

    if (castles.every(c => c.owner !== null || (c.id === activeCastle && isCorrect)) || castles.filter(c => !c.owner).length === 1 && !isCorrect) {
       // Check if last castle or all captured
       const remaining = castles.filter(c => !c.owner).length;
       if (remaining === (isCorrect ? 0 : 1)) {
         setTimeout(() => {
           setGameState('result');
           addHistory({ 
             gameName: 'Công thành chiến', 
             score: Math.max(scores.A, scores.B), 
             teams: [{ name: 'Đội A', score: scores.A }, { name: 'Đội B', score: scores.B }],
             date: Date.now() 
           });
         }, 1000);
       }
    }
  };

  if (gameState === 'start') {
    return (
      <div className="min-h-screen bg-orange-950 flex flex-col items-center justify-center p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-20" />
        <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-center z-10">
          <div className="text-9xl mb-8 filter drop-shadow-[0_0_20px_rgba(249,115,22,0.5)]">🏰</div>
          <h2 className="text-6xl font-black mb-4 tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-orange-400 to-red-600">
            CÔNG THÀNH CHIẾN
          </h2>
          <p className="text-xl text-orange-200 mb-12 max-w-md mx-auto leading-relaxed">
            Chia lớp thành 2 đội. Chiếm đóng các tòa lâu đài bằng cách trả lời đúng câu hỏi kiến thức!
          </p>
          <div className="flex gap-4 justify-center">
            <button 
              onClick={startGame}
              className="bg-orange-600 hover:bg-orange-500 text-white px-12 py-4 rounded-2xl text-2xl font-bold transition-all shadow-[0_0_40px_rgba(234,88,12,0.4)] hover:scale-105 active:scale-95 flex items-center gap-3"
            >
              <Swords /> KHAI CHIẾN
            </button>
          </div>
          <button onClick={onBack} className="block mt-8 text-orange-400 hover:text-white transition-colors font-bold uppercase tracking-widest text-sm">
            Quay lại trang chủ
          </button>
        </motion.div>
      </div>
    );
  }

  if (gameState === 'playing') {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center p-8 text-white relative overflow-hidden">
        <header className="w-full max-w-6xl flex justify-between items-center mb-12 z-10">
          <div className={`p-4 rounded-2xl border-2 transition-all ${currentTurn === 'A' ? 'border-blue-500 bg-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.3)]' : 'border-transparent opacity-50'}`}>
            <div className="text-xs font-black uppercase text-blue-400 mb-1">Đội Xanh</div>
            <div className="text-3xl font-black">{scores.A} Lâu đài</div>
          </div>

          <div className="text-center">
            <div className="text-sm font-bold text-slate-500 uppercase tracking-[0.3em] mb-2">Đang tham chiến</div>
            <div className={`text-4xl font-black tracking-tighter ${currentTurn === 'A' ? 'text-blue-500' : 'text-red-500'}`}>
              LƯỢT ĐỘI {currentTurn === 'A' ? 'XANH' : 'ĐỎ'}
            </div>
          </div>

          <div className={`p-4 rounded-2xl border-2 transition-all ${currentTurn === 'B' ? 'border-red-500 bg-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.3)]' : 'border-transparent opacity-50'}`}>
            <div className="text-xs font-black uppercase text-red-400 mb-1">Đội Đỏ</div>
            <div className="text-3xl font-black">{scores.B} Lâu đài</div>
          </div>
        </header>

        <main className="w-full max-w-4xl grid grid-cols-3 gap-6 z-10">
          {castles.map((castle, i) => (
            <motion.div
              key={i}
              whileHover={castle.owner ? {} : { scale: 1.05 }}
              whileTap={castle.owner ? {} : { scale: 0.95 }}
              onClick={() => handleCastleClick(i)}
              className={`aspect-square rounded-3xl border-4 flex flex-col items-center justify-center cursor-pointer transition-all duration-500 relative overflow-hidden ${
                castle.owner === 'A' ? 'bg-blue-600 border-blue-400 shadow-[0_0_30px_rgba(37,99,235,0.4)]' :
                castle.owner === 'B' ? 'bg-red-600 border-red-400 shadow-[0_0_30px_rgba(220,38,38,0.4)]' :
                'bg-slate-800 border-slate-700 hover:border-slate-500'
              }`}
            >
              {castle.owner ? (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex flex-col items-center">
                  <Shield size={64} className="mb-2" />
                  <span className="font-black text-xl uppercase tracking-tighter">ĐÃ CHIẾM</span>
                </motion.div>
              ) : (
                <>
                  <Tower size={48} className="text-slate-500 mb-4" />
                  <span className="text-4xl font-black text-slate-600 italic">#{i + 1}</span>
                </>
              )}
            </motion.div>
          ))}
        </main>

        <AnimatePresence>
          {activeCastle !== null && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex items-center justify-center p-8"
            >
              <motion.div 
                initial={{ scale: 0.9, y: 50 }} animate={{ scale: 1, y: 0 }}
                className={`bg-slate-900 border-4 p-10 rounded-[3rem] max-w-2xl w-full shadow-2xl relative overflow-hidden ${
                  currentTurn === 'A' ? 'border-blue-500' : 'border-red-500'
                }`}
              >
                <div className={`absolute top-0 left-0 w-full h-2 ${currentTurn === 'A' ? 'bg-blue-500' : 'bg-red-500'}`} />
                <div className="mb-10 text-center">
                  <span className={`px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest ${
                    currentTurn === 'A' ? 'bg-blue-500/20 text-blue-400' : 'bg-red-500/20 text-red-400'
                  }`}>
                    Thử thách tấn công lâu đài #{activeCastle + 1}
                  </span>
                  <h3 className="text-3xl font-bold mt-6 leading-relaxed">
                    {castles[activeCastle].question.text}
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {castles[activeCastle].question.options.map((opt, i) => {
                    const label = String.fromCharCode(65 + i);
                    return (
                      <button
                        key={i}
                        onClick={() => handleAnswer(label)}
                        className={`p-6 rounded-2xl text-left flex items-center gap-4 transition-all group border-2 ${
                          currentTurn === 'A' ? 'border-blue-500/20 hover:bg-blue-500/10 hover:border-blue-500' : 
                          'border-red-500/20 hover:bg-red-500/10 hover:border-red-500'
                        }`}
                      >
                        <span className={`w-10 h-10 rounded-lg flex items-center justify-center font-black transition-colors ${
                          currentTurn === 'A' ? 'bg-blue-500/20 text-blue-400 group-hover:bg-blue-500 group-hover:text-white' : 
                          'bg-red-500/20 text-red-400 group-hover:bg-red-500 group-hover:text-white'
                        }`}>
                          {label}
                        </span>
                        <span className="text-xl font-medium">{opt}</span>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <button 
          onClick={onBack}
          className="mt-12 text-slate-500 hover:text-white transition-colors flex items-center gap-2 font-bold uppercase tracking-widest text-xs"
        >
          <ChevronLeft size={16} /> Rút quân
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-8 text-white">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center max-w-lg">
        <div className="text-9xl mb-8">🎖️</div>
        <h2 className="text-5xl font-black mb-2 tracking-tighter italic">TRẬN CHIẾN KẾT THÚC</h2>
        <p className="text-slate-400 mb-12 font-bold tracking-widest uppercase text-sm">Thống kê chiến trường</p>
        
        <div className="grid grid-cols-2 gap-6 mb-12">
          <div className="bg-blue-600/10 border border-blue-500/30 p-8 rounded-3xl">
            <div className="text-blue-400 font-black mb-2 uppercase tracking-widest text-xs">Đội Xanh</div>
            <div className="text-6xl font-black text-blue-500">{scores.A}</div>
          </div>
          <div className="bg-red-600/10 border border-red-500/30 p-8 rounded-3xl">
            <div className="text-red-400 font-black mb-2 uppercase tracking-widest text-xs">Đội Đỏ</div>
            <div className="text-6xl font-black text-red-500">{scores.B}</div>
          </div>
        </div>

        <div className="text-4xl font-black mb-12 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-600 animate-pulse">
          {scores.A > scores.B ? 'ĐỘI XANH CHIẾN THẮNG!' : 
           scores.B > scores.A ? 'ĐỘI ĐỎ CHIẾN THẮNG!' : 
           'KẾT QUẢ HÒA!'}
        </div>

        <div className="flex gap-4 justify-center">
          <button 
            onClick={startGame}
            className="bg-orange-600 hover:bg-orange-500 text-white px-10 py-3 rounded-2xl font-black transition-all shadow-xl shadow-orange-600/20"
          >
            TÁI CHIẾN
          </button>
          <button 
            onClick={onBack}
            className="bg-white/10 hover:bg-white/20 text-white px-10 py-3 rounded-2xl font-black transition-all border border-white/10"
          >
            VỀ THÀNH
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default CastleConquer;
