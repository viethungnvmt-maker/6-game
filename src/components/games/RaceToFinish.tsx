import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Flag, Trophy, Dice1 as Dice, ArrowRight, ArrowLeft } from 'lucide-react';
import { Question, GameHistory } from '../../types';
import { playCorrectSound, playWrongSound, playTone } from '../../utils/audio';

interface RaceToFinishProps {
  questions: Question[];
  onBack: () => void;
  addHistory: (entry: GameHistory) => void;
}

const RaceToFinish: React.FC<RaceToFinishProps> = ({ questions, onBack, addHistory }) => {
  const [gameState, setGameState] = useState<'start' | 'playing' | 'result'>('start');
  const [pos, setPos] = useState(0);
  const targetPos = 30;
  const [isRolling, setIsRolling] = useState(false);
  const [lastRoll, setLastRoll] = useState(0);
  const [activeQuestion, setActiveQuestion] = useState<Question | null>(null);

  const rollDice = () => {
    if (isRolling || activeQuestion) return;
    setIsRolling(true);
    playTone(400, 0.5, 'triangle');
    
    setTimeout(() => {
      const roll = Math.floor(Math.random() * 6) + 1;
      setLastRoll(roll);
      setIsRolling(false);
      
      const newPos = Math.min(targetPos, pos + roll);
      setPos(newPos);
      
      if (newPos === targetPos) {
        setGameState('result');
      } else {
        const q = questions[Math.floor(Math.random() * questions.length)];
        setActiveQuestion(q);
      }
    }, 1000);
  };

  const handleAnswer = (answer: string) => {
    if (!activeQuestion) return;

    if (answer === activeQuestion.correctAnswer) {
      playCorrectSound();
    } else {
      playWrongSound();
      setPos(prev => Math.max(0, prev - 2));
    }
    setActiveQuestion(null);
  };

  if (gameState === 'start') {
    return (
      <div className="min-h-screen bg-rose-950 flex flex-col items-center justify-center p-8 text-white relative">
         <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-center z-10">
            <div className="text-9xl mb-8 animate-bounce-slow text-rose-500">🏁</div>
            <h2 className="text-6xl font-black mb-4 tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-orange-500 uppercase">
               ĐƯỜNG ĐUA KỲ THÚ
            </h2>
            <p className="text-xl text-rose-200 mb-12 max-w-md mx-auto leading-relaxed font-bold italic">
               Xúc xắc đã sẵn sàng! Di chuyển trên bàn cờ và trả lời đúng các câu hỏi để về đích đầu tiên.
            </p>
            <button 
              onClick={() => setGameState('playing')}
              className="bg-rose-600 hover:bg-rose-500 text-white px-12 py-4 rounded-[2rem] text-2xl font-black transition-all shadow-[0_0_50px_rgba(225,29,72,0.3)] hover:scale-105 active:scale-95 flex items-center gap-3 mx-auto"
            >
              <Dice size={28} /> BẮT ĐẦU ĐUA
            </button>
            <button onClick={onBack} className="block mt-8 text-rose-400 hover:text-white transition-colors font-bold uppercase tracking-widest text-xs">
              Về vạch xuất phát
            </button>
         </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center p-8 text-white relative overflow-hidden">
       <header className="w-full max-w-6xl flex justify-between items-center mb-16 z-10">
          <button onClick={onBack} className="text-slate-500 hover:text-white flex items-center gap-2 font-black uppercase text-xs tracking-widest">
             <ChevronLeft size={16} /> THOÁT
          </button>
          
          <div className="flex bg-white/5 border border-white/10 rounded-[2rem] px-8 py-4 items-center gap-6">
             <div className="text-left">
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Vị trí hiện tại</div>
                <div className="text-4xl font-black tabular-nums text-rose-500">{pos}/{targetPos}</div>
             </div>
             <div className="w-px h-10 bg-white/10" />
             <div className="text-left">
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Xúc xắc</div>
                <div className="text-4xl font-black tabular-nums text-white">+{lastRoll}</div>
             </div>
          </div>
          
          <div className="w-10" />
       </header>

       <main className="w-full max-w-6xl z-10 flex flex-col items-center">
          <div className="relative w-full overflow-x-auto pb-12 mb-12 scrollbar-none">
             <div className="flex gap-2 items-center min-w-max px-4">
                {[...Array(targetPos + 1)].map((_, i) => (
                   <motion.div
                      key={i}
                      className={`w-12 h-12 md:w-16 md:h-16 rounded-xl border flex items-center justify-center font-black relative ${
                         i === pos ? 'bg-rose-600 border-rose-400 shadow-[0_0_30px_rgba(225,29,72,0.5)] scale-110 z-10' :
                         i === targetPos ? 'bg-yellow-500 border-yellow-300' :
                         i < pos ? 'bg-rose-900/30 border-rose-500/20 text-rose-500/50' :
                         'bg-slate-900 border-white/5 opacity-50'
                      }`}
                   >
                      {i === pos && (
                         <motion.div 
                           layoutId="player" 
                           className="absolute -top-12 text-4xl"
                           initial={{ y: -20 }} animate={{ y: 0 }}
                         >
                            🏎️
                         </motion.div>
                      )}
                      {i === targetPos ? <Flag size={24} /> : i}
                   </motion.div>
                ))}
             </div>
          </div>

          <div className="flex flex-col md:flex-row gap-12 w-full max-w-4xl items-center">
             <div className="flex-1 flex flex-col items-center justify-center p-12 bg-white/5 rounded-[3rem] border border-white/10 relative">
                <AnimatePresence mode="wait">
                   {isRolling ? (
                      <motion.div 
                        key="rolling"
                        animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 0.5 }}
                        className="text-8xl"
                      >
                         🎲
                      </motion.div>
                   ) : (
                      <motion.div 
                        key="stopped"
                        initial={{ scale: 0 }} animate={{ scale: 1 }}
                        className="flex flex-col items-center gap-8"
                      >
                         <div className="text-9xl text-rose-500 bg-rose-500/10 p-12 rounded-[3.5rem] border border-rose-500/20 shadow-2xl">
                            {lastRoll === 0 ? <Dice size={96} /> : lastRoll}
                         </div>
                         <button 
                            onClick={rollDice}
                            disabled={!!activeQuestion}
                            className="bg-white text-slate-950 px-12 py-5 rounded-[2rem] text-3xl font-black transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
                         >
                            XÚC XẮC!
                         </button>
                      </motion.div>
                   )}
                </AnimatePresence>
             </div>

             <div className="flex-1 w-full">
                <AnimatePresence mode="wait">
                   {activeQuestion ? (
                      <motion.div 
                        key={activeQuestion.id}
                        initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -50, opacity: 0 }}
                        className="space-y-6"
                      >
                         <div className="bg-slate-900 border border-white/10 p-10 rounded-[3rem] shadow-2xl relative text-center">
                            <span className="text-rose-400 font-black uppercase text-[10px] tracking-widest">Thử thách tại ô {pos}</span>
                            <h3 className="text-2xl font-black mt-6 leading-relaxed italic">{activeQuestion.text}</h3>
                         </div>

                         <div className="grid grid-cols-1 gap-3">
                            {activeQuestion.options.map((opt, i) => {
                               const label = String.fromCharCode(65 + i);
                               return (
                                 <button
                                   key={i}
                                   onClick={() => handleAnswer(label)}
                                   className="p-6 rounded-[2rem] bg-white/5 hover:bg-rose-500/10 border-2 border-white/10 hover:border-rose-500 transition-all text-left flex items-center gap-4 group"
                                 >
                                    <span className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center font-black group-hover:bg-rose-600 group-hover:text-white transition-colors shrink-0">
                                       {label}
                                    </span>
                                    <span className="text-lg font-bold">{opt}</span>
                                 </button>
                               );
                            })}
                         </div>
                      </motion.div>
                   ) : (
                      <div className="h-full flex flex-col items-center justify-center text-center p-12 bg-rose-950/20 rounded-[3rem] border border-rose-500/10 border-dashed">
                         {pos === 0 ? (
                            <p className="text-xl font-bold text-rose-500/50 leading-relaxed italic">Hãy đổ xúc xắc để bắt đầu cuộc đua kỳ thú!</p>
                         ) : (
                            <div className="flex flex-col items-center gap-4">
                               <ArrowRight className="text-green-500 animate-bounce" size={48} />
                               <p className="text-2xl font-black text-rose-200 uppercase tracking-tighter">Bạn đã tiến lên {lastRoll} bước!</p>
                               <span className="text-xs font-bold text-rose-500 uppercase tracking-widest">Sẵn sàng cho lượt đổ tiếp theo</span>
                            </div>
                         )}
                      </div>
                   )}
                </AnimatePresence>
             </div>
          </div>
       </main>

       {gameState === 'result' && (
          <motion.div 
             initial={{ opacity: 0 }} animate={{ opacity: 1 }}
             className="fixed inset-0 bg-rose-950 z-[100] flex flex-col items-center justify-center p-8 text-center"
          >
             <div className="text-9xl mb-8">🏁</div>
             <h2 className="text-7xl font-black mb-4 tracking-tighter text-yellow-400 uppercase italic">VỀ ĐÍCH THÀNH CÔNG!</h2>
             <p className="text-slate-200 mb-12 font-bold tracking-[0.4em] uppercase text-xs">Bạn đã hoàn thành đường đua tuyệt vời</p>
             
             <div className="flex gap-4">
                <button onClick={() => { setPos(0); setGameState('playing'); setLastRoll(0); }} className="bg-rose-600 hover:bg-rose-500 text-white px-12 py-4 rounded-[2rem] font-black transition-all shadow-xl shadow-rose-600/20 text-xl flex items-center gap-3">
                   <Trophy size={24} /> CHƠI LẠI
                </button>
                <button onClick={onBack} className="bg-white/10 hover:bg-white/20 text-white px-12 py-4 rounded-[2rem] font-black transition-all border border-white/10 text-xl">TRANG CHỦ</button>
             </div>
          </motion.div>
       )}
    </div>
  );
};

export default RaceToFinish;
