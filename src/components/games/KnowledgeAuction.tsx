import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Gavel, Coins, Timer, TrendingUp } from 'lucide-react';
import { Question, GameHistory } from '../../types';
import { playCorrectSound, playWrongSound, playTone } from '../../utils/audio';

interface KnowledgeAuctionProps {
  questions: Question[];
  onBack: () => void;
  addHistory: (entry: GameHistory) => void;
}

const KnowledgeAuction: React.FC<KnowledgeAuctionProps> = ({ questions, onBack, addHistory }) => {
  const [gameState, setGameState] = useState<'start' | 'bidding' | 'answering' | 'result'>('start');
  const [score, setScore] = useState(1000); // Start with 1000 coins
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [currentBid, setCurrentBid] = useState(100);
  const [timeLeft, setTimeLeft] = useState(10);
  const [questionCount, setQuestionCount] = useState(0);

  const startNextRound = () => {
    if (questionCount >= 10 || score <= 0) {
      setGameState('result');
      return;
    }
    const q = questions[Math.floor(Math.random() * questions.length)];
    setCurrentQuestion(q);
    setCurrentBid(100);
    setGameState('bidding');
    setTimeLeft(10);
    setQuestionCount(prev => prev + 1);
  };

  useEffect(() => {
    let timer: any;
    if (gameState === 'bidding' && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (gameState === 'bidding' && timeLeft === 0) {
      setGameState('answering');
    }
    return () => clearInterval(timer);
  }, [gameState, timeLeft]);

  const handleBid = () => {
    if (score >= currentBid + 100) {
      setCurrentBid(prev => prev + 100);
      playTone(600, 0.1, 'sine');
    }
  };

  const handleAnswer = (answer: string) => {
    if (!currentQuestion) return;

    if (answer === currentQuestion.correctAnswer) {
      playCorrectSound();
      setScore(prev => prev + currentBid);
    } else {
      playWrongSound();
      setScore(prev => prev - currentBid);
    }

    setTimeout(startNextRound, 1500);
  };

  if (gameState === 'start') {
    return (
      <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-8 text-white">
        <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-center">
          <div className="text-9xl mb-8 animate-bounce-slow text-yellow-500">🔨</div>
          <h2 className="text-6xl font-black mb-4 tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-amber-200 to-yellow-600 uppercase italic">
            ĐẤU GIÁ KIẾN THỨC
          </h2>
          <p className="text-xl text-neutral-400 mb-12 max-w-md mx-auto leading-relaxed font-medium">
            Sử dụng số vốn ban đầu để đấu giá câu hỏi. Trả lời đúng để nhân đôi tiền cược, nhưng hãy cẩn thận kẻo trắng tay!
          </p>
          <button 
            onClick={startNextRound}
            className="bg-yellow-600 hover:bg-yellow-500 text-white px-12 py-4 rounded-3xl text-2xl font-black transition-all shadow-[0_0_50px_rgba(202,138,4,0.3)] hover:scale-105 active:scale-95 flex items-center gap-3 mx-auto"
          >
            <Gavel size={28} /> BẮT ĐẦU ĐẤU GIÁ
          </button>
          <button onClick={onBack} className="block mt-8 text-neutral-500 hover:text-white transition-colors font-bold uppercase tracking-widest text-xs">
            Rời phòng đấu giá
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center p-8 text-white relative overflow-hidden selection:bg-yellow-500 selection:text-black">
      <header className="w-full max-w-6xl flex justify-between items-center mb-20 z-10">
        <button onClick={onBack} className="text-slate-500 hover:text-white flex items-center gap-2 font-black tracking-widest text-xs">
          <ChevronLeft size={16} /> BỎ CUỘC
        </button>
        
        <div className="flex gap-8">
           <div className="text-right">
              <div className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1">Số vốn hiện có</div>
              <div className="flex items-center gap-2 justify-end">
                 <Coins className="text-yellow-400" />
                 <span className="text-5xl font-black tabular-nums text-yellow-500">{score.toLocaleString()}</span>
              </div>
           </div>
        </div>
      </header>

      <main className="w-full max-w-4xl z-10 flex flex-col items-center">
        {gameState === 'bidding' && (
           <motion.div 
             initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
             className="text-center w-full"
           >
              <div className="flex items-center justify-center gap-4 mb-12">
                 <Timer className={`w-12 h-12 ${timeLeft <= 3 ? 'text-red-500 animate-ping' : 'text-slate-400'}`} />
                 <span className="text-7xl font-black tabular-nums">{timeLeft}s</span>
              </div>

              <div className="bg-slate-900 border-4 border-yellow-600/30 p-16 rounded-[4rem] shadow-2xl relative mb-12">
                 <div className="text-sm font-black text-yellow-600 uppercase tracking-[0.4em] mb-4">Câu hỏi số {questionCount}/10</div>
                 <h3 className="text-5xl font-black mb-12 leading-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400 italic">
                    {currentQuestion?.text}
                 </h3>
                 <div className="flex flex-col items-center gap-4">
                    <div className="text-xs font-black text-slate-500 uppercase tracking-widest">Giá thầu hiện tại</div>
                    <div className="text-7xl font-black text-yellow-500 bg-yellow-500/10 px-12 py-4 rounded-[2rem] border border-yellow-500/20">
                       {currentBid.toLocaleString()}
                    </div>
                 </div>
              </div>

              <button 
                onClick={handleBid}
                className="bg-yellow-600 hover:bg-yellow-500 text-white px-20 py-6 rounded-[2.5rem] text-4xl font-black transition-all shadow-[0_0_60px_rgba(202,138,4,0.4)] hover:scale-105 active:scale-95 group"
              >
                NÂNG GIÁ <TrendingUp className="inline ml-4 group-hover:translate-y-[-10px] transition-transform" />
              </button>
           </motion.div>
        )}

        {gameState === 'answering' && (
           <motion.div 
             initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
             className="w-full space-y-8"
           >
              <div className="text-center mb-12">
                 <div className="inline-block px-12 py-4 rounded-full bg-red-600 text-white font-black text-2xl animate-pulse shadow-xl shadow-red-600/40">
                    ĐÃ CHỐT GIÁ: {currentBid.toLocaleString()}
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {currentQuestion?.options.map((opt, i) => {
                    const label = String.fromCharCode(65 + i);
                    return (
                      <button
                        key={i}
                        onClick={() => handleAnswer(label)}
                        className="p-10 rounded-[2.5rem] bg-white/5 hover:bg-white/10 border-2 border-white/10 hover:border-yellow-500 transition-all text-left flex items-center gap-6 group"
                      >
                        <span className="w-16 h-16 rounded-[1.5rem] bg-white/5 flex items-center justify-center text-3xl font-black group-hover:bg-yellow-500 group-hover:text-black transition-colors shrink-0">
                          {label}
                        </span>
                        <span className="text-2xl font-bold">{opt}</span>
                      </button>
                    );
                 })}
              </div>
           </motion.div>
        )}

        {gameState === 'result' && (
           <motion.div 
             initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
             className="text-center"
           >
              <div className="text-9xl mb-8">🏆</div>
              <h2 className="text-7xl font-black mb-4 tracking-tighter italic text-yellow-500 uppercase">PHIÊN ĐẤU GIÁ KẾT THÚC</h2>
              <div className="text-2xl text-slate-400 mb-16 font-bold">Tổng tài sản thu về: <span className="text-white text-5xl font-black">{score.toLocaleString()}</span></div>
              
              <div className="flex gap-4 justify-center">
                 <button onClick={() => { setQuestionCount(0); setScore(1000); setGameState('start'); }} className="bg-yellow-600 hover:bg-yellow-500 text-white px-12 py-4 rounded-[2rem] font-black transition-all text-xl">CHƠI LẠI</button>
                 <button onClick={onBack} className="bg-white/10 hover:bg-white/20 text-white px-12 py-4 rounded-[2rem] font-black transition-all border border-white/10 text-xl">VỀ TRANG CHỦ</button>
              </div>
           </motion.div>
        )}
      </main>
    </div>
  );
};

export default KnowledgeAuction;
