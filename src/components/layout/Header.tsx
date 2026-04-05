import React from 'react';
import { Settings, Home } from 'lucide-react';

interface HeaderProps {
  onGoHome: () => void;
  onOpenSettings: () => void;
  onOpenManager: () => void;
  currentScreen: string;
}

const Header: React.FC<HeaderProps> = ({ onGoHome, onOpenSettings, onOpenManager, currentScreen }) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-[100] bg-slate-950/70 backdrop-blur-xl border-b border-white/10 h-20 flex items-center transition-all duration-300">
      <div className="max-w-7xl mx-auto w-full px-6 flex justify-between items-center">
        <div 
          className="flex items-center gap-3 cursor-pointer group"
          onClick={onGoHome}
        >
          <div className="relative">
            <span className="text-4xl group-hover:scale-110 transition-transform block">🎮</span>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-900 animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-black text-white tracking-tighter leading-none uppercase">
              GÓC GAME <span className="text-blue-400">LỚP HỌC</span>
            </h1>
            <p className="text-[10px] font-bold text-slate-500 tracking-widest uppercase">Premium Edition</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-6 mr-6 border-r border-white/10 pr-6">
            <button onClick={onGoHome} className={`text-xs font-black uppercase tracking-widest transition-colors ${currentScreen === 'home' ? 'text-blue-400' : 'text-slate-400 hover:text-white'}`}>Trang chủ</button>
            <button onClick={onOpenManager} className={`text-xs font-black uppercase tracking-widest transition-colors ${currentScreen === 'manager' ? 'text-blue-400' : 'text-slate-400 hover:text-white'}`}>Kho đề</button>
          </div>

          <button 
            onClick={onOpenManager}
            className="hidden sm:flex px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-black text-xs items-center gap-2 transition-all shadow-lg shadow-blue-600/20 active:scale-95"
          >
            QUẢN LÝ
          </button>
          
          <button 
            onClick={onOpenSettings}
            className="relative p-3 text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-2xl transition-all group"
            title="Cài đặt AI"
          >
            <Settings size={20} className="group-hover:rotate-90 transition-transform duration-500" />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-rose-500 rounded-full animate-ping" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
