import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { 
  Question, 
  GameHistory, 
  AISettings 
} from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useAI } from './hooks/useAI';
import { useDocxImport } from './hooks/useDocxImport';

// Layout & Modals
import Header from './components/layout/Header';
import Home from './components/Home';
import Guide from './components/Guide';
import QuestionManager from './components/manager/QuestionManager';
import QuestionModal from './components/modals/QuestionModal';
import AISettingsModal from './components/modals/AISettingsModal';

// Games (Original 6)
import MillionaireGame from './components/games/MillionaireGame';
import RaceGame from './components/games/RaceGame';
import CardsGame from './components/games/CardsGame';
import BellGame from './components/games/BellGame';
import FlowerGame from './components/games/FlowerGame';
import CrosswordGame from './components/games/CrosswordGame';

// Games (New 9)
import CastleConquer from './components/games/CastleConquer';
import TerritoryBattle from './components/games/TerritoryBattle';
import LuckyWheel from './components/games/LuckyWheel';
import MysteryPuzzle from './components/games/MysteryPuzzle';
import Battleship from './components/games/Battleship';
import TowerBuilder from './components/games/TowerBuilder';
import KnowledgeAuction from './components/games/KnowledgeAuction';
import SurvivalIsland from './components/games/SurvivalIsland';
import RaceToFinish from './components/games/RaceToFinish';

