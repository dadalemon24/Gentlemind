import React from 'react';
import { SessionRecord, Language, Mood } from '../types';
import { TRANSLATIONS, MOODS } from '../constants';
import { CheckCircle } from 'lucide-react';

interface StatsChartProps {
  sessions: SessionRecord[];
  lang: Language;
}

const StatsChart: React.FC<StatsChartProps> = ({ sessions, lang }) => {
  const t = TRANSLATIONS[lang];
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  // Helper to get days in month
  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

  // Map sessions to dates and moods
  const dataByDate = sessions.reduce((acc, session) => {
    const dateStr = session.date.split('T')[0]; // YYYY-MM-DD
    if (!acc[dateStr]) {
        acc[dateStr] = { minutes: 0, mood: session.moodBefore };
    }
    acc[dateStr].minutes += session.durationMinutes;
    // Update mood to the latest session of the day
    acc[dateStr].mood = session.moodBefore;
    return acc;
  }, {} as Record<string, { minutes: number, mood: Mood }>);

  const totalMinutesAllTime = sessions.reduce((acc, curr) => acc + curr.durationMinutes, 0);
  const totalSessions = sessions.length;

  const renderCalendar = () => {
    const days = [];
    
    // Empty cells for days before the 1st
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-10 w-full"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const data = dataByDate[dateStr];
      const hasSession = !!data;
      
      let bgClass = 'bg-stone-100 text-stone-600 hover:bg-stone-200';
      let moodEmoji = null;

      if (hasSession) {
          const moodConfig = MOODS.find(m => m.id === data.mood);
          if (moodConfig) {
              bgClass = `${moodConfig.bgColor} ${moodConfig.color} shadow-md scale-110 font-bold`;
          } else {
              bgClass = 'bg-rose-400 text-white shadow-md shadow-rose-200 scale-110';
          }
      } else if (day === today.getDate()) {
          bgClass = 'border-2 border-rose-300 text-stone-600';
      }

      days.push(
        <div key={day} className="flex flex-col items-center justify-center h-12 w-full relative group">
          <div 
            className={`w-9 h-9 rounded-full flex items-center justify-center text-sm transition-all cursor-default ${bgClass}`}
            title={hasSession ? `${data.minutes.toFixed(0)} min` : ''}
          >
            {day}
          </div>
          {/* Dot indicator for duration if needed, currently color indicates presence */}
        </div>
      );
    }
    return days;
  };

  return (
    <div className="w-full bg-white/80 backdrop-blur-sm p-6 rounded-3xl shadow-sm border border-white">
      <h3 className="text-xl font-bold text-stone-700 mb-6 flex items-center gap-2">
         {t.statsTitle}
      </h3>
      
      {/* Stats Summary */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100">
          <p className="text-sm text-orange-600 font-bold mb-1">{t.totalTime}</p>
          <p className="text-2xl font-bold text-orange-800">{totalMinutesAllTime.toFixed(0)} <span className="text-xs font-normal text-orange-600">{t.mins}</span></p>
        </div>
        <div className="bg-pink-50 p-4 rounded-2xl border border-pink-100">
          <p className="text-sm text-pink-600 font-bold mb-1">{t.totalSessions}</p>
          <p className="text-2xl font-bold text-pink-800">{totalSessions} <span className="text-xs font-normal text-pink-600">{t.times}</span></p>
        </div>
      </div>

      {/* Calendar View */}
      <div className="bg-white/50 rounded-2xl p-4 border border-stone-100 mb-6">
          <div className="text-center font-bold text-stone-700 mb-4">
              {t.months[currentMonth]} {currentYear}
          </div>
          
          <div className="grid grid-cols-7 mb-2">
              {t.days.map((d: string) => (
                  <div key={d} className="text-center text-xs font-bold text-stone-400">{d}</div>
              ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
              {renderCalendar()}
          </div>
      </div>

      {/* Mood Legend */}
      <div className="mt-6 pt-4 border-t border-stone-100">
        <p className="text-xs font-bold text-stone-400 uppercase tracking-wide mb-3 text-center">Mood Legend</p>
        <div className="flex flex-wrap justify-center gap-3">
            {MOODS.map(m => (
                <div key={m.id} className="flex items-center space-x-1">
                    <div className={`w-3 h-3 rounded-full ${m.bgColor}`}></div>
                    <span className={`text-xs ${m.color} font-medium`}>{m.label[lang]}</span>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default StatsChart;