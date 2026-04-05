import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, RotateCcw, Zap } from 'lucide-react';
import { Question, GameHistory } from '../../types';
import { playCorrectSound, playWrongSound, playTone } from '../../utils/audio';

interface LuckyWheelProps {
  questions: Question[];
  onBack: () => void;
  addHistory: (entry: GameHistory) => void;
}

const LuckyWheel: React.FC<LuckyWheelProps> = ({ questions, onBack, addHistory }) => {
  const [gameState, setGameState] = useState<'start' | 'playing' | 'result'>('start');
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [score, setScore] = useState(0);
  const [activeQuestion, setActiveQuestion] = useState<Question | null>(null);
  const [lastWin, setLastWin] = useState<number | null>(null);
  
  const segments = [
    { label: '100', color: '#EF4444', value: 100 },
    { label: '500', color: '#3B82F6', value: 500 },
    { label: '200', color: '#10B981', value: 200 },
    { label: '1000', color: '#F59E0B', value: 1000 },
    { label: '300', color: '#8B5CF6', value: 300 },
    { label: 'X2', color: '#EC4899', value: -1 }, // -1 means X2
    { label: '50', color: '#6B7280', value: 50 },
    { label: 'MẤT ĐIỂM', color: '#000000', value: 0 },
  ];

  const spinWheel = () => {
    if (isSpinning || activeQuestion) return;
    setIsSpinning(true);
    playTone(300, 0.5, 'sawtooth');
    
    const extraRots = 5 + Math.random() * 5;
    const newRotation = rotation + extraRots * 360;
    setRotation(newRotation);

    setTimeout(() => {
      setIsSpinning(false);
      const normalizedRot = newRotation % 360;
      const segmentAngle = 360 / segments.length;
      const wonIdx = Math.floor((360 - normalizedRot) / segmentAngle) % segments.length;
      setLastWin(segments[wonIdx].value);
      
      if (segments[wonIdx].value === 0) {
        setScore(0);
        playWrongSound();
      } else {
        const q = questions[Math.floor(Math.random() * questions.length)];
        setActiveQuestion(q);
      }
    }, 4000);
  };

  const handleAnswer = (answer: string) => {
    if (!activeQuestion || lastWin === null) return;
    
    if (answer === activeQuestion.correctAnswer) {
      playCorrectSound();
      if (lastWin === -1) {
        setScore(prev => prev * 2);
      } else {
        setScore(prev => prev + lastWin);
      }
    } else {
      playWrongSound();
    }
    
    setActiveQuestion(null);
    setLastWin(null);
  };

  if (gameState === 'start') {
    return (
      <div className="min-h-screen bg-indigo-950 flex flex-col items-center justify-center p-8 text-white">
        <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-center">
          <div className="text-9xl mb-8 filter drop-shadow-[0_0_30px_rgba(139,92,246,0.5)]">🎡</div>
          <h2 className="text-6xl font-black mb-4 tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-500 to-indigo-500">
            VÒNG QUAY MAY MẮN
          </h2>
          <p className="text-xl text-indigo-200/70 mb-12 max-w-md mx-auto font-medium">
            Thử vận may và kiến thức! Quay vòng quay để nhận điểm, nhưng hãy trả lời đúng để nhận quà.
          </p>
          <button 
            onClick={() => setGameState('playing')}
            className="bg-white text-indigo-950 px-12 py-4 rounded-3xl text-2xl font-black transition-all shadow-[0_0_50px_rgba(255,255,255,0.2)] hover:scale-105 active:scale-95 flex items-center gap-3"
          >
            <RotateCcw className="animate-spin-slow" /> QUAY NGAY
          </button>
          <button onClick={onBack} className="block mt-8 text-indigo-400 hover:text-white transition-colors font-bold uppercase tracking-widest text-xs">
            QUAY VỀ TRANG CHỦ
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center p-8 text-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.1),transparent)]" />
      
      <header className="w-full max-w-6xl flex justify-between items-center mb-20 z-10">
        <button onClick={onBack} className="text-slate-500 hover:text-white flex items-center gap-2 font-black tracking-widest text-xs">
           <ChevronLeft size={16} /> THOÁT
        </button>
        <div className="text-right">
          <div className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Tổng điểm tích lũy</div>
          <div className="text-5xl font-black tabular-nums text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
            {score.toLocaleString()}
          </div>
        </div>
      </header>

      <main className="flex flex-col items-center z-10">
        <div className="relative w-96 h-96 md:w-[32rem] md:h-[32rem]">
          {/* Needle */}
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-12 bg-white z-20 rounded-b-full shadow-lg flex items-center justify-center">
            <div className="w-2 h-6 bg-red-600 rounded-full" />
          </div>

          {/* Wheel Container */}
          <motion.div 
            animate={{ rotate: rotation }}
            transition={{ duration: 4, ease: [0.15, 0, 0.15, 1] }}
            className="w-full h-full rounded-full border-8 border-white/10 shadow-[0_0_100px_rgba(59,130,246,0.2)] relative overflow-hidden"
          >
            {segments.map((seg, i) => {
              const angle = 360 / segments.length;
              const rotate = angle * i;
              return (
                <div 
                  key={i}
                  className="absolute top-0 left-1/2 w-1/2 h-full origin-left"
                  style={{ transform: `rotate(${rotate}deg)` }}
                >
                  <div 
                    className="w-full h-full"
                    style={{ 
                      backgroundColor: seg.color,
                      clipPath: `polygon(0 50%, 100% 0, 100% 100%)`,
                      transform: `rotate(${angle / 2}deg)`
                    }}
                  />
                  <div 
                    className="absolute top-1/2 left-2/3 -translate-y-1/2 -translate-x-1/2 text-white font-black text-2xl"
                    style={{ transform: `rotate(90deg)` }}
                  >
                    {seg.label}
                  </div>
                </div>
              );
            })}
          </motion.div>

          {/* Center Button */}
          <button 
            onClick={spinWheel}
            disabled={isSpinning || !!activeQuestion}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-white text-slate-900 border-8 border-slate-900 shadow-2xl z-20 font-black text-xl hover:scale-110 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
          >
            SPIN
          </button>
        </div>

        <div className="mt-20">
          <AnimatePresence>
            {isSpinning && (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                <Zap className="w-12 h-12 text-yellow-400 animate-pulse" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <AnimatePresence>
        {activeQuestion && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/95 backdrop-blur-3xl z-50 flex items-center justify-center p-8"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 50 }} animate={{ scale: 1, y: 0 }}
              className="bg-slate-900 border border-white/10 p-12 rounded-[4rem] max-w-2xl w-full shadow-2xl text-center"
            >
              <div className="mb-10">
                <span className="bg-yellow-400 text-slate-900 px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest">
                  THỬ THÁCH NHẬN {lastWin === -1 ? 'X2 ĐIỂM' : `${lastWin} ĐIỂM`}
                </span>
                <h3 className="text-3xl font-black mt-8 leading-relaxed">
                  {activeQuestion.text}
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeQuestion.options.map((opt, i) => {
                  const label = String.fromCharCode(65 + i);
                  return (
                    <button
                      key={i}
                      onClick={() => handleAnswer(label)}
                      className="p-6 rounded-3xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-yellow-400 transition-all flex items-center gap-4 group"
                    >
                      <span className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center font-black group-hover:bg-yellow-400 group-hover:text-slate-900 transition-all">
                        {label}
                      </span>
                      <span className="text-xl font-bold">{opt}</span>
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
};

export default LuckyWheel;
