
import React, { useState, useEffect } from 'react';
import { GameStall, UserStats, Quest } from './types.ts';
import { ShootingGallery } from './components/games/ShootingGallery.tsx';
import { FortuneTeller } from './components/games/FortuneTeller.tsx';
import { RingToss } from './components/games/RingToss.tsx';
import { PrizeBooth } from './components/games/PrizeBooth.tsx';
import { IntroGuide } from './components/IntroGuide.tsx';
import { Button, Card, NumberTicker } from './components/UI.tsx';
import { QuestLog } from './components/QuestLog.tsx';
import { audioService } from './services/audioService.ts';

const INITIAL_QUESTS: Quest[] = [
  {
    id: 'mela-explorer',
    title: 'Mela Explorer',
    description: 'Visit all the major stalls in the carnival.',
    objective: 'Visit 4 unique stalls',
    currentProgress: 0,
    targetProgress: 4,
    reward: 100,
    isCompleted: false,
    type: 'main'
  },
  {
    id: 'balloon-buster',
    title: 'Balloon Buster',
    description: 'Pop balloons at the shooting gallery.',
    objective: 'Pop 20 balloons',
    currentProgress: 0,
    targetProgress: 20,
    reward: 50,
    isCompleted: false,
    type: 'side'
  },
  {
    id: 'destiny-child',
    title: 'Destiny\'s Child',
    description: 'Consult Pandit Ji for mystical visions.',
    objective: 'Get 3 fortunes',
    currentProgress: 0,
    targetProgress: 3,
    reward: 30,
    isCompleted: false,
    type: 'side'
  },
  {
    id: 'ring-pro',
    title: 'Lucky Tosser',
    description: 'Master the ring toss technique.',
    objective: 'Score 5 hits in Ring Toss',
    currentProgress: 0,
    targetProgress: 5,
    reward: 40,
    isCompleted: false,
    type: 'side'
  }
];

const STALL_NAMES: Record<GameStall, string> = {
  [GameStall.MAP]: 'Main Fairground',
  [GameStall.SHOOTING_GALLERY]: 'Balloon Gallery',
  [GameStall.FORTUNE_TELLER]: 'Mystic Pandit Ji',
  [GameStall.RING_TOSS]: 'Golden Ring Toss',
  [GameStall.PRIZE_BOOTH]: 'Royal Prize Booth',
};

