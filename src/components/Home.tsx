import React from 'react';
import { motion } from 'motion/react';
import { ChevronRight, Settings, Gamepad2 } from 'lucide-react';

interface GameItem {
  id: string;
  name: string;
  icon: string;
  desc: string;
  color: string;
}

interface HomeProps {
  onSelectGame: (id: string) => void;
  onOpenManager: () => void;
}

const Home: React.FC<HomeProps> = ({ onSelectGame, onOpenManager }) => {
  const games: GameItem[] = [
    { id: 'game-millionaire', name: 'Ai là Triệu phú', icon: '💰', desc: 'Thử thách kiến thức với 15 câu hỏi kịch tính.', color: 'from-blue-600 to-indigo-900 shadow-blue-500/20' },
    { id: 'game-race', name: 'Vượt chướng ngại vật', icon: '🏃', desc: 'Đua tài kiến thức, vượt qua mọi rào cản.', color: 'from-green-400 to-emerald-600 shadow-emerald-600/20' },
    { id: 'game-cards', name: 'Lật thẻ bí ẩn', icon: '🃏', desc: 'Ghi nhớ và trả lời, tìm kho báu ẩn giấu.', color: 'from-purple-400 to-pink-600 shadow-purple-500/20' },
    { id: 'game-bell', name: 'Rung chuông vàng', icon: '🔔', desc: 'Đấu trường trí tuệ dành cho cả lớp.', color: 'from-orange-400 to-red-600 shadow-red-500/20' },
    { id: 'game-flower', name: 'Hái hoa dân chủ', icon: '🌸', desc: 'Chọn hoa, trả lời câu hỏi và nhận quà.', color: 'from-pink-400 to-rose-600 shadow-pink-500/20' },
    { id: 'game-crossword', name: 'Ô chữ thần kỳ', icon: '🧩', desc: 'Giải mã từ khóa bí mật từ các hàng ngang.', color: 'from-indigo-400 to-blue-600 shadow-indigo-500/20' },
    { id: 'game-castle', name: 'Công thành chiến', icon: '🏰', desc: 'Chiếm đóng lâu đài bằng kiến thức bậc thầy.', color: 'from-amber-600 to-orange-800 shadow-orange-500/20' },
    { id: 'game-territory', name: 'Tranh giành lãnh thổ', icon: '🗺️', desc: 'Mở rộng bản đồ, chinh phục mọi vùng đất.', color: 'from-emerald-500 to-teal-700 shadow-emerald-500/20' },
    { id: 'game-wheel', name: 'Vòng quay may mắn', icon: '🎡', desc: 'Xoay chuyển vận may, nhận ngàn điểm thưởng.', color: 'from-violet-500 to-fuchsia-700 shadow-violet-500/20' },
    { id: 'game-puzzle', name: 'Bí mật ẩn giấu', icon: '🖼️', desc: 'Lật mở mảnh ghép, khám phá bức tranh bí ẩn.', color: 'from-sky-500 to-blue-700 shadow-sky-500/20' },
    { id: 'game-battleship', name: 'Hải chiến đại dương', icon: '🚢', desc: 'Bắn phá tàu địch, làm chủ vùng biển khơi.', color: 'from-blue-800 to-slate-900 shadow-blue-900/20' },
    { id: 'game-tower', name: 'Xây tháp kiến thức', icon: '🧱', desc: 'Chồng tháp càng cao, trình độ càng bá đạo.', color: 'from-yellow-600 to-amber-800 shadow-yellow-600/20' },
    { id: 'game-auction', name: 'Đấu giá trí tuệ', icon: '🔨', desc: 'Cân não đấu thầu, giành lấy câu hỏi quý.', color: 'from-zinc-700 to-black shadow-zinc-600/20' },
    { id: 'game-survival', name: 'Sinh tồn trên đảo', icon: '🏝️', desc: 'Chống chọi thiên tai, sống sót nhờ trí tuệ.', color: 'from-cyan-500 to-blue-700 shadow-cyan-500/20' },
    { id: 'game-race-to-finish', name: 'Đường đua kỳ thú', icon: '🏁', desc: 'Đổ xúc xắc may mắn, về đích nhanh như chớp.', color: 'from-rose-500 to-red-800 shadow-rose-500/20' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 p-8 flex flex-col items-center">
      <header className="w-full max-w-7xl flex flex-col md:flex-row justify-between items-center mb-20 z-10 gap-8">
        <motion.div 
          initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
          className="flex items-center gap-6"
        >
          <div className="relative">
            <span className="text-7xl block animate-bounce-slow">🎮</span>
            <div className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full animate-pulse">PRO</div>
          </div>
          <div>
            <h1 className="text-6xl font-black text-white tracking-tighter leading-none mb-2">
              GÓC GAME <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-rose-500 animate-gradient-x">LỚP HỌC</span>
            </h1>
            <p className="text-slate-500 font-bold tracking-[0.3em] uppercase text-xs">Educational AI Game Suite v2.0</p>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
          className="flex gap-4"
        >
          <button 
            onClick={onOpenManager}
            className="bg-white/10 hover:bg-white/20 text-white px-10 py-5 rounded-[2rem] font-black flex items-center gap-4 transition-all backdrop-blur-2xl border border-white/20 shadow-2xl group"
          >
            <Settings className="group-hover:rotate-90 transition-transform" size={28} /> 
            QUẢN LÝ KHO ĐỀ
          </button>
        </motion.div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 w-full max-w-7xl z-10 pb-20">
        {games.map((game, index) => (
          <motion.div
            key={game.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.03, translateY: -12 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onSelectGame(game.id)}
            className="bg-slate-900 border border-white/5 rounded-[3rem] p-8 shadow-2xl cursor-pointer group relative overflow-hidden flex flex-col h-full hover:border-white/20 transition-all duration-500"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${game.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
            
            <div className={`w-24 h-24 rounded-[2rem] bg-gradient-to-br ${game.color} flex items-center justify-center text-5xl mb-8 group-hover:scale-110 transition-transform shadow-2xl border border-white/10`}>
              {game.icon}
            </div>
            
            <h3 className="text-2xl font-black text-white mb-3 tracking-tight uppercase group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-slate-400">
              {game.name}
            </h3>
            
            <p className="text-slate-500 font-medium leading-relaxed text-sm flex-1">{game.desc}</p>
            
            <div className="mt-8 flex items-center justify-between">
              <div className="flex items-center gap-2 text-indigo-400 font-black uppercase text-[10px] tracking-widest bg-indigo-500/10 px-4 py-2 rounded-full opacity-0 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-4 transition-all duration-300">
                Play Now <ChevronRight size={14} />
              </div>
              <Gamepad2 className="text-slate-800 group-hover:text-slate-600 transition-colors" size={24} />
            </div>
          </motion.div>
        ))}
      </div>

      <footer className="mt-auto py-12 text-slate-600 font-black tracking-widest text-[10px] uppercase opacity-40 border-t border-white/5 w-full text-center">
        PREMIUM CLASSROOM EXPERIENCE • DESIGNED BY AI FOR HERO TEACHERS • 2026
      </footer>

      {/* Dynamic Background Effects */}
      <div className="fixed top-[-10%] left-[-10%] w-1/2 h-1/2 bg-blue-600/10 rounded-full blur-[150px] pointer-events-none animate-pulse" />
      <div className="fixed bottom-[-10%] right-[-10%] w-1/2 h-1/2 bg-rose-600/10 rounded-full blur-[150px] pointer-events-none animate-pulse" style={{ animationDelay: '2s' }} />
    </div>
  );
};

export default Home;
