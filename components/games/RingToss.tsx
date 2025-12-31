
import React, { useState, useEffect, useRef } from 'react';
import { Button, Card } from '../UI.tsx';
import { audioService } from '../../services/audioService.ts';
import { Difficulty } from '../../types.ts';

const DIFFICULTY_CONFIG = {
  [Difficulty.EASY]: {
    targetWidth: 25,
    speed: 2,
    rewardPerHit: 5,
    label: 'Easy (5 Tickets/Hit)',
    color: 'bg-green-500'
  },
  [Difficulty.MEDIUM]: {
    targetWidth: 15,
    speed: 4,
    rewardPerHit: 10,
    label: 'Medium (10 Tickets/Hit)',
    color: 'bg-yellow-500'
  },
  [Difficulty.HARD]: {
    targetWidth: 8,
    speed: 7,
    rewardPerHit: 25,
    label: 'Hard (25 Tickets/Hit)',
    color: 'bg-red-500'
  }
};

export const RingToss: React.FC<{ 
  onWin: (tickets: number) => void;
  onHit?: () => void;
}> = ({ onWin, onHit }) => {
  const [pos, setPos] = useState(50);
  const [direction, setDirection] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [attempts, setAttempts] = useState(5);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  
  const targetPos = 50; // Center

  useEffect(() => {
    if (!isPlaying || gameOver || !difficulty) return;

    const config = DIFFICULTY_CONFIG[difficulty];
    const interval = setInterval(() => {
      setPos(p => {
        if (p >= 92) { setDirection(-1); return 92; }
        if (p <= 8) { setDirection(1); return 8; }
        return p + (direction * config.speed);
      });
    }, 20);

    return () => clearInterval(interval);
  }, [isPlaying, direction, gameOver, difficulty]);

  const toss = () => {
    if (attempts <= 0 || !difficulty) return;

    const config = DIFFICULTY_CONFIG[difficulty];
    const diff = Math.abs(pos - targetPos);
    
    if (diff < config.targetWidth / 2) {
      setScore(s => s + 1);
      audioService.playDing();
      onHit?.();
    } else {
      audioService.playPop(); 
    }

    setAttempts(a => {
      const nextA = a - 1;
      if (nextA <= 0) {
        setGameOver(true);
        setIsPlaying(false);
        const finalReward = (score + (diff < config.targetWidth / 2 ? 1 : 0)) * config.rewardPerHit;
        onWin(finalReward);
      }
      return nextA;
    });
  };

  const selectDifficulty = (diff: Difficulty) => {
    setDifficulty(diff);
    reset();
  };

  const reset = () => {
    setAttempts(5);
    setScore(0);
    setGameOver(false);
    setIsPlaying(true);
  };

  const renderDifficultySelection = () => (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      <div className="text-8xl mb-6">⭕</div>
      <h2 className="text-4xl font-bungee text-yellow-600 mb-2">Golden Ring Toss</h2>
      <p className="text-gray-500 mb-10 max-w-xs font-medium">Land the ring on the center peg! Narrower targets pay out legendary rewards.</p>
      
      <div className="grid gap-4 w-full px-4">
        {(Object.keys(DIFFICULTY_CONFIG) as Difficulty[]).map((diff) => (
          <Button 
            key={diff} 
            onClick={() => selectDifficulty(diff)}
            className={`w-full py-5 text-xl shadow-none border-b-8 ${
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
    <Card className="max-w-xl mx-auto p-10 border-8 border-yellow-400 shadow-2xl bg-orange-50/30">
      {!difficulty ? (
        renderDifficultySelection()
      ) : (
        <>
          <div className="flex justify-between items-center mb-10 bg-white p-6 rounded-3xl shadow-inner border-2 border-yellow-100">
            <div className="text-center">
              <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Attempts</p>
              <div className="flex gap-1 justify-center">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className={`w-4 h-4 rounded-full border-2 border-yellow-400 ${i < attempts ? 'bg-yellow-400' : 'bg-transparent'}`}></div>
                ))}
              </div>
            </div>
            <div className="h-10 w-px bg-yellow-200"></div>
            <div className="text-center">
              <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Hits</p>
              <p className="text-4xl font-bungee text-green-600">{score}</p>
            </div>
            <div className="h-10 w-px bg-yellow-200"></div>
            <div className="text-center">
               <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Mode</p>
               <p className="text-sm font-bungee text-yellow-600">{difficulty}</p>
            </div>
          </div>

          <div className="relative w-full h-40 bg-white rounded-[3rem] mb-12 overflow-hidden border-4 border-yellow-200 shadow-lg flex items-center">
            <div className="absolute inset-0 opacity-5 mela-pattern"></div>
            
            <div 
              className="absolute h-full bg-green-400/20 backdrop-blur-[2px]"
              style={{ 
                left: `${targetPos - DIFFICULTY_CONFIG[difficulty].targetWidth/2}%`, 
                width: `${DIFFICULTY_CONFIG[difficulty].targetWidth}%` 
              }}
            />
            
            <div className="absolute left-1/2 -translate-x-1/2 h-24 w-6 bg-gradient-to-b from-yellow-300 to-yellow-600 rounded-full border-2 border-black/10 shadow-lg flex items-center justify-center">
               <div className="w-2 h-16 bg-white/20 rounded-full blur-[1px]"></div>
            </div>

            <div 
              className="absolute w-24 h-24 border-[10px] border-yellow-500 rounded-full flex items-center justify-center bg-transparent shadow-[0_10px_20px_rgba(0,0,0,0.2)] transition-transform z-10"
              style={{ left: `${pos}%`, transform: 'translateX(-50%)' }}
            >
              <div className="absolute inset-0 border-4 border-yellow-200/50 rounded-full"></div>
              <div className="absolute -inset-2 border-2 border-black/5 rounded-full"></div>
            </div>
            
            <div className="absolute bottom-0 left-0 w-full h-2 bg-gray-100">
               <div 
                 className="h-full bg-yellow-400 transition-all duration-300" 
                 style={{ width: `${pos}%` }}
               ></div>
            </div>
          </div>

          {gameOver ? (
            <div className="text-center animate-in zoom-in duration-500">
              <div className="text-6xl mb-4">✨</div>
              <h3 className="text-3xl font-bungee text-orange-600 mb-2">Mela Champion!</h3>
              <p className="text-xl font-playfair italic mb-8">
                You won <span className="font-bold text-green-600">🎫 {score * DIFFICULTY_CONFIG[difficulty].rewardPerHit}</span> tickets!
              </p>
              <div className="flex gap-4">
                <Button onClick={() => setDifficulty(null)} variant="secondary" className="flex-grow">New Difficulty</Button>
                <Button onClick={reset} className="flex-grow">Try Again</Button>
              </div>
            </div>
          ) : isPlaying ? (
            <Button 
              onClick={toss} 
              className="w-full h-24 text-3xl bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 active:scale-95 transition-all shadow-[0_10px_0_rgb(194,120,3)] border-0"
            >
              TOSS RING! 🚀
            </Button>
          ) : (
            <Button onClick={() => setIsPlaying(true)} className="w-full h-20">Start Round</Button>
          )}
        </>
      )}
    </Card>
  );
};
