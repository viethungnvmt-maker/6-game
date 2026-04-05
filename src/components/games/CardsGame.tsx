import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft } from 'lucide-react';
import { Question, GameHistory } from '../../types';
import { playCorrectSound, playWrongSound, playTone } from '../../utils/audio';

interface CardsGameProps {
  questions: Question[];
  onBack: () => void;
  addHistory: (entry: GameHistory) => void;
}

const CardsGame: React.FC<CardsGameProps> = ({ questions, onBack, addHistory }) => {
  const [gameState, setGameState] = useState<'start' | 'playing' | 'result'>('start');
  const [cards, setCards] = useState<{ id: number, question: Question, isFlipped: boolean, isSolved: boolean }[]>([]);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [activeCard, setActiveCard] = useState<number | null>(null);

  const startGame = () => {
    if (questions.length < 6) {
      alert('Cần ít nhất 6 câu hỏi để bắt đầu trò chơi này!');
      return;
    }
    const shuffled = [...questions].sort(() => 0.5 - Math.random()).slice(0, 12);
    setCards(shuffled.map((q, i) => ({ id: i, question: q, isFlipped: false, isSolved: false })));
    setGameState('playing');
    setScore(0);
    setCombo(0);
  };

  const handleCardClick = (id: number) => {
    if (gameState !== 'playing' || activeCard !== null || cards[id].isSolved) return;
    
    playTone(440, 0.1, 'square'); // Flip sound
    
    const newCards = [...cards];
    newCards[id].isFlipped = true;
    setCards(newCards);
    setActiveCard(id);
  };

  const handleAnswer = (answer: string) => {
    if (activeCard === null) return;
    
    const card = cards[activeCard];
    if (answer === card.question.correctAnswer) {
      playCorrectSound();
      const newCombo = combo + 1;
      setCombo(newCombo);
      const bonus = newCombo >= 3 ? 50 : 0;
      const newScore = score + 100 + bonus;
      setScore(newScore);
      
      const newCards = [...cards];
      newCards[activeCard].isSolved = true;
      setCards(newCards);
      setActiveCard(null);

      if (newCards.every(c => c.isSolved)) {
        setGameState('result');
        addHistory({ gameName: 'Lật thẻ bí ẩn', score: newScore, date: Date.now() });
      }
    } else {
      playWrongSound();
      setCombo(0);
      const newCards = [...cards];
      newCards[activeCard].isFlipped = false;
      setCards(newCards);
      setActiveCard(null);
    }
  };

  if (gameState === 'start') {
    return (
      <div className="min-h-screen bg-purple-900 flex flex-col items-center justify-center p-8 text-white">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-center">
          <div className="text-9xl mb-8">🃏</div>
          <h2 className="text-5xl font-bold mb-4">LẬT THẺ BÍ ẨN</h2>
          <p className="text-xl text-purple-200 mb-12 max-w-md">
            Lật thẻ, trả lời đúng để ghi điểm. Combo 3 câu đúng liên tiếp nhận thêm 50 điểm!
          </p>
          <button 
            onClick={startGame}
            className="bg-white text-purple-900 px-12 py-4 rounded-full text-2xl font-bold hover:bg-purple-100 transition-all shadow-xl"
          >
            BẮT ĐẦU CHƠI
          </button>
          <button onClick={onBack} className="block mt-6 text-purple-400 hover:text-white transition-colors">
            Quay lại trang chủ
          </button>
        </motion.div>
      </div>
    );
  }

  if (gameState === 'playing') {
    return (
      <div className="min-h-screen bg-purple-50 flex flex-col items-center p-8">
        <header className="w-full max-w-6xl flex justify-between items-center mb-8">
          <button onClick={() => setGameState('start')} className="text-purple-700 font-bold flex items-center gap-2">
            <ChevronLeft /> Thoát
          </button>
          <div className="flex gap-8">
            <div className="text-2xl font-bold text-purple-900">Điểm: {score}</div>
            <div className="text-2xl font-bold text-orange-600">Combo: {combo} 🔥</div>
          </div>
        </header>

        <main className="w-full max-w-6xl grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {cards.map((card) => (
            <div key={card.id} className="aspect-[3/4] perspective-1000">
              <motion.div 
                animate={{ rotateY: card.isFlipped ? 180 : 0 }}
                transition={{ duration: 0.6, type: 'spring', stiffness: 260, damping: 20 }}
                className="relative w-full h-full preserve-3d cursor-pointer"
                onClick={() => handleCardClick(card.id)}
              >
                {/* Front (Back of the card in game terms) */}
                <div className={`absolute inset-0 backface-hidden rounded-2xl shadow-lg flex items-center justify-center border-4 border-white ${
                  card.isSolved ? 'bg-gray-200 opacity-50' : 'bg-purple-600'
                }`}
                style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.1) 1px, transparent 0)', backgroundSize: '10px 10px' }}>
                  <span className="text-4xl text-white/20 font-bold">?</span>
                </div>
                {/* Back (Front of the card in game terms) */}
                <div className="absolute inset-0 backface-hidden rounded-2xl shadow-lg bg-white flex items-center justify-center border-4 border-purple-500 rotate-y-180">
                  <span className="text-4xl">💎</span>
                </div>
              </motion.div>
            </div>
          ))}
        </main>

        <AnimatePresence>
          {activeCard !== null && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-8"
            >
              <motion.div 
                initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
                className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl"
              >
                <div className="mb-8">
                  <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider">
                    Thử thách thẻ số {activeCard + 1}
                  </span>
                  <h3 className="text-3xl font-bold mt-4 text-gray-800 leading-tight">
                    {cards[activeCard].question.text}
                  </h3>
                  {cards[activeCard].question.image && (
                    <img src={cards[activeCard].question.image} alt="Q" className="mt-6 rounded-2xl border border-gray-100 max-h-48 mx-auto" />
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {cards[activeCard].question.options.map((opt, i) => {
                    const label = String.fromCharCode(65 + i);
                    return (
                      <button
                        key={i}
                        onClick={() => handleAnswer(label)}
                        className="bg-gray-50 hover:bg-purple-50 border border-gray-200 hover:border-purple-300 p-6 rounded-2xl text-left flex items-center gap-4 transition-all group"
                      >
                        <span className="w-10 h-10 rounded-lg bg-gray-200 text-gray-600 flex items-center justify-center font-bold group-hover:bg-purple-500 group-hover:text-white transition-colors">
                          {label}
                        </span>
                        <span className="text-lg font-medium text-gray-700">{opt}</span>
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
    <div className="min-h-screen bg-purple-900 flex flex-col items-center justify-center p-8 text-white">
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-center">
        <div className="text-9xl mb-8">💎</div>
        <h2 className="text-5xl font-bold mb-2">HOÀN THÀNH!</h2>
        <p className="text-purple-200 mb-8">Bạn đã lật mở tất cả các thẻ bí ẩn!</p>
        <div className="text-6xl font-bold mb-12">{score} ĐIỂM</div>
        <div className="flex gap-4 justify-center">
          <button onClick={startGame} className="bg-white text-purple-900 px-8 py-3 rounded-2xl font-bold">CHƠI LẠI</button>
          <button onClick={onBack} className="bg-purple-700 text-white px-8 py-3 rounded-2xl font-bold">TRANG CHỦ</button>
        </div>
      </motion.div>
    </div>
  );
};

export default CardsGame;
