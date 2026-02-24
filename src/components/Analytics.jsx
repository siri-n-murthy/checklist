import React, { useMemo } from 'react';
import { TrendingUp, Target, Flame, BarChart3, Calendar } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function Analytics({ checklistData }) {
  const { isDark } = useTheme();
  const stats = useMemo(() => {
    const todayKey = new Date().toISOString().split('T')[0];
    const allDates = Object.keys(checklistData || {});
    
    const today = checklistData[todayKey] || {};
    const todayCompleted = Object.values(today).filter(v => v).length;
    const todayTotal = Object.keys(today).length || 0;
    
    // Calculate completions over time
    let totalCompleted = 0;
    let daysActive = 0;
    const lastSevenDays = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateKey = date.toISOString().split('T')[0];
      const dayData = checklistData[dateKey] || {};
      const completed = Object.values(dayData).filter(v => v).length;
      const total = Object.keys(dayData).length || 0;
      
      if (total > 0) {
        daysActive++;
        totalCompleted += completed;
        lastSevenDays.push({ date: dateKey.split('-')[2], completed, total, percentage: Math.round((completed / total) * 100) });
      }
    }
    
    const overallCompletion = lastSevenDays.length > 0
      ? Math.round((lastSevenDays.reduce((sum, d) => sum + d.percentage, 0) / lastSevenDays.length))
      : 0;
    
    // Current streak
    let currentStreak = 0;
    let checkDate = new Date();
    while (true) {
      const dateKey = checkDate.toISOString().split('T')[0];
      const dayData = checklistData[dateKey];
      if (!dayData || Object.keys(dayData).length === 0) break;
      
      const completed = Object.values(dayData).filter(v => v).length;
      const total = Object.keys(dayData).length;
      if (completed > 0) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
    
    return {
      todayCompleted,
      todayTotal,
      todayPercentage: todayTotal > 0 ? Math.round((todayCompleted / todayTotal) * 100) : 0,
      overallCompletion,
      daysActive,
      currentStreak,
      lastSevenDays,
      totalCheckIns: allDates.length
    };
  }, [checklistData]);

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Today's Progress */}
        <div className={`bg-gradient-to-br ${isDark ? 'from-indigo-900 to-indigo-800 border-indigo-700' : 'from-indigo-100 to-indigo-50 border-indigo-200'} rounded-lg p-6 border`}>
          <div className="flex items-center justify-between mb-2">
            <p className={`text-sm font-medium ${isDark ? 'text-indigo-200' : 'text-indigo-700'}`}>Today's Progress</p>
            <Target size={20} className={isDark ? 'text-indigo-300' : 'text-indigo-600'} />
          </div>
          <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{stats.todayPercentage}%</p>
          <p className={`text-sm mt-1 ${isDark ? 'text-indigo-300' : 'text-indigo-700'}`}>{stats.todayCompleted}/{stats.todayTotal} tasks</p>
        </div>

        {/* Current Streak */}
        <div className={`bg-gradient-to-br ${isDark ? 'from-orange-900 to-orange-800 border-orange-700' : 'from-orange-100 to-orange-50 border-orange-200'} rounded-lg p-6 border`}>
          <div className="flex items-center justify-between mb-2">
            <p className={`text-sm font-medium ${isDark ? 'text-orange-200' : 'text-orange-700'}`}>Current Streak</p>
            <Flame size={20} className={isDark ? 'text-orange-300' : 'text-orange-600'} />
          </div>
          <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{stats.currentStreak}</p>
          <p className={`text-sm mt-1 ${isDark ? 'text-orange-300' : 'text-orange-700'}`}>consecutive days</p>
        </div>

        {/* Overall Completion */}
        <div className={`bg-gradient-to-br ${isDark ? 'from-teal-900 to-teal-800 border-teal-700' : 'from-teal-100 to-teal-50 border-teal-200'} rounded-lg p-6 border`}>
          <div className="flex items-center justify-between mb-2">
            <p className={`text-sm font-medium ${isDark ? 'text-teal-200' : 'text-teal-700'}`}>Overall Completion</p>
            <TrendingUp size={20} className={isDark ? 'text-teal-300' : 'text-teal-600'} />
          </div>
          <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{stats.overallCompletion}%</p>
          <p className={`text-sm mt-1 ${isDark ? 'text-teal-300' : 'text-teal-700'}`}>Last 7 days</p>
        </div>

        {/* Days Active */}
        <div className={`bg-gradient-to-br ${isDark ? 'from-rose-900 to-rose-800 border-rose-700' : 'from-rose-100 to-rose-50 border-rose-200'} rounded-lg p-6 border`}>
          <div className="flex items-center justify-between mb-2">
            <p className={`text-sm font-medium ${isDark ? 'text-rose-200' : 'text-rose-700'}`}>Days Active</p>
            <Calendar size={20} className={isDark ? 'text-rose-300' : 'text-rose-600'} />
          </div>
          <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{stats.daysActive}</p>
          <p className={`text-sm mt-1 ${isDark ? 'text-rose-300' : 'text-rose-700'}`}>in last 7 days</p>
        </div>
      </div>

      {/* Weekly Chart */}
      <div className={`bg-gradient-to-br ${isDark ? 'from-slate-800 to-slate-900 border-slate-700' : 'from-slate-100 to-slate-50 border-slate-200'} rounded-lg p-6 border`}>
        <div className="flex items-center gap-2 mb-6">
          <BarChart3 size={24} className={isDark ? 'text-indigo-400' : 'text-indigo-600'} />
          <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Last 7 Days</h3>
        </div>

        <div className="flex items-end justify-between h-40 gap-2">
          {stats.lastSevenDays.length > 0 ? (
            stats.lastSevenDays.map((day, idx) => {
              const maxHeight = 160;
              const height = Math.max(20, (day.percentage / 100) * maxHeight);
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                  <div className="relative w-full flex items-end justify-center h-40">
                    <div
                      className={`w-full bg-gradient-to-t ${isDark ? 'from-indigo-500 to-indigo-400' : 'from-indigo-400 to-indigo-300'} rounded-t-lg transition-all hover:opacity-80 cursor-pointer group relative`}
                      style={{ height: `${height}px` }}
                    >
                      <div className={`absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition ${isDark ? 'bg-slate-700' : 'bg-slate-300'} px-2 py-1 rounded text-xs ${isDark ? 'text-white' : 'text-slate-900'} whitespace-nowrap z-10`}>
                        {day.percentage}%
                      </div>
                    </div>
                  </div>
                  <p className={`text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    {day.date}
                  </p>
                </div>
              );
            })
          ) : (
            <div className={`w-full flex items-center justify-center h-40 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              <p>No data yet. Start tracking your tasks!</p>
            </div>
          )}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-6 border border-slate-700">
        <h3 className="text-lg font-bold text-white mb-4">Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-700/50 rounded-lg p-4">
            <p className="text-slate-400 text-sm mb-1">Total Check-Ins</p>
            <p className="text-2xl font-bold text-cyan-400">{stats.totalCheckIns}</p>
          </div>
          <div className="bg-slate-700/50 rounded-lg p-4">
            <p className="text-slate-400 text-sm mb-1">Consistency</p>
            <p className="text-2xl font-bold text-emerald-400">
              {stats.daysActive > 0 ? Math.round((stats.daysActive / 7) * 100) : 0}%
            </p>
          </div>
          <div className="bg-slate-700/50 rounded-lg p-4">
            <p className="text-slate-400 text-sm mb-1">Avg Daily Completion</p>
            <p className="text-2xl font-bold text-orange-400">
              {stats.lastSevenDays.length > 0
                ? Math.round(stats.lastSevenDays.reduce((sum, d) => sum + d.completed, 0) / stats.lastSevenDays.length)
                : 0}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
