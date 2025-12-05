import React, { useState, useEffect, useRef } from 'react';
import { 
  Heart, 
  Play, 
  Pause, 
  CheckCircle, 
  Home, 
  ArrowLeft,
  Sparkles,
  Globe,
  Sun,
  Calendar
} from 'lucide-react';

import { AppView, Mood, MoodConfig, SessionRecord, MeditationConfig, Language } from './types';
import { MOODS, DURATION_PRESETS, TRANSLATIONS } from './constants';
import { generateWisdomCard, generateMeditationScript, generatePostSessionMessage } from './services/geminiService';
import BreathingExercise from './components/BreathingExercise';
import StatsChart from './components/StatsChart';

const App: React.FC = () => {
  // State
  const [view, setView] = useState<AppView>(AppView.MOOD_CHECKIN);
  const [currentMood, setCurrentMood] = useState<Mood | null>(null);
  const [wisdomQuote, setWisdomQuote] = useState<string>('');
  const [meditationScript, setMeditationScript] = useState<string>('');
  const [postSessionMessage, setPostSessionMessage] = useState<string>('');
  
  // Config
  const [config, setConfig] = useState<MeditationConfig>({ durationSeconds: 300 });
  const [inputMin, setInputMin] = useState(5);
  const [inputSec, setInputSec] = useState(0);

  const [timeLeft, setTimeLeft] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [sessions, setSessions] = useState<SessionRecord[]>([]);
  const [isLoadingGemini, setIsLoadingGemini] = useState(false);
  const [lang, setLang] = useState<Language>('en');
  
  // Translation Helper
  const t = TRANSLATIONS[lang];

  // Load History & Language
  useEffect(() => {
    const savedSessions = localStorage.getItem('mindful_sessions');
    if (savedSessions) {
      setSessions(JSON.parse(savedSessions));
    }
    const savedLang = localStorage.getItem('mindful_lang');
    if (savedLang === 'th' || savedLang === 'en') {
        setLang(savedLang as Language);
    }
  }, []);

  // Update config when inputs change
  useEffect(() => {
    setConfig(prev => ({ ...prev, durationSeconds: (inputMin * 60) + inputSec }));
  }, [inputMin, inputSec]);

  // Timer Logic
  useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      handleCompleteSession();
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  // Text-to-Speech Logic
  useEffect(() => {
    if (isActive && meditationScript && view === AppView.MEDITATION) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(meditationScript);
        utterance.lang = lang === 'th' ? 'th-TH' : 'en-US';
        utterance.rate = 0.9; 
        utterance.pitch = 1.0;
        window.speechSynthesis.speak(utterance);
    }
    return () => {
        window.speechSynthesis.cancel();
    };
  }, [meditationScript, isActive, view, lang]);


  // Handlers
  const toggleLanguage = () => {
    const newLang = lang === 'th' ? 'en' : 'th';
    setLang(newLang);
    localStorage.setItem('mindful_lang', newLang);
  };

  const handleMoodSelect = async (mood: MoodConfig) => {
    setCurrentMood(mood.id);
    setIsLoadingGemini(true);
    setView(AppView.WISDOM);
    const quote = await generateWisdomCard(mood.id, lang);
    setWisdomQuote(quote);
    setIsLoadingGemini(false);
  };

  const startMeditationSetup = () => {
    setView(AppView.SETUP);
  };

  const startSession = async () => {
    setTimeLeft(config.durationSeconds);
    setIsActive(true);
    setView(AppView.MEDITATION);
    
    setMeditationScript('');
    setPostSessionMessage(''); // Reset post session message

    if (currentMood) {
        // Convert to approx minutes for the prompt
        const durationMin = Math.ceil(config.durationSeconds / 60);
        
        // Generate Script
        const scriptPromise = generateMeditationScript(currentMood, durationMin, lang);
        
        // Generate Post-Session Healing Message
        const postMsgPromise = generatePostSessionMessage(currentMood, lang);

        // Set them when ready
        scriptPromise.then(setMeditationScript);
        postMsgPromise.then(setPostSessionMessage);
    }
  };

  const toggleTimer = () => {
    const newActiveState = !isActive;
    setIsActive(newActiveState);
    
    if (newActiveState) {
        window.speechSynthesis.resume();
    } else {
        window.speechSynthesis.pause();
    }
  };

  const stopSession = () => {
    setIsActive(false);
    window.speechSynthesis.cancel(); 
    setView(AppView.SETUP);
  };

  const handleCompleteSession = () => {
    setIsActive(false);
    window.speechSynthesis.cancel();
    
    const newSession: SessionRecord = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      durationMinutes: parseFloat((config.durationSeconds / 60).toFixed(2)),
      moodBefore: currentMood || Mood.NORMAL,
    };

    const updatedSessions = [...sessions, newSession];
    setSessions(updatedSessions);
    localStorage.setItem('mindful_sessions', JSON.stringify(updatedSessions));
    
    setView(AppView.SUMMARY);
  };

  const resetApp = () => {
    setCurrentMood(null);
    setIsActive(false);
    window.speechSynthesis.cancel();
    setView(AppView.MOOD_CHECKIN);
  };

  // Helper to set preset time
  const applyPreset = (totalSeconds: number) => {
    setInputMin(Math.floor(totalSeconds / 60));
    setInputSec(totalSeconds % 60);
  };

  // Views Renders
  const renderMoodCheckin = () => (
    <div className="flex flex-col items-center animate-fade-in px-4">
      <h1 className="text-3xl font-bold text-stone-800 mb-2 text-center drop-shadow-sm">{t.welcome}</h1>
      <p className="text-stone-600 mb-8 text-center font-medium">{t.selectMood}</p>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-5 w-full max-w-lg">
        {MOODS.map((m) => (
          <button
            key={m.id}
            onClick={() => handleMoodSelect(m)}
            className={`${m.bgColor} ${m.color} p-6 rounded-3xl transition-all hover:scale-105 active:scale-95 flex flex-col items-center shadow-sm hover:shadow-md border-2 border-white/50`}
          >
            <span className="text-5xl mb-3 filter drop-shadow-sm">{m.emoji}</span>
            <span className="font-bold text-lg">{m.label[lang]}</span>
          </button>
        ))}
      </div>

      <div className="mt-12 w-full max-w-lg">
        <button 
            onClick={() => setView(AppView.STATS)}
            className="w-full flex items-center justify-center space-x-2 text-stone-500 hover:text-pink-600 p-4 bg-white/60 border border-white rounded-2xl shadow-sm hover:bg-white transition-all"
        >
            <Calendar size={20} />
            <span className="font-medium">{t.statsBtn}</span>
        </button>
      </div>
    </div>
  );

  const renderWisdom = () => (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 animate-fade-in text-center max-w-2xl mx-auto">
      <div className="mb-8 p-8 bg-white/40 backdrop-blur-md rounded-3xl border border-white shadow-sm">
        <Sparkles className="w-12 h-12 text-amber-400 mx-auto mb-4" />
        {isLoadingGemini ? (
            <div className="animate-pulse space-y-3">
                <div className="h-4 bg-stone-200/50 rounded w-64 mx-auto"></div>
                <div className="h-4 bg-stone-200/50 rounded w-48 mx-auto"></div>
                <p className="text-stone-400 text-sm mt-4">{t.loading}</p>
            </div>
        ) : (
            <h2 className="text-2xl md:text-3xl font-medium text-stone-800 leading-relaxed">
             "{wisdomQuote}"
            </h2>
        )}
      </div>
      
      <div className="space-y-4 w-full max-w-md">
        <button
          onClick={startMeditationSetup}
          className="w-full bg-gradient-to-r from-rose-400 to-orange-400 hover:from-rose-500 hover:to-orange-500 text-white py-4 rounded-2xl font-bold shadow-lg shadow-rose-200 transition-all flex items-center justify-center space-x-2 transform hover:-translate-y-1"
        >
          <Sun size={20} />
          <span>{t.startMeditation}</span>
        </button>
        <button
          onClick={resetApp}
          className="w-full text-stone-500 hover:text-stone-700 py-2 font-medium"
        >
          {t.backHome}
        </button>
      </div>
    </div>
  );

  const renderSetup = () => (
    <div className="w-full max-w-lg mx-auto px-4 animate-slide-up">
      <button onClick={() => setView(AppView.WISDOM)} className="mb-6 text-stone-500 hover:text-pink-600 flex items-center font-medium">
        <ArrowLeft size={18} className="mr-1"/> {t.back}
      </button>

      <h2 className="text-2xl font-bold text-stone-800 mb-6">{t.setupTitle}</h2>
      
      {/* Duration */}
      <div className="mb-10">
        <label className="block text-stone-700 font-bold mb-3">{t.durationLabel}</label>
        
        {/* Presets */}
        <div className="grid grid-cols-5 gap-2 mb-4">
          {DURATION_PRESETS.map((seconds) => (
            <button
              key={seconds}
              onClick={() => applyPreset(seconds)}
              className={`py-2 rounded-xl text-sm font-bold transition-all ${
                config.durationSeconds === seconds
                  ? 'bg-pink-500 text-white shadow-md' 
                  : 'bg-white/60 text-stone-600 hover:bg-white border border-white'
              }`}
            >
              {seconds < 60 ? `${seconds}s` : `${seconds/60}m`}
            </button>
          ))}
        </div>

        {/* Inputs */}
        <div className="flex gap-4">
            <div className="relative w-1/2">
                <input 
                    type="number"
                    min="0"
                    max="120"
                    value={inputMin}
                    onChange={(e) => setInputMin(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full p-4 rounded-2xl bg-white/60 border border-white text-stone-700 text-center font-bold text-xl focus:outline-none focus:ring-2 focus:ring-pink-300"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 text-xs font-medium pointer-events-none">{t.mins}</span>
            </div>
            <div className="flex items-center text-stone-400 font-bold">:</div>
            <div className="relative w-1/2">
                <input 
                    type="number"
                    min="0"
                    max="59"
                    value={inputSec}
                    onChange={(e) => setInputSec(Math.min(59, Math.max(0, parseInt(e.target.value) || 0)))}
                    className="w-full p-4 rounded-2xl bg-white/60 border border-white text-stone-700 text-center font-bold text-xl focus:outline-none focus:ring-2 focus:ring-pink-300"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 text-xs font-medium pointer-events-none">{t.secs}</span>
            </div>
        </div>
      </div>

      <button
        onClick={startSession}
        className="w-full bg-gradient-to-r from-rose-400 to-orange-400 hover:from-rose-500 hover:to-orange-500 text-white py-4 rounded-2xl font-bold shadow-xl shadow-rose-200 text-lg flex justify-center items-center transform hover:-translate-y-1 transition-all"
      >
        <Play size={24} className="mr-2" fill="currentColor" />
        {t.startBtn}
      </button>
    </div>
  );

  const renderMeditation = () => {
    const mins = Math.floor(timeLeft / 60);
    const secs = timeLeft % 60;

    return (
      <div className="flex flex-col items-center w-full max-w-2xl mx-auto px-4 h-full">
        {/* Header */}
        <div className="w-full flex justify-between items-center mb-4">
             <button onClick={stopSession} className="text-stone-400 hover:text-red-400 font-medium">
                {t.exit}
             </button>
             {/* Sound indicator removed */}
        </div>

        {/* Visual Breathing */}
        <div className="flex-grow flex items-center justify-center mt-8 mb-8">
            <BreathingExercise isActive={isActive} lang={lang} />
        </div>

        {/* Timer & Controls */}
        <div className="mt-4 mb-12 flex flex-col items-center w-full">
          <div className="text-7xl font-extralight text-stone-700 font-mono mb-8 tracking-widest drop-shadow-sm">
            {mins.toString().padStart(2, '0')}:{secs.toString().padStart(2, '0')}
          </div>

          <button
            onClick={toggleTimer}
            className="w-24 h-24 bg-gradient-to-br from-stone-700 to-stone-900 text-white rounded-full flex items-center justify-center shadow-2xl shadow-stone-300 hover:scale-105 transition-all active:scale-95"
          >
            {isActive ? <Pause size={36} fill="currentColor" /> : <Play size={36} fill="currentColor" className="ml-1" />}
          </button>
        </div>
      </div>
    );
  };

  const renderSummary = () => (
    <div className="text-center px-6 animate-scale-in max-w-md mx-auto">
      <div className="w-24 h-24 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
        <CheckCircle size={48} />
      </div>
      <h2 className="text-3xl font-bold text-stone-800 mb-2">{t.greatJob}</h2>
      <p className="text-stone-600 mb-6 font-medium">{t.compliment}</p>
      
      {/* Healing Message Card */}
      <div className="bg-white/70 backdrop-blur-sm p-6 rounded-3xl shadow-sm border border-white mb-8">
        <div className="flex items-center justify-center gap-2 mb-3 text-rose-500">
            <Sparkles size={18} />
            <span className="text-sm font-bold uppercase tracking-wide">{t.healingMsgTitle}</span>
        </div>
        <p className="text-lg text-stone-700 leading-relaxed italic">
            "{postSessionMessage || (lang === 'th' ? "ขอให้ใจของคุณเบาสบายและเต็มไปด้วยความสุขในวันนี้" : "May your heart be light and filled with joy today.")}"
        </p>
      </div>

      <p className="text-stone-400 text-sm mb-8">{t.timeSpent(config.durationSeconds / 60)}</p>

      <div className="space-y-4">
        <button
          onClick={() => setView(AppView.STATS)}
          className="w-full bg-stone-800 text-white py-4 rounded-2xl font-bold shadow-lg hover:bg-stone-900 transition-colors"
        >
          {t.viewProgress}
        </button>
        <button
          onClick={resetApp}
          className="w-full text-stone-500 hover:text-stone-800 py-3 font-medium"
        >
          {t.backHome}
        </button>
      </div>
    </div>
  );

  const renderStats = () => (
      <div className="w-full max-w-2xl mx-auto px-4 animate-fade-in">
           <button onClick={resetApp} className="mb-6 text-stone-500 hover:text-pink-600 flex items-center font-medium">
            <ArrowLeft size={18} className="mr-1"/> {t.backHome}
          </button>
          <StatsChart sessions={sessions} lang={lang} />
      </div>
  )

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="p-6 flex justify-between items-center max-w-3xl mx-auto w-full">
        <div className="flex items-center space-x-2 text-pink-500">
            <Heart fill="currentColor" className="w-7 h-7" />
            <span className="font-bold text-2xl tracking-tight">Gentle Mind</span>
        </div>
        
        <div className="flex items-center space-x-3">
            <button 
                onClick={toggleLanguage}
                className="flex items-center space-x-1 px-4 py-2 rounded-full bg-white/70 backdrop-blur-sm text-stone-600 shadow-sm border border-white hover:bg-white transition-colors"
            >
                <Globe size={18} />
                <span className="text-sm font-bold">{lang === 'th' ? 'TH' : 'EN'}</span>
            </button>
            {view !== AppView.MOOD_CHECKIN && (
                <button onClick={resetApp} className="p-3 text-stone-400 hover:text-pink-600 bg-white/70 rounded-full shadow-sm border border-white hover:bg-white transition-colors">
                    <Home size={20} />
                </button>
            )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center py-6">
        {view === AppView.MOOD_CHECKIN && renderMoodCheckin()}
        {view === AppView.WISDOM && renderWisdom()}
        {view === AppView.SETUP && renderSetup()}
        {view === AppView.MEDITATION && renderMeditation()}
        {view === AppView.SUMMARY && renderSummary()}
        {view === AppView.STATS && renderStats()}
      </main>
      
      {/* Footer */}
      <footer className="py-6 text-center text-stone-400 text-sm font-medium">
        <p>{t.footer}</p>
      </footer>
    </div>
  );
};

export default App;