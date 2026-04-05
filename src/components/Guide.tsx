import React from 'react';
import { motion } from 'motion/react';
import { BookOpen, Gamepad2, Settings, Lightbulb, Sparkles, Users, Upload } from 'lucide-react';

const Guide: React.FC = () => {
  const games = [
    { icon: '💰', name: 'Ai là Triệu phú', desc: 'Trả lời câu hỏi trắc nghiệm, leo cấp nhận thưởng.', players: '1 người' },
    { icon: '🏃', name: 'Vượt chướng ngại vật', desc: 'Đua tốc độ trả lời, vượt qua chướng ngại vật.', players: '2-4 đội' },
    { icon: '🃏', name: 'Lật thẻ bí ẩn', desc: 'Thử thách trí nhớ, lật thẻ tìm cặp đáp án.', players: '1-2 người' },
    { icon: '🔔', name: 'Rung chuông vàng', desc: 'Thi đấu loại trực tiếp giữa các đội.', players: 'Cả lớp' },
    { icon: '🌸', name: 'Hái hoa dân chủ', desc: 'Chọn hoa, trả lời câu hỏi và nhận quà.', players: '1 người' },
    { icon: '🧩', name: 'Ô chữ thần kỳ', desc: 'Giải mã ô chữ bí ẩn từ các hàng ngang.', players: 'Cả lớp' },
    { icon: '🏰', name: 'Công thành chiến', desc: 'Tấn công/phòng thủ lâu đài bằng kiến thức.', players: '2 đội' },
    { icon: '🗺️', name: 'Tranh lãnh thổ', desc: 'Chiếm vùng đất trên bản đồ chiến thuật.', players: '2-4 đội' },
    { icon: '🎡', name: 'Vòng quay may mắn', desc: 'Quay vòng quay nhận điểm thưởng bất ngờ.', players: '2-4 đội' },
    { icon: '🖼️', name: 'Bí mật ẩn giấu', desc: 'Mở mảnh ghép, đoán từ khóa bí ẩn.', players: '2-4 đội' },
    { icon: '🚢', name: 'Hải chiến đại dương', desc: 'Bắn tàu đối thủ bằng kiến thức.', players: '2 đội' },
    { icon: '🧱', name: 'Xây tháp kiến thức', desc: 'Xây tháp cao nhất, cẩn thận đổng đất!', players: '2-4 đội' },
    { icon: '🔨', name: 'Đấu giá trí tuệ', desc: 'Đặt cược coins, trả lời đúng x2.', players: '2-4 đội' },
    { icon: '🏝️', name: 'Sinh tồn trên đảo', desc: 'Thu thập tài nguyên, sinh tồn bằng kiến thức.', players: '2-4 đội' },
    { icon: '🏁', name: 'Đường đua kỳ thú', desc: 'Đổ xúc xắc, vượt đường đua thú vị.', players: '1-4 người' },
  ];

  const Section: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode; delay?: number }> = ({ icon, title, children, delay = 0 }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-slate-800/50 backdrop-blur-md border border-white/10 rounded-[2rem] p-8 md:p-10"
    >
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
          {icon}
        </div>
        <h3 className="text-xl font-black text-white uppercase tracking-tight">{title}</h3>
      </div>
      {children}
    </motion.div>
  );

  const Step: React.FC<{ num: number; text: string; color?: string }> = ({ num, text, color = 'bg-blue-600' }) => (
    <div className="flex items-start gap-4 py-3">
      <div className={`w-8 h-8 ${color} rounded-full flex items-center justify-center text-white text-sm font-black shrink-0 shadow-lg`}>
        {num}
      </div>
      <p className="text-slate-300 font-medium leading-relaxed pt-0.5">{text}</p>
    </div>
  );

  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-950 p-6 md:p-12 flex flex-col items-center">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center mb-16"
      >
        <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[1.5rem] flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-blue-600/30">
          <BookOpen size={36} className="text-white" />
        </div>
        <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-3">
          📖 Hướng Dẫn Sử Dụng
        </h2>
        <p className="text-slate-500 font-bold text-sm uppercase tracking-widest">
          Cùng tìm hiểu cách chơi và quản lý nhé!
        </p>
      </motion.div>

      {/* Content */}
      <div className="w-full max-w-3xl space-y-8">
        {/* Section 1: How to play */}
        <Section icon={<Gamepad2 size={20} />} title="Cách chơi game" delay={0.1}>
          <div className="space-y-1">
            <Step num={1} text="Nhấn vào thẻ game bạn muốn chơi ở Trang Chủ." />
            <Step num={2} text="Đọc hướng dẫn nhanh, thiết lập số đội hoặc số lượng câu hỏi (nếu có)." />
            <Step num={3} text='Nhấn "BẮT ĐẦU CHƠI" và thưởng thức!' />
          </div>
        </Section>

        {/* Section 2: Question management */}
        <Section icon={<Settings size={20} />} title="Quản lý câu hỏi" delay={0.2}>
          <div className="space-y-1">
            <Step num={1} text='Nhấn nút "Quản lý" hoặc "Kho đề" ở header.' color="bg-emerald-600" />
            <Step num={2} text="Thêm câu hỏi thủ công hoặc sử dụng AI để tạo tự động theo chủ đề." color="bg-emerald-600" />
            <Step num={3} text="Có thể nhập hàng loạt câu hỏi từ file Word (.docx) hoặc file JSON." color="bg-emerald-600" />
          </div>
        </Section>

        {/* Section 3: AI Setup */}
        <Section icon={<Sparkles size={20} />} title="Cài đặt Gemini AI" delay={0.3}>
          <div className="space-y-1">
            <Step num={1} text="Nhấn biểu tượng ⚙️ (bánh răng) ở góc trên bên phải." color="bg-violet-600" />
            <Step num={2} text="Nhập Gemini API Key (lấy miễn phí tại aistudio.google.com)." color="bg-violet-600" />
            <Step num={3} text="Chọn model AI phù hợp: Gemini 2.0 Flash (nhanh) hoặc Gemini 1.5 Pro (chính xác)." color="bg-violet-600" />
            <Step num={4} text="Hệ thống tự động đổi model dự phòng nếu model chính gặp lỗi." color="bg-violet-600" />
          </div>
        </Section>

        {/* Section 4: Available games */}
        <Section icon={<Users size={20} />} title={`Các game có sẵn (${games.length} game)`} delay={0.4}>
          <div className="space-y-2">
            {games.map((game, i) => (
              <div
                key={i}
                className="flex items-center gap-4 py-3 px-4 rounded-2xl hover:bg-white/5 transition-colors group"
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-black shrink-0 shadow-lg ${
                  i < 6 ? 'bg-blue-600' : 'bg-indigo-600'
                }`}>
                  {i + 1}
                </div>
                <span className="text-2xl shrink-0">{game.icon}</span>
                <div className="flex-1 min-w-0">
                  <span className="text-white font-bold">{game.name}</span>
                  <span className="text-slate-500 mx-2">–</span>
                  <span className="text-slate-400 text-sm">{game.desc}</span>
                </div>
                <span className="hidden sm:inline-flex text-[10px] font-black uppercase tracking-wider bg-white/5 border border-white/10 text-slate-500 px-3 py-1 rounded-full shrink-0">
                  {game.players}
                </span>
              </div>
            ))}
          </div>
        </Section>

        {/* Section 5: Import guide */}
        <Section icon={<Upload size={20} />} title="Nhập câu hỏi từ file Word" delay={0.5}>
          <div className="space-y-1">
            <Step num={1} text="Soạn file Word (.docx) theo định dạng: Câu hỏi – 4 đáp án (A, B, C, D) – Đáp án đúng." color="bg-amber-600" />
            <Step num={2} text='Vào "Kho đề" → nhấn nút "NHẬP ĐỀ (DOCX)" → chọn file.' color="bg-amber-600" />
            <Step num={3} text="Hệ thống tự động phân tích và thêm câu hỏi vào kho dữ liệu." color="bg-amber-600" />
          </div>
        </Section>

        {/* Section 6: Tips */}
        <Section icon={<Lightbulb size={20} />} title="Mẹo hay" delay={0.6}>
          <div className="space-y-1">
            <Step num={1} text="Upload file Word (.docx) để nhập nhanh câu hỏi thay vì gõ tay." color="bg-rose-600" />
            <Step num={2} text="Sử dụng AI để tạo câu hỏi theo chủ đề bất kỳ chỉ trong vài giây." color="bg-rose-600" />
            <Step num={3} text="Xuất file JSON để sao lưu kho câu hỏi, tránh mất dữ liệu trình duyệt." color="bg-rose-600" />
            <Step num={4} text="Thử nhiều game khác nhau để ôn bài hiệu quả và không nhàm chán!" color="bg-rose-600" />
          </div>
        </Section>
      </div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-16 mb-8 text-center"
      >
        <p className="text-slate-600 font-bold text-[10px] uppercase tracking-[0.4em]">
          © 2026 Góc Game Lớp Học — Phát triển bởi thầy Nguyễn Việt Hùng
        </p>
      </motion.div>
    </div>
  );
};

export default Guide;
