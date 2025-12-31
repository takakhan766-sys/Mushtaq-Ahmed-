
import React, { useState } from 'react';
import { Button, Card } from '../UI.tsx';
import { getFortune } from '../../services/geminiService.ts';

export const FortuneTeller: React.FC<{ onConsult?: () => void }> = ({ onConsult }) => {
  const [name, setName] = useState('');
  const [zodiac, setZodiac] = useState('');
  const [fortune, setFortune] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const signs = [
    'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 
    'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
  ];

  const handleConsult = async () => {
    if (!name || !zodiac) return;
    setLoading(true);
    const result = await getFortune(name, zodiac);
    setFortune(result);
    setLoading(false);
    onConsult?.();
  };

  return (
    <Card className="max-w-2xl mx-auto p-0 border-0 shadow-2xl overflow-hidden bg-transparent">
      <div className="bg-gradient-to-b from-indigo-900 via-purple-900 to-indigo-950 p-12 relative">
        <div className="absolute inset-0 mela-pattern opacity-10"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from)_0%,_transparent_70%)] opacity-30 from-purple-500"></div>
        
        <div className="relative z-10 text-center mb-10">
          <h2 className="text-5xl font-bungee text-yellow-400 mb-4 drop-shadow-lg tracking-tighter">Pandit Ji's Oracle</h2>
          <div className="w-32 h-32 mx-auto mb-6 text-8xl animate-float drop-shadow-[0_0_30px_rgba(192,132,252,0.8)]">🔮</div>
          <p className="text-purple-200 italic font-playfair text-xl">"The cosmos whispers your name across the ages..."</p>
        </div>

        {!fortune ? (
          <div className="relative z-10 space-y-8 glass p-10 rounded-3xl">
            <div className="space-y-2">
              <label className="block text-sm font-bold text-purple-200 uppercase tracking-widest ml-1">Thy Chosen Name</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white/10 text-white placeholder-white/30 px-6 py-4 rounded-2xl border-2 border-purple-400/30 focus:border-yellow-400 outline-none transition-all text-xl"
                placeholder="Enter name..."
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-bold text-purple-200 uppercase tracking-widest ml-1">Thy Celestial Sign</label>
              <select 
                value={zodiac}
                onChange={(e) => setZodiac(e.target.value)}
                className="w-full bg-white/10 text-white px-6 py-4 rounded-2xl border-2 border-purple-400/30 focus:border-yellow-400 outline-none transition-all text-xl appearance-none"
              >
                <option value="" className="text-gray-900">Select Sign</option>
                {signs.map(s => <option key={s} value={s} className="text-gray-900">{s}</option>)}
              </select>
            </div>
            <Button 
              className="w-full h-20 text-2xl bg-yellow-400 hover:bg-yellow-500 text-purple-950 font-bungee shadow-[0_8px_0_rgb(161,98,7)] hover:shadow-[0_4px_0_rgb(161,98,7)] active:shadow-none translate-y-0 hover:translate-y-1 active:translate-y-2"
              onClick={handleConsult}
              disabled={!name || !zodiac || loading}
            >
              {loading ? "Aligning Stars..." : "REVEAL MY DESTINY"}
            </Button>
          </div>
        ) : (
          <div className="relative z-10 text-center space-y-10 animate-in fade-in zoom-in duration-700">
            <div className="glass p-12 rounded-[2rem] border-2 border-yellow-400/50 shadow-[0_0_50px_rgba(250,204,21,0.2)]">
              <p className="text-3xl font-playfair italic font-bold text-white leading-relaxed drop-shadow-md">
                "{fortune}"
              </p>
            </div>
            <Button 
              className="px-12 py-5 bg-white/20 text-white hover:bg-white/30 font-bungee"
              onClick={() => setFortune(null)}
            >
              Consult Once More
            </Button>
          </div>
        )}
      </div>
      <div className="h-4 bg-yellow-400"></div>
    </Card>
  );
};