export default function App() {
  // Screens: 'home' | 'manager' | 'game-*'
  const [screen, setScreen] = useState<string>('home');
  
  // Persistence
  const [questions, setQuestions] = useLocalStorage<Question[]>('gglh_questions', []);
  const [history, setHistory] = useLocalStorage<GameHistory[]>('gglh_history', []);
  const [aiSettings, setAiSettings] = useLocalStorage<AISettings>('gglh_ai_settings', {
    apiKey: '',
    model: 'gemini-2.0-flash'
  });

  // State
  const [isAddingQuestion, setIsAddingQuestion] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [isAISettingsOpen, setIsAISettingsOpen] = useState(false);

  // Hooks
  const { generateQuestions, isGenerating } = useAI();
  const { importDocx, isImporting } = useDocxImport();

  // Handlers
  const addHistory = (entry: GameHistory) => {
    setHistory(prev => [entry, ...prev].slice(0, 10));
  };

  const handleSaveQuestion = (q: Question) => {
    if (editingQuestion) {
      setQuestions(prev => prev.map(item => item.id === q.id ? q : item));
    } else {
      setQuestions(prev => [...prev, q]);
    }
    setEditingQuestion(null);
  };

  const handleImportDocx = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const newQs = await importDocx(file);
      setQuestions(prev => [...prev, ...newQs]);
      alert(`Đã nhập thành công ${newQs.length} câu hỏi!`);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (Array.isArray(data)) {
          setQuestions(prev => [...prev, ...data]);
        } else if (data.questions) {
          setQuestions(prev => [...prev, ...data.questions]);
        }
        alert('Nhập dữ liệu thành công!');
      } catch (e) {
        alert('File JSON không hợp lệ.');
      }
    };
    reader.readAsText(file);
  };

  const handleExport = () => {
    const data = JSON.stringify(questions, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gglh-questions-${Date.now()}.json`;
    a.click();
  };

  const handleGenerateAI = async () => {
    const topic = prompt('Nhập chủ đề bạn muốn tạo câu hỏi (ví dụ: Phép cộng lớp 1):');
    if (!topic) return;
    try {
      const newQs = await generateQuestions(aiSettings, topic);
      setQuestions(prev => [...prev, ...newQs]);
      alert(`Đã tạo thành công ${newQs.length} câu hỏi bằng AI!`);
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-blue-500/30 selection:text-blue-200 overflow-x-hidden">
      <Header 
        onGoHome={() => setScreen('home')}
        onOpenSettings={() => setIsAISettingsOpen(true)}
        onOpenManager={() => setScreen('manager')}
        onOpenGuide={() => setScreen('guide')}
        currentScreen={screen}
      />

      <main className="pt-20">
        <AnimatePresence mode="wait">
          {screen === 'home' && (
            <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Home onSelectGame={setScreen} onOpenManager={() => setScreen('manager')} />
            </motion.div>
          )}

          {screen === 'manager' && (
            <motion.div key="manager" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <QuestionManager 
                questions={questions}
                onBack={() => setScreen('home')}
                onAdd={() => { setEditingQuestion(null); setIsAddingQuestion(true); }}
                onEdit={(q) => { setEditingQuestion(q); setIsAddingQuestion(true); }}
                onDelete={(id) => setQuestions(prev => prev.filter(q => q.id !== id))}
                onImportDocx={handleImportDocx}
                onImportJson={handleImportJson}
                onExport={handleExport}
                onGenerateAI={handleGenerateAI}
                hasAIKey={!!aiSettings.apiKey}
              />
            </motion.div>
          )}

          {screen === 'guide' && (
            <motion.div key="guide" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Guide />
            </motion.div>
          )}

          {/* Core Games */}
          {screen === 'game-millionaire' && (
            <MillionaireGame questions={questions} onBack={() => setScreen('home')} addHistory={addHistory} />
          )}
          {screen === 'game-race' && (
            <RaceGame questions={questions} onBack={() => setScreen('home')} addHistory={addHistory} />
          )}
          {screen === 'game-cards' && (
            <CardsGame questions={questions} onBack={() => setScreen('home')} addHistory={addHistory} />
          )}
          {screen === 'game-bell' && (
            <BellGame questions={questions} onBack={() => setScreen('home')} />
          )}
          {screen === 'game-flower' && (
            <FlowerGame questions={questions} onBack={() => setScreen('home')} addHistory={addHistory} />
          )}
          {screen === 'game-crossword' && (
            <CrosswordGame questions={questions} onBack={() => setScreen('home')} />
          )}

          {/* New Games */}
          {screen === 'game-castle' && (
            <CastleConquer questions={questions} onBack={() => setScreen('home')} addHistory={addHistory} />
          )}
          {screen === 'game-territory' && (
            <TerritoryBattle questions={questions} onBack={() => setScreen('home')} addHistory={addHistory} />
          )}
          {screen === 'game-wheel' && (
            <LuckyWheel questions={questions} onBack={() => setScreen('home')} addHistory={addHistory} />
          )}
          {screen === 'game-puzzle' && (
            <MysteryPuzzle questions={questions} onBack={() => setScreen('home')} addHistory={addHistory} />
          )}
          {screen === 'game-battleship' && (
            <Battleship questions={questions} onBack={() => setScreen('home')} addHistory={addHistory} />
          )}
          {screen === 'game-tower' && (
            <TowerBuilder questions={questions} onBack={() => setScreen('home')} addHistory={addHistory} />
          )}
          {screen === 'game-auction' && (
            <KnowledgeAuction questions={questions} onBack={() => setScreen('home')} addHistory={addHistory} />
          )}
          {screen === 'game-survival' && (
            <SurvivalIsland questions={questions} onBack={() => setScreen('home')} addHistory={addHistory} />
          )}
          {screen === 'game-race-to-finish' && (
            <RaceToFinish questions={questions} onBack={() => setScreen('home')} addHistory={addHistory} />
          )}
        </AnimatePresence>
      </main>

      {/* Modals */}
      <QuestionModal 
        isOpen={isAddingQuestion}
        onClose={() => setIsAddingQuestion(false)}
        editingQuestion={editingQuestion}
        onSave={handleSaveQuestion}
      />

      <AISettingsModal 
        isOpen={isAISettingsOpen}
        onClose={() => setIsAISettingsOpen(false)}
        settings={aiSettings}
        onSave={setAiSettings}
      />

      {/* Loading Overlays */}
      <AnimatePresence>
        {(isGenerating || isImporting) && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-md flex flex-col items-center justify-center"
          >
            <div className="w-20 h-20 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-8 shadow-[0_0_40px_rgba(59,130,246,0.3)]" />
            <p className="text-2xl font-black tracking-widest animate-pulse uppercase italic">
              {isGenerating ? 'AI ĐANG SOẠN CÂU HỎI...' : 'ĐANG XỬ LÝ FILE WORD...'}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
