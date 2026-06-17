export type ViewType = 'home' | 'harassment' | 'items' | 'residents' | 'tasks' | 'scores' | 'settings';

export type MusicStyle = 'hardboiled' | 'lively' | 'light' | 'none';

export interface GameState {
  loopNumber: number;
  day: number;
  timeRemaining: number;
  power: number;
  money: number;
  location: string;
  musicStyle: MusicStyle;
  
  // Theme settings
  theme: 'cyberpunk' | 'aurora' | 'iron' | 'pixel' | 'gear' | 'relic' | 'parchment';
  colorScheme: 'cyan' | 'purple-pink' | 'gold' | 'white-blue';
  glitchEnabled: boolean;
  textBoxRatio: number;
  
  // Progress
  coreTasksSolved: boolean;
  
  // App State
  isMobileSimulated: boolean;
}
