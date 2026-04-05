import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Hammer, Trophy, TrendingUp } from 'lucide-react';
import { Question, GameHistory } from '../../types';
import { playCorrectSound, playWrongSound, playTone } from '../../utils/audio';

interface TowerBuilderProps {
  questions: Question[];
  onBack: () => void;
  addHistory: (entry: GameHistory) => void;
}

const TowerBuilder: React.FC<TowerBuilderProps> = ({ questions, onBack, addHistory }) => {
  const [gameState, setGameState] = useState<'start' | 'playing' | 'result'>('start');
  const [height, setHeight] = useState(0);
  const targetHeight = 10;
  const [activeQuestion, setActiveQuestion] = useState<Question | null>(null);

  const startGame = () => {
    setHeight(0);
    setGameState('playing');
    askNext();
  };

  const askNext = () => {
    const q = questions[Math.floor(Math.random() * questions.length)];
    setActiveQuestion(q);
  };

  const handleAnswer = (answer: string) => {
    if (!activeQuestion) return;

    if (answer === activeQuestion.correctAnswer) {
      playCorrectSound();
      const newHeight = height + 1;
      setHeight(newHeight);
      if (newHeight >= targetHeight) {
        setTimeout(() => setGameState('result'), 1500);
      } else {
        setTimeout(askNext, 1000);
      }
    } else {
      playWrongSound();
      setActiveQuestion(null);
      setTimeout(askNext, 1000);
    }
  };

  if (gameState === 'start') {
    return (
      <div className="min-h-screen bg-amber-950 flex flex-col items-center justify-center p-8 text-white relative">
        <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-center z-10">
          <div className="text-9xl mb-8 animate-bounce-slow text-amber-500">🧱</div>
          <h2 className="text-6xl font-black mb-4 tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-yellow-600 uppercase">
            XÂY THÁP KIẾN THỨC
          </h2>
          <p className="text-xl text-amber-200/70 mb-12 max-w-md mx-auto leading-relaxed">
            Mỗi câu trả lời đúng sẽ giúp bạn đặt thêm một viên gạch. Hãy xây dựng tòa tháp cao nhất lớp!
          </p>
          <button 
            onClick={startGame}
            className="bg-amber-600 hover:bg-amber-500 text-white px-12 py-4 rounded-[2rem] text-2xl font-black transition-all shadow-[0_0_50px_rgba(217,119,6,0.3)] hover:scale-105 active:scale-95 flex items-center gap-3 mx-auto"
          >
            <Hammer size={28} /> BẮT ĐẦU XÂY
          </button>
          <button onClick={onBack} className="block mt-8 text-amber-500 hover:text-white transition-colors font-bold uppercase tracking-widest text-xs">
            Rời công trường
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center p-8 text-white relative overflow-hidden">
      <header className="w-full max-w-4xl flex justify-between items-center mb-20 z-10">
        <button onClick={onBack} className="text-slate-500 hover:text-white flex items-center gap-2 font-bold uppercase tracking-widest text-xs">
          <ChevronLeft size={16} /> Thoát
        </button>
        <div className="text-center">
           <div className="flex items-center gap-3 justify-center mb-2">
             <TrendingUp className="text-amber-500" />
             <span className="text-4xl font-black text-amber-400 tabular-nums uppercase italic">{height}/{targetHeight} TẦNG</span>
           </div>
           <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: `${(height/targetHeight)*100}%` }} className="h-full bg-amber-500" />
           </div>
        </div>
        <div className="w-10" />
      </header>

      <main className="flex-1 w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-12 items-center z-10">
        <div className="flex flex-col-reverse items-center justify-start h-[32rem] p-8 bg-black/20 rounded-[3rem] border border-white/5 relative overflow-hidden">
          <div className="w-48 h-8 bg-slate-800 rounded-lg absolute bottom-0 shadow-lg" />
          <AnimatePresence>
            {[...Array(height)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ y: -500, rotate: i % 2 === 0 ? 5 : -5 }}
                animate={{ y: 0, rotate: 0 }}
                className={`w-40 h-10 mb-1 rounded-lg shadow-xl ${
                  i % 2 === 0 ? 'bg-amber-600 border-b-4 border-amber-800' : 'bg-yellow-600 border-b-4 border-yellow-800'
                }`}
              />
            ))}
          </AnimatePresence>
          {height === 0 && (
             <div className="text-slate-600 font-black uppercase text-xs tracking-widest mb-20">Hãy đặt viên gạch đầu tiên</div>
          )}
        </div>

        <div className="flex flex-col gap-8">
           <AnimatePresence mode="wait">
             {activeQuestion ? (
               <motion.div 
                 key={activeQuestion.id}
                 initial={{ x: 50, opacity: 0 }}
                 animate={{ x: 0, opacity: 1 }}
                 exit={{ x: -50, opacity: 0 }}
                 className="space-y-8"
               >
                 <div className="bg-slate-900 border border-white/10 p-10 rounded-[3rem] shadow-2xl relative">
                    <div className="absolute -top-4 -left-4 w-12 h-12 rounded-2xl bg-amber-500 flex items-center justify-center font-black text-slate-900 text-2xl shadow-lg">
                       ?
                    </div>
                    <h3 className="text-2xl font-black leading-relaxed">{activeQuestion.text}</h3>
                 </div>

                 <div className="grid grid-cols-1 gap-3">
                   {activeQuestion.options.map((opt, i) => {
                     const label = String.fromCharCode(65 + i);
                     return (
                       <button
                         key={i}
                         onClick={() => handleAnswer(label)}
                         className="p-5 rounded-2xl border-2 border-white/5 hover:border-amber-500 bg-white/5 hover:bg-amber-500/10 transition-all flex items-center gap-4 group"
                       >
                         <span className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center font-black group-hover:bg-amber-500 group-hover:text-amber-950 transition-colors">
                           {label}
                         </span>
                         <span className="text-lg font-bold">{opt}</span>
                       </button>
                     );
                   })}
                 </div>
               </motion.div>
             ) : (
                <div className="flex flex-col items-center justify-center space-y-4 py-20 text-slate-600">
                    <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
                    <p className="font-black uppercase tracking-widest text-xs">Đang chuẩn bị viên gạch tiếp theo...</p>
                </div>
             )}
           </AnimatePresence>
        </div>
      </main>

      {gameState === 'result' && (
         <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="fixed inset-0 bg-amber-950 z-[100] flex flex-col items-center justify-center p-8 text-center"
         >
            <div className="text-9xl mb-8">🏗️</div>
            <h2 className="text-6xl font-black mb-2 tracking-tighter text-amber-400 uppercase italic">TÒA THÁP HOÀN THÀNH</h2>
            <p className="text-slate-200 mb-12 font-bold tracking-[0.4em] uppercase text-xs">Bạn đã xây dựng thành công tòa tháp cao {targetHeight} tầng</p>
            
            <div className="flex gap-4">
              <button 
                 onClick={startGame}
                 className="bg-amber-600 hover:bg-amber-500 text-white px-12 py-4 rounded-[2rem] font-black transition-all shadow-xl shadow-amber-600/20 flex items-center gap-2"
              >
                 <Trophy size={20} /> CHƠI LẠI
              </button>
              <button onClick={onBack} className="bg-white/10 hover:bg-white/20 text-white px-12 py-4 rounded-[2rem] font-black transition-all border border-white/10 text-xl">TRANG CHỦ</button>
            </div>
         </motion.div>
      )}
    </div>
  );
};

export default TowerBuilder;
