export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: string; // "A", "B", "C", "D"
  image?: string;
  createdAt: number;
}

export interface GameHistory {
  gameName: string;
  score: number;
  teams?: { name: string; score: number }[];
  date: number;
}

export interface AISettings {
  apiKey: string;
  model: string;
}
