
export enum GameStall {
  MAP = 'MAP',
  SHOOTING_GALLERY = 'SHOOTING_GALLERY',
  FORTUNE_TELLER = 'FORTUNE_TELLER',
  RING_TOSS = 'RING_TOSS',
  PRIZE_BOOTH = 'PRIZE_BOOTH'
}

export enum Difficulty {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD'
}

export interface UserStats {
  tickets: number;
  prizes: string[];
}

export interface Prize {
  id: string;
  name: string;
  cost: number;
  image: string;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  objective: string;
  currentProgress: number;
  targetProgress: number;
  reward: number;
  isCompleted: boolean;
  type: 'main' | 'side';
}
