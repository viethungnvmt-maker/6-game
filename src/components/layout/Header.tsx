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
    <header className="w-full bg-white/10 backdrop-blur-md border-b border-white/20 p-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div 
          className="flex items-center gap-2 cursor-pointer group"
          onClick={onGoHome}
        >
          <span className="text-3xl group-hover:scale-110 transition-transform">🎮</span>
          <h1 className="text-xl font-black text-white tracking-tighter">
            GÓC GAME LỚP HỌC
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {currentScreen !== 'home' && (
            <button 
              onClick={onGoHome}
              className="p-2 text-white hover:bg-white/10 rounded-xl transition-colors"
              title="Trang chủ"
            >
              <Home size={24} />
            </button>
          )}
          <button 
            onClick={onOpenManager}
            className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-xl font-bold flex items-center gap-2 transition-all border border-white/30"
          >
            Quản lý câu hỏi
          </button>
          <button 
            onClick={onOpenSettings}
            className="p-2 text-white hover:bg-white/10 rounded-xl transition-colors"
            title="Cài đặt AI"
          >
            <Settings size={24} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
