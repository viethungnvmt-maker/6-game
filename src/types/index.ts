export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: string; // "A", "B", "C", "D"
  image?: string;
  subjectId?: string;
  topicId?: string;
  createdAt: number;
}

export interface Subject {
  id: string;
  name: string;
  color: string;
  topics: Topic[];
}

export interface Topic {
  id: string;
  name: string;
}

export interface ClassRoom {
  id: string;
  name: string;
  students: string[];
}

export interface GameHistory {
  gameName: string;
  score: number;
  teams?: { name: string; score: number }[];
  date: number;
}

export interface GameSettings {
  timers: Record<string, number>; // gameId -> seconds (0 = unlimited)
  teams: { count: number; names: string[] };
  puzzleKeyword: string;
  puzzleImage: string;
  raceTrackLength: number;
  wheelTargetScore: number;
  auctionStartCoins: number;
  auctionRounds: number;
  crosswordKeyword: string;
  crosswordRows: string[];
}

export interface AISettings {
  apiKey: string;
  model: string;
}
