
import React, { useState, useEffect, useRef } from 'react';

export const Button: React.FC<{
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary' | 'accent';
  disabled?: boolean;
}> = ({ onClick, children, className = '', variant = 'primary', disabled = false }) => {
  const baseStyles = "relative px-8 py-4 rounded-2xl font-bungee transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-tighter overflow-hidden group";
  
  const variants = {
    primary: "bg-orange-600 text-white hover:bg-orange-700 shadow-[0_6px_0_rgb(154,52,18)] hover:shadow-[0_3px_0_rgb(154,52,18)] hover:translate-y-[3px] active:translate-y-[6px] active:shadow-none",
    secondary: "bg-yellow-400 text-orange-900 hover:bg-yellow-500 shadow-[0_6px_0_rgb(161,98,7)] hover:shadow-[0_3px_0_rgb(161,98,7)] hover:translate-y-[3px] active:translate-y-[6px] active:shadow-none",
    accent: "bg-rose-600 text-white hover:bg-rose-700 shadow-[0_6px_0_rgb(159,18,57)] hover:shadow-[0_3px_0_rgb(159,18,57)] hover:translate-y-[3px] active:translate-y-[6px] active:shadow-none",
  };

  return (
    <button 
      onClick={onClick} 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={disabled}
    >
      <div className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </div>
      <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
    </button>
  );
};

export const Card: React.FC<{ children: React.ReactNode; className?: string; onClick?: () => void }> = ({ children, className = "", onClick }) => (
  <div 
    onClick={onClick}
    className={`bg-white rounded-[2rem] shadow-[0_15px_40px_rgba(0,0,0,0.08)] overflow-hidden border-2 border-orange-50 ${className}`}
  >
    {children}
  </div>
);

export const NumberTicker: React.FC<{ value: number }> = ({ value }) => {
  const [displayValue, setDisplayValue] = useState(value);
  const previousValueRef = useRef(value);

  useEffect(() => {
    const startValue = previousValueRef.current;
    const endValue = value;
    
    if (startValue === endValue) return;

    const duration = 800; // ms
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function: easeOutExpo
      const easedProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      
      const current = Math.floor(startValue + (endValue - startValue) * easedProgress);
      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        previousValueRef.current = endValue;
      }
    };

    requestAnimationFrame(animate);
  }, [value]);

  const isIncreasing = value > previousValueRef.current;
  const isDecreasing = value < previousValueRef.current;

  return (
    <span className={`inline-block transition-transform duration-300 ${isIncreasing ? 'scale-125 text-green-400' : isDecreasing ? 'scale-90 text-red-400' : ''}`}>
      {displayValue}
    </span>
  );
};
