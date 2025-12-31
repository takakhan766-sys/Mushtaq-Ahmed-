
import React, { useState, useEffect, useCallback } from 'react';
import { Button, Card } from '../UI.tsx';
import { audioService } from '../../services/audioService.ts';
import { Difficulty } from '../../types.ts';

interface Balloon {
  id: number;
  x: number;
  y: number;
  color: string;
}

const DIFFICULTY_CONFIG = {
  [Difficulty.EASY]: {
    time: 45,
    spawnRate: 1000,
    speed: 1.0,
    multiplier: 0.5,
    label: 'Easy (0.5x Tickets)',
    color: 'bg-green-500'
  },
  [Difficulty.MEDIUM]: {
    time: 30,
    spawnRate: 800,
    speed: 1.5,
    multiplier: 1.0,
    label: 'Medium (1.0x Tickets)',
    color: 'bg-yellow-500'
  },
  [Difficulty.HARD]: {
    time: 20,
    spawnRate: 500,
    speed: 2.5,
    multiplier: 2.0,
    label: 'Hard (2.0x Tickets)',
    color: 'bg-red-500'
  }
};

export const ShootingGallery: React.FC<{ 
  onWin: (tickets: number) => void;
  onPop?: () => void;
}> = ({ onWin, onPop }) => {
  const [balloons, setBalloons] = useState<Balloon[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);

  const colors = ['#f87171', '#60a5fa', '#fbbf24', '#34d399', '#f472b6'];

  const startGame = (diff: Difficulty) => {
    setDifficulty(diff);
    setScore(0);
    setTimeLeft(DIFFICULTY_CONFIG[diff].time);
    setIsPlaying(true);
    setBalloons([]);
  };

  const popBalloon = (id: number) => {
    setBalloons(prev => prev.filter(b => b.id !== id));
    setScore(s => s + 10);
    audioService.playPop();
    onPop?.();
  };

  useEffect(() => {
    if (!isPlaying || !difficulty) return;

    const config = DIFFICULTY_CONFIG[difficulty];

    const spawnInterval = setInterval(() => {
      setBalloons(prev => [
        ...prev,
        {
          id: Date.now(),
          x: Math.random() * 80 + 10,
          y: 100,
          color: colors[Math.floor(Math.random() * colors.length)]
        }
      ]);
    }, config.spawnRate);

    const timer = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          setIsPlaying(false);
          const rawReward = Math.floor(score / 5);
          const finalReward = Math.ceil(rawReward * config.multiplier);
          onWin(finalReward);
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => {
      clearInterval(spawnInterval);
      clearInterval(timer);
    };
  }, [isPlaying, score, onWin, difficulty]);

  useEffect(() => {
    if (!isPlaying || !difficulty) return;
    const config = DIFFICULTY_CONFIG[difficulty];
    const moveInterval = setInterval(() => {
      setBalloons(prev => prev
        .map(b => ({ ...b, y: b.y - config.speed }))
        .filter(b => b.y > -10)
      );
    }, 16);
    return () => clearInterval(moveInterval);
  }, [isPlaying, difficulty]);

  const renderDifficultySelection = () => (
    <div className="flex flex-col items-center justify-center flex-grow text-center p-8">
      <h2 className="text-5xl font-bungee text-orange-600 mb-4 tracking-tighter">Balloon Pop</h2>
      <p className="mb-10 text-gray-500 font-medium max-w-md">Choose your challenge. High difficulty means more tickets but faster balloons!</p>
      <div className="grid gap-4 w-full max-w-sm">
        {(Object.keys(DIFFICULTY_CONFIG) as Difficulty[]).map((diff) => (
          <Button 
            key={diff} 
            onClick={() => startGame(diff)}
            className={`w-full py-6 text-xl shadow-none border-b-8 ${
              diff === Difficulty.EASY ? 'bg-green-500 hover:bg-green-600 border-green-700' :
              diff === Difficulty.MEDIUM ? 'bg-yellow-400 hover:bg-yellow-500 border-yellow-600' :
              'bg-red-500 hover:bg-red-600 border-red-700'
            }`}
          >
            {DIFFICULTY_CONFIG[diff].label}
          </Button>
        ))}
      </div>
    </div>
  );

  return (
    <Card className="p-8 flex flex-col items-center max-w-2xl mx-auto h-[650px] relative border-4 border-sky-100">
      {difficulty && (
        <div className="flex justify-between w-full mb-6 bg-white/50 backdrop-blur rounded-2xl p-4 shadow-inner">
          <div className="flex flex-col">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Score</span>
            <span className="text-3xl font-bungee text-orange-600">{score}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Level</span>
            <span className="text-xl font-bungee text-sky-600">{difficulty}</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Time</span>
            <span className={`text-3xl font-bungee ${timeLeft < 10 ? 'text-rose-600 animate-pulse' : 'text-gray-700'}`}>{timeLeft}s</span>
          </div>
        </div>
      )}

      {!difficulty ? (
        renderDifficultySelection()
      ) : !isPlaying && timeLeft === 0 ? (
        <div className="flex flex-col items-center justify-center flex-grow animate-in zoom-in duration-500">
          <div className="text-8xl mb-6">🎯</div>
          <h2 className="text-5xl font-bungee text-orange-600 mb-2">TIME'S UP!</h2>
          <p className="text-2xl mb-8 font-playfair italic">
            You earned <span className="font-bold text-green-600">🎫 {Math.ceil(Math.floor(score / 5) * DIFFICULTY_CONFIG[difficulty].multiplier)}</span> tickets
          </p>
          <div className="flex gap-4">
            <Button onClick={() => setDifficulty(null)} variant="secondary">Change Difficulty</Button>
            <Button onClick={() => startGame(difficulty)}>Replay Level</Button>
          </div>
        </div>
      ) : (
        <div className="relative w-full h-full overflow-hidden bg-gradient-to-b from-sky-100 to-sky-50 rounded-3xl cursor-crosshair border-4 border-white shadow-2xl">
          <div className="absolute inset-0 opacity-20 mela-pattern"></div>
          {balloons.map(b => (
            <div
              key={b.id}
              onClick={() => popBalloon(b.id)}
              className="absolute w-14 h-18 rounded-full shadow-lg transform hover:scale-110 active:scale-90 transition-all cursor-pointer group"
              style={{
                left: `${b.x}%`,
                top: `${b.y}%`,
                backgroundColor: b.color,
                boxShadow: `inset -6px -6px 15px rgba(0,0,0,0.15), 0 8px 15px rgba(0,0,0,0.1)`
              }}
            >
              <div className="absolute top-1/4 left-1/4 w-3 h-4 bg-white/30 rounded-full blur-[1px]"></div>
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-0.5 h-6 bg-gray-400 opacity-40 group-hover:h-8 transition-all"></div>
            </div>
          ))}
          
          <div className="absolute top-10 left-10 text-6xl opacity-20 select-none pointer-events-none animate-float">☁️</div>
          <div className="absolute top-40 right-10 text-7xl opacity-20 select-none pointer-events-none animate-float" style={{ animationDelay: '1s' }}>☁️</div>
        </div>
      )}
    </Card>
  );
};
