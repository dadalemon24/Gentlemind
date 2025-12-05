import React, { useEffect, useState } from 'react';
import { Language } from '../types';
import { TRANSLATIONS } from '../constants';

interface BreathingExerciseProps {
  isActive: boolean;
  lang: Language;
}

const BreathingExercise: React.FC<BreathingExerciseProps> = ({ isActive, lang }) => {
  const [phase, setPhase] = useState<'inhale' | 'exhale'>('inhale');
  const t = TRANSLATIONS[lang].breathing;
  const [text, setText] = useState(t.inhale);

  useEffect(() => {
    if (!isActive) {
        setText(t.ready);
        return;
    }

    // Update text based on phase
    if (phase === 'inhale') setText(t.inhale);
    else if (phase === 'exhale') setText(t.exhale);

  }, [lang, isActive, phase]);

  useEffect(() => {
    if (!isActive) return;

    // Initial
    setPhase('inhale');

    // Cycle: Inhale (4s) -> Exhale (6s)
    // Total 10s cycle
    const cycle = () => {
      setPhase('inhale');
      setTimeout(() => {
        if(isActive) setPhase('exhale');
      }, 4000); // After 4s, switch to exhale
    };

    cycle(); // Start immediately
    const interval = setInterval(cycle, 10000); // Repeat every 10s

    return () => clearInterval(interval);
  }, [isActive]);

  let scaleClass = 'scale-100';
  let opacityClass = 'opacity-50';

  if (isActive) {
    if (phase === 'inhale') {
      scaleClass = 'scale-150 duration-[4000ms] ease-in-out';
      opacityClass = 'opacity-100';
    } else { // exhale
      scaleClass = 'scale-100 duration-[6000ms] ease-out';
      opacityClass = 'opacity-60';
    }
  }

  return (
    <div className="flex flex-col items-center justify-center py-10">
      <div className="relative flex items-center justify-center w-64 h-64">
        {/* Outer Ring */}
        <div className={`absolute w-48 h-48 bg-rose-200 rounded-full blur-xl transition-all ${scaleClass} ${opacityClass}`}></div>
        
        {/* Inner Circle */}
        <div className={`absolute w-40 h-40 bg-gradient-to-br from-rose-300 to-violet-400 rounded-full shadow-lg shadow-rose-200/50 flex items-center justify-center transition-all ${scaleClass}`}>
          <span className="text-white text-xl font-medium tracking-widest drop-shadow-md">
            {isActive ? (phase === 'inhale' ? (lang === 'th' ? 'เข้า' : 'In') : (lang === 'th' ? 'ออก' : 'Out')) : (lang === 'th' ? 'พัก' : 'Rest')}
          </span>
        </div>
      </div>
      <p className="mt-8 text-xl text-rose-800 font-light animate-pulse tracking-wide">{isActive ? text : t.ready}</p>
    </div>
  );
};

export default BreathingExercise;