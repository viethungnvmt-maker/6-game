import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Heart, Droplets, Sun, Wind, CloudRain, Zap } from 'lucide-react';
import { Question, GameHistory } from '../../types';
import { playCorrectSound, playWrongSound, playTone } from '../../utils/audio';

interface SurvivalIslandProps {
  questions: Question[];
  onBack: () => void;
  addHistory: (entry: GameHistory) => void;
}

const SurvivalIsland: React.FC<SurvivalIslandProps> = ({ questions, onBack, addHistory }) => {
  const [gameState, setGameState] = useState<'start' | 'playing' | 'result'>('start');
  const [day, setDay] = useState(1);
  const [health, setHealth] = useState(100);
  const [resources, setResources] = useState(50);
  const [activeQuestion, setActiveQuestion] = useState<Question | null>(null);
  const [event, setEvent] = useState<{ text: string, icon: any }>({ text: 'Bình minh trên đảo', icon: Sun });

  const events = [
    { text: 'Cơn bão bất chợt kéo đến!', icon: Wind, damage: 20 },
    { text: 'Nguồn nước đang cạn dần...', icon: Droplets, damage: 15 },
    { text: 'Thú dữ tấn công lán trại!', icon: Zap, damage: 25 },
    { text: 'Cơn mưa nặng hạt làm hỏng hóc đồ đạc.', icon: CloudRain, damage: 10 },
  ];

  const startGame = () => {
    setDay(1);
    setHealth(100);
    setResources(50);
    setGameState('playing');
    nextDay();
  };

  const nextDay = () => {
    if (day >= 20 || health <= 0) {
      setGameState('result');
      return;
    }
    const randEvent = events[Math.floor(Math.random() * events.length)];
    setEvent(randEvent);
    const q = questions[Math.floor(Math.random() * questions.length)];
    setActiveQuestion(q);
  };

  const handleAnswer = (answer: string) => {
    if (!activeQuestion) return;

    if (answer === activeQuestion.correctAnswer) {
      playCorrectSound();
      setResources(prev => Math.min(100, prev + 10));
      // No damage from event
    } else {
      playWrongSound();
      const damage = (event as any).damage || 10;
      setHealth(prev => Math.max(0, prev - damage));
    }

    setDay(prev => prev + 1);
    setActiveQuestion(null);
    setTimeout(nextDay, 1000);
  };

  if (gameState === 'start') {
    return (
      <div className="min-h-screen bg-cyan-900/30 flex flex-col items-center justify-center p-8 text-white relative">
         <div className="absolute inset-0 bg-gradient-to-b from-cyan-400 to-blue-600 opacity-20 pointer-events-none" />
         <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-center z-10">
            <div className="text-9xl mb-8 animate-bounce-slow text-yellow-400">🏝️</div>
            <h2 className="text-6xl font-black mb-4 tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 via-emerald-400 to-cyan-500 uppercase">
               SINH TỒN TRÊN ĐẢO
            </h2>
            <p className="text-xl text-cyan-200 mb-12 max-w-md mx-auto leading-relaxed font-bold italic">
               Bạn bị lạc trên một hòn đảo hoang. Hãy trả lời các câu hỏi để thu thập tài nguyên và sống sót qua 20 ngày thử thách!
            </p>
            <button 
              onClick={startGame}
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-12 py-4 rounded-full text-2xl font-black transition-all shadow-2xl hover:scale-105 active:scale-95 flex items-center gap-3 mx-auto"
            >
              <Heart className="animate-pulse" /> BẮT ĐẦU SINH TỒN
            </button>
            <button onClick={onBack} className="block mt-8 text-cyan-400 hover:text-white transition-colors font-bold uppercase tracking-widest text-xs">
              Quay lại đất liền
            </button>
         </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center p-8 text-white relative overflow-hidden">
       {/* Ocean Background */}
       <div className="absolute bottom-0 left-0 w-full h-1/2 bg-blue-900/30 blur-[100px] pointer-events-none animate-pulse" />
       
       <header className="w-full max-w-6xl flex justify-between items-center mb-16 z-10">
          <div className="flex gap-10">
             <div className="text-left">
                <div className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Sinh lực</div>
                <div className="flex items-center gap-3">
                   <div className="w-48 h-3 bg-slate-800 rounded-full overflow-hidden border border-white/5">
                      <motion.div animate={{ width: `${health}%` }} className={`h-full ${health > 30 ? 'bg-rose-500' : 'bg-red-600 animate-pulse'}`} />
                   </div>
                   <span className="text-2xl font-black tabular-nums">{health}%</span>
                </div>
             </div>
             
             <div className="text-left">
                <div className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Tài nguyên</div>
                <div className="flex items-center gap-3">
                   <div className="w-48 h-3 bg-slate-800 rounded-full overflow-hidden border border-white/5">
                      <motion.div animate={{ width: `${resources}%` }} className="h-full bg-emerald-500" />
                   </div>
                   <span className="text-2xl font-black tabular-nums">{resources}%</span>
                </div>
             </div>
          </div>

          <div className="text-center">
             <div className="text-5xl font-black tracking-tighter italic text-yellow-400">NGÀY THỨ {day}</div>
             <p className="text-[10px] font-black text-slate-500 mt-1 uppercase tracking-widest">Mục tiêu: Sống sót 20 ngày</p>
          </div>

          <button onClick={onBack} className="text-slate-500 hover:text-white flex items-center gap-2 font-black uppercase text-xs tracking-widest">
             <ChevronLeft size={16} /> BỎ CUỘC
          </button>
       </header>

       <main className="w-full max-w-4xl z-10 flex flex-col items-center">
          <AnimatePresence mode="wait">
             <motion.div 
               key={day}
               initial={{ y: 20, opacity: 0 }} 
               animate={{ y: 0, opacity: 1 }}
               className="w-full text-center mb-12"
             >
                <div className="inline-flex flex-col items-center gap-4 bg-white/5 border border-white/10 p-8 rounded-[3rem] shadow-2xl backdrop-blur-md w-full">
                   <event.icon size={64} className="text-yellow-400 animate-bounce-slow" />
                   <h3 className="text-3xl font-black italic tracking-tight">{event.text}</h3>
                   <p className="text-slate-400 font-bold max-w-sm">Trả lời đúng câu hỏi để bảo vệ sinh lực và thu thập tài nguyên sinh tồn!</p>
                </div>
             </motion.div>
          </AnimatePresence>

          <div className="w-full">
             <AnimatePresence mode="wait">
                {activeQuestion ? (
                   <motion.div 
                     key={activeQuestion.id}
                     initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -50, opacity: 0 }}
                     className="space-y-8"
                   >
                     <div className="bg-slate-900 border border-white/10 p-12 rounded-[3rem] shadow-2xl relative text-center">
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-2 rounded-full bg-blue-600 text-xs font-black uppercase tracking-widest shadow-lg">
                           THỬ THÁCH SINH TỒN
                        </div>
                        <h3 className="text-4xl font-black leading-tight italic">{activeQuestion.text}</h3>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {activeQuestion.options.map((opt, i) => {
                           const label = String.fromCharCode(65 + i);
                           return (
                             <button
                               key={i}
                               onClick={() => handleAnswer(label)}
                               className="p-8 rounded-[2rem] bg-white/5 hover:bg-white/10 border-2 border-white/10 hover:border-emerald-500 transition-all text-left flex items-center gap-6 group"
                             >
                                <span className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-2xl font-black group-hover:bg-emerald-600 group-hover:text-white transition-colors shrink-0">
                                   {label}
                                </span>
                                <span className="text-xl font-bold">{opt}</span>
                             </button>
                           );
                        })}
                     </div>
                   </motion.div>
                ) : (
                   <div className="py-20 text-center text-slate-600">
                      <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                      <p className="font-bold uppercase tracking-widest text-xs">Đang chuẩn bị thử thách mới...</p>
                   </div>
                )}
             </AnimatePresence>
          </div>
       </main>

       {gameState === 'result' && (
          <motion.div 
             initial={{ opacity: 0 }} animate={{ opacity: 1 }}
             className="fixed inset-0 bg-slate-950 z-[100] flex flex-col items-center justify-center p-8 text-center"
          >
             {health > 0 ? (
                <>
                   <div className="text-9xl mb-8">🚢</div>
                   <h2 className="text-7xl font-black mb-4 tracking-tighter text-emerald-400 uppercase italic">CỨU HỘ ĐÃ ĐẾN!</h2>
                   <p className="text-slate-400 mb-12 font-bold tracking-[0.4em] uppercase text-xs">Bạn đã sống sót qua 20 ngày khắc nghiệt nhất</p>
                </>
             ) : (
                <>
                   <div className="text-9xl mb-8">💀</div>
                   <h2 className="text-7xl font-black mb-4 tracking-tighter text-rose-600 uppercase italic">CẠN KIỆT SINH LỰC</h2>
                   <p className="text-slate-400 mb-12 font-bold tracking-[0.4em] uppercase text-xs">Bạn đã không thể vượt qua thử thách của đại dương</p>
                </>
             )}
             
             <div className="flex gap-4">
                <button onClick={startGame} className="bg-emerald-600 hover:bg-emerald-500 text-white px-12 py-4 rounded-full font-black transition-all shadow-xl shadow-emerald-600/20 text-xl">THỬ LẠI</button>
                <button onClick={onBack} className="bg-white/10 hover:bg-white/20 text-white px-12 py-4 rounded-full font-black transition-all border border-white/10 text-xl">TRANG CHỦ</button>
             </div>
          </motion.div>
       )}
    </div>
  );
};

export default SurvivalIsland;