const App: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [showGuide, setShowGuide] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const [loadingStall, setLoadingStall] = useState<string | null>(null);
  const [activeStall, setActiveStall] = useState<GameStall>(GameStall.MAP);
  const [visitedStalls, setVisitedStalls] = useState<Set<GameStall>>(new Set());
  const [stats, setStats] = useState<UserStats>({
    tickets: 50,
    prizes: []
  });
  const [quests, setQuests] = useState<Quest[]>(INITIAL_QUESTS);

  useEffect(() => {
    if (gameStarted && activeStall !== GameStall.MAP) {
      setVisitedStalls(prev => {
        const next = new Set(prev);
        next.add(activeStall);
        updateQuestProgress('mela-explorer', next.size);
        return next;
      });
    }
  }, [activeStall, gameStarted]);

  const updateQuestProgress = (questId: string, progress: number | 'increment') => {
    setQuests(prev => prev.map(q => {
      if (q.id === questId && !q.isCompleted) {
        const newProgress = progress === 'increment' ? q.currentProgress + 1 : progress;
        const isCompleted = newProgress >= q.targetProgress;
        
        if (isCompleted && !q.isCompleted) {
          addTickets(q.reward);
        }
        
        return { ...q, currentProgress: newProgress, isCompleted };
      }
      return q;
    }));
  };

  const addTickets = (amount: number) => {
    setStats(prev => ({ ...prev, tickets: prev.tickets + amount }));
  };

  const handleBuyPrize = (prizeId: string, cost: number) => {
    if (stats.tickets >= cost && !stats.prizes.includes(prizeId)) {
      setStats(prev => ({
        tickets: prev.tickets - cost,
        prizes: [...prev.prizes, prizeId]
      }));
      audioService.playCelebrate();
    }
  };

  const startSequence = () => {
    setTransitioning(true);
    audioService.playDing();
    setTimeout(() => {
      setShowSplash(false);
      setShowGuide(true);
      setTransitioning(false);
    }, 1000);
  };

  const finishGuide = (targetStall: GameStall = GameStall.MAP) => {
    setTransitioning(true);
    setLoadingStall(STALL_NAMES[targetStall]);
    setTimeout(() => {
      document.body.classList.add('curtains-open');
      setShowGuide(false);
      setGameStarted(true);
      setActiveStall(targetStall);
      setTransitioning(false);
      setLoadingStall(null);
    }, 1500);
  };

  const navigateTo = (stall: GameStall) => {
    setTransitioning(true);
    setLoadingStall(STALL_NAMES[stall]);
    document.body.classList.remove('curtains-open');
    
    setTimeout(() => {
      setActiveStall(stall);
      document.body.classList.add('curtains-open');
      setTransitioning(false);
      setLoadingStall(null);
    }, 2000);
  };

  if (showSplash) {
    return (
      <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black overflow-hidden">
        <div className="absolute inset-0 mela-gradient opacity-80"></div>
        <div className="absolute inset-0 opacity-10 mela-pattern scale-150 animate-pulse"></div>
        
        <div className={`relative z-10 max-w-4xl w-full px-6 text-center transition-all duration-1000 transform ${transitioning ? 'scale-150 opacity-0 blur-xl' : 'scale-100 opacity-100 blur-0'}`}>
          <div className="text-[10rem] md:text-[12rem] mb-4 animate-float drop-shadow-[0_20px_50px_rgba(251,146,60,0.6)]">🎡</div>
          <h1 className="text-8xl md:text-9xl font-bungee text-white mb-6 tracking-tighter drop-shadow-[0_5px_15px_rgba(0,0,0,0.5)]">MELA</h1>
          <p className="text-2xl md:text-3xl font-playfair italic text-yellow-300 mb-16 drop-shadow-md">The Royal Carnival Awaits Your Arrival</p>
          
          <div className="flex justify-center items-center">
            <button 
              onClick={startSequence} 
              className="group relative bg-white text-orange-600 text-2xl md:text-3xl font-bungee px-16 py-8 rounded-2xl transform hover:scale-110 active:scale-95 transition-all shadow-[0_15px_0_rgb(200,200,200)] hover:shadow-[0_8px_0_rgb(200,200,200)] hover:translate-y-[7px] active:translate-y-[15px] active:shadow-none pulse-glow"
            >
              <span className="relative z-10 flex items-center gap-3">ENTER THE MELA 🎪</span>
            </button>
          </div>
        </div>

        <div className="curtain-left"></div>
        <div className="curtain-right"></div>
      </div>
    );
  }

  if (showGuide) {
    return <IntroGuide onFinish={finishGuide} />;
  }

  const renderStall = () => {
    switch (activeStall) {
      case GameStall.SHOOTING_GALLERY:
        return (
          <ShootingGallery 
            onWin={addTickets} 
            onPop={() => updateQuestProgress('balloon-buster', 'increment')} 
          />
        );
      case GameStall.FORTUNE_TELLER:
        return (
          <FortuneTeller 
            onConsult={() => updateQuestProgress('destiny-child', 'increment')} 
          />
        );
      case GameStall.RING_TOSS:
        return (
          <RingToss 
            onWin={addTickets} 
            onHit={() => updateQuestProgress('ring-pro', 'increment')} 
          />
        );
      case GameStall.PRIZE_BOOTH:
        return <PrizeBooth stats={stats} onBuy={handleBuyPrize} />;
      default:
        return (
          <div className="flex flex-col lg:flex-row gap-12 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-10 duration-1000">
            <div className="flex-grow space-y-12">
               <section>
                 <div className="flex items-center gap-4 mb-6">
                   <div className="h-1 flex-grow bg-gradient-to-r from-transparent to-orange-200"></div>
                   <h2 className="text-3xl font-bungee text-orange-600">ADVENTURE GAMES</h2>
                   <div className="h-1 flex-grow bg-gradient-to-l from-transparent to-orange-200"></div>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <MapCard 
                      title="Balloon Gallery" 
                      icon="🎈" 
                      color="from-sky-400 to-sky-700"
                      desc="Test your aim! Pop balloons to win huge ticket stacks."
                      onClick={() => navigateTo(GameStall.SHOOTING_GALLERY)} 
                      badge="MOST PLAYED"
                    />
                    <MapCard 
                      title="Golden Ring" 
                      icon="⭕" 
                      color="from-yellow-400 to-yellow-700"
                      desc="Skill and timing! Land the ring on the golden bull."
                      onClick={() => navigateTo(GameStall.RING_TOSS)} 
                      badge="HIGH STAKES"
                    />
                 </div>
               </section>

               <section>
                 <div className="flex items-center gap-4 mb-6">
                   <div className="h-1 flex-grow bg-gradient-to-r from-transparent to-purple-200"></div>
                   <h2 className="text-3xl font-bungee text-purple-700">MYSTIC & SHOP</h2>
                   <div className="h-1 flex-grow bg-gradient-to-l from-transparent to-purple-200"></div>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <MapCard 
                      title="Mystic Pandit Ji" 
                      icon="🔮" 
                      color="from-purple-500 to-purple-900"
                      desc="Unlock your future with AI-powered mystical insights."
                      onClick={() => navigateTo(GameStall.FORTUNE_TELLER)} 
                    />
                    <MapCard 
                      title="Royal Prizes" 
                      icon="🎁" 
                      color="from-rose-500 to-rose-900"
                      desc="Exchange your victory tickets for legendary souvenirs."
                      onClick={() => navigateTo(GameStall.PRIZE_BOOTH)} 
                    />
                 </div>
               </section>
            </div>
            <div className="lg:w-96 sticky top-28 h-fit">
              <QuestLog quests={quests} />
            </div>
          </div>
        );
    }
  };

  return (
    <div className={`min-h-screen pb-24 ${transitioning ? 'pointer-events-none' : ''}`}>
      <header className="sticky top-0 z-50 mela-gradient p-5 shadow-[0_10px_40px_rgba(0,0,0,0.3)] text-white border-b-4 border-yellow-400">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div 
            className="flex items-center gap-4 cursor-pointer group" 
            onClick={() => navigateTo(GameStall.MAP)}
          >
            <div className="relative">
               <span className="text-5xl group-hover:scale-125 transition-transform inline-block">🎪</span>
               <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full animate-ping"></div>
            </div>
            <h1 className="text-4xl font-bungee tracking-tighter drop-shadow-lg">MELA</h1>
          </div>
          
          <div className="flex items-center gap-6 bg-white/10 glass px-8 py-4 rounded-3xl border-2 border-white/20 shadow-2xl transition-all duration-300">
            <div className="flex flex-col items-center">
               <span className="text-xs font-bold text-yellow-200 tracking-widest uppercase">Tickets</span>
               <span className="text-3xl font-bungee text-white flex items-center gap-2">
                 🎫 <NumberTicker value={stats.tickets} />
               </span>
            </div>
            <div className="h-12 w-0.5 bg-white/20"></div>
            <div className="flex flex-col items-center">
               <span className="text-xs font-bold text-rose-200 tracking-widest uppercase">Collection</span>
               <span className="text-3xl font-bungee text-white flex items-center gap-2">
                 🏆 <NumberTicker value={stats.prizes.length} />
               </span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto mt-16 px-6">
        {activeStall !== GameStall.MAP && !transitioning && (
          <div className="flex justify-between items-center mb-10">
            <button 
              onClick={() => navigateTo(GameStall.MAP)}
              className="flex items-center gap-4 bg-white px-8 py-4 rounded-2xl text-orange-600 font-bungee hover:bg-orange-50 hover:shadow-2xl transition-all border-b-4 border-orange-200"
            >
              <span className="text-2xl">⬅</span> BACK TO FAIRGROUND
            </button>
          </div>
        )}
        
        {renderStall()}
      </main>

      <footer className="mt-40 py-24 text-center relative">
        <div className="absolute inset-0 bg-gradient-to-t from-orange-200/50 to-transparent"></div>
        <div className="relative z-10 space-y-8">
          <h4 className="font-bungee text-orange-900/40 text-2xl tracking-[1em]">ROYAL MELA</h4>
          <div className="flex justify-center gap-12 text-5xl grayscale opacity-30 hover:grayscale-0 hover:opacity-100 transition-all cursor-default">
            <span>🪔</span><span>🏵️</span><span>🐘</span><span>🥁</span><span>🏮</span>
          </div>
        </div>
      </footer>

      {/* Persistent Curtain Elements & Inter-game Loading Screen */}
      <div className={`fixed inset-0 z-[300] flex items-center justify-center transition-opacity duration-500 ${transitioning ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="curtain-left"></div>
        <div className="curtain-right"></div>
        
        {loadingStall && (
          <div className="relative z-[310] text-center space-y-8 animate-in zoom-in duration-500">
             <div className="w-32 h-32 mx-auto relative">
                <div className="absolute inset-0 border-8 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center text-4xl">🎡</div>
             </div>
             <div className="flex justify-center gap-2">
                {[0, 1, 2].map(i => (
                  <div key={i} className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: `${i * 0.1}s` }}></div>
                ))}
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

const MapCard: React.FC<{ 
  title: string; 
  icon: string; 
  color: string; 
  desc: string; 
  badge?: string;
  onClick: () => void 
}> = ({ title, icon, color, desc, badge, onClick }) => (
  <Card className="group relative overflow-hidden cursor-pointer h-full hover:shadow-[0_30px_70px_rgba(0,0,0,0.2)] transition-all duration-500 border-0 bg-white" onClick={onClick}>
    <div className={`h-60 bg-gradient-to-br ${color} flex items-center justify-center text-9xl transition-all duration-700 group-hover:scale-110 relative overflow-hidden`}>
      <div className="absolute inset-0 opacity-10 mela-pattern"></div>
      <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
      <span className="relative drop-shadow-2xl animate-float">{icon}</span>
      
      {badge && (
        <div className="absolute top-6 right-6 bg-yellow-400 text-red-900 font-bungee text-xs px-4 py-2 rounded-full shadow-lg transform rotate-12 group-hover:rotate-0 transition-transform">
          {badge}
        </div>
      )}
    </div>
    <div className="p-10 relative z-10 bg-white">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-4xl font-bungee text-gray-800 tracking-tight leading-none">{title}</h3>
        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-all shadow-inner">
          <span className="text-2xl">→</span>
        </div>
      </div>
      <p className="text-gray-500 font-medium text-lg leading-relaxed">{desc}</p>
    </div>
    <div className="absolute inset-0 border-[6px] border-transparent group-hover:border-yellow-400/30 transition-colors rounded-[2rem] pointer-events-none"></div>
  </Card>
);

export default App;
