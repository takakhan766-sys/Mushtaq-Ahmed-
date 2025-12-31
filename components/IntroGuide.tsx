
import React, { useState, useEffect } from 'react';
import { Button, Card } from './UI.tsx';
import { GameStall } from '../types.ts';

interface IntroGuideProps {
  onFinish: (target?: GameStall) => void;
}

const STEPS = [
  {
    title: "Namaste! I'm Gopal!",
    text: "Welcome to the Grand Royal Mela! I'll be your guide through the sights, sounds, and snacks of our beautiful fairground.",
    icon: "🙏"
  },
  {
    title: "Earn Your Tickets",
    text: "Try your hand at the Balloon Gallery or Golden Ring Toss. Every victory earns you tickets to spend at our famous Prize Booth!",
    icon: "🎫"
  },
  {
    title: "Seek Your Destiny",
    text: "Don't forget to visit the Mystic Pandit Ji. He uses ancient celestial wisdom (and a bit of AI) to peek into your future!",
    icon: "🔮"
  },
  {
    title: "Complete Your Quests",
    text: "Check your Quest Log! Completing special challenges will earn you even more bonus tickets. Good luck!",
    icon: "📜"
  }
];

export const IntroGuide: React.FC<IntroGuideProps> = ({ onFinish }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    let i = 0;
    const fullText = STEPS[currentStep].text;
    setDisplayText("");
    setIsTyping(true);
    
    const timer = setInterval(() => {
      setDisplayText(prev => prev + fullText.charAt(i));
      i++;
      if (i >= fullText.length) {
        clearInterval(timer);
        setIsTyping(false);
      }
    }, 25);
    
    return () => clearInterval(timer);
  }, [currentStep]);

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(s => s + 1);
    } else {
      onFinish();
    }
  };

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center p-6 bg-orange-50/90 backdrop-blur-md">
      <div className="max-w-5xl w-full flex flex-col md:flex-row items-center gap-12">
        
        {/* Character Illustration Area */}
        <div className="relative md:w-1/2 flex justify-center animate-in slide-in-from-left-20 duration-1000">
           {/* Replace this div with an <img src="guide.png" /> using the image you provided */}
           <div className="relative group">
              <div className="absolute inset-0 bg-yellow-400 blur-3xl opacity-20 rounded-full group-hover:opacity-40 transition-opacity scale-150"></div>
              
              {/* This is a visual representation of the provided character */}
              <div className="relative w-80 h-[500px] flex flex-col items-center">
                 {/* Hair */}
                 <div className="absolute top-0 w-48 h-40 bg-gray-900 rounded-t-[100px] -rotate-2"></div>
                 {/* Face */}
                 <div className="absolute top-10 w-40 h-44 bg-[#c68642] rounded-[80px] border-b-4 border-black/10 flex flex-col items-center pt-8">
                    <div className="w-3 h-8 bg-orange-700 rounded-full mb-4"></div> {/* Tilak */}
                    <div className="flex gap-10">
                       <div className="w-8 h-8 bg-white rounded-full border-2 border-black flex items-center justify-center">
                          <div className="w-4 h-4 bg-black rounded-full"></div>
                       </div>
                       <div className="w-8 h-8 bg-white rounded-full border-2 border-black flex items-center justify-center">
                          <div className="w-4 h-4 bg-black rounded-full"></div>
                       </div>
                    </div>
                    <div className="w-16 h-4 border-b-4 border-black/30 rounded-full mt-8"></div>
                 </div>
                 {/* Body */}
                 <div className="absolute top-[210px] w-48 h-56 bg-orange-600 rounded-t-3xl border-x-4 border-orange-700"></div>
                 {/* Dhoti/Shorts */}
                 <div className="absolute top-[390px] w-52 h-32 bg-orange-50 rounded-b-xl border-2 border-orange-200"></div>
                 <div className="absolute top-[490px] flex gap-20">
                    <div className="w-10 h-6 bg-[#c68642] rounded-full"></div>
                    <div className="w-10 h-6 bg-[#c68642] rounded-full"></div>
                 </div>
                 
                 {/* Emotional Icon Overlay */}
                 <div className="absolute -top-10 -right-10 text-8xl animate-bounce">
                    {STEPS[currentStep].icon}
                 </div>
              </div>
              
              {/* Optional: Actual Image Tag (Commented out until file is present) */}
              {/* <img src="guide.png" className="w-full h-auto drop-shadow-2xl" alt="Gopal Guide" /> */}
           </div>
        </div>

        {/* Dialogue Area */}
        <div className="md:w-1/2 flex flex-col gap-8 animate-in slide-in-from-right-20 duration-1000">
           <Card className="p-12 relative overflow-visible border-4 border-yellow-400 bg-white shadow-[0_30px_60px_rgba(249,115,22,0.1)]">
              {/* Speech Bubble Tail */}
              <div className="absolute top-1/2 -left-6 w-12 h-12 bg-white border-l-4 border-b-4 border-yellow-400 rotate-45 hidden md:block"></div>
              
              <div className="relative z-10">
                 <h2 className="text-4xl font-bungee text-orange-600 mb-6 tracking-tight">
                    {STEPS[currentStep].title}
                 </h2>
                 <p className="text-2xl font-playfair leading-relaxed text-gray-700 min-h-[140px]">
                    {displayText}
                    {isTyping && <span className="inline-block w-1 h-6 bg-orange-400 ml-1 animate-pulse"></span>}
                 </p>
              </div>
           </Card>

           <div className="flex items-center gap-6">
              <Button 
                onClick={handleNext}
                className="flex-grow py-6 text-2xl shadow-[0_10px_0_rgb(154,52,18)]"
              >
                {currentStep < STEPS.length - 1 ? "What Else? ✨" : "Let's Play! 🎡"}
              </Button>
              
              <button 
                onClick={() => onFinish()}
                className="px-8 py-6 text-gray-400 font-bold hover:text-orange-600 transition-colors uppercase tracking-widest text-sm"
              >
                Skip Guide
              </button>
           </div>
           
           <div className="flex gap-2">
              {STEPS.map((_, i) => (
                <div 
                  key={i} 
                  className={`h-2 rounded-full transition-all duration-500 ${i === currentStep ? 'w-12 bg-orange-500' : 'w-3 bg-gray-200'}`}
                />
              ))}
           </div>
        </div>

      </div>
    </div>
  );
};
