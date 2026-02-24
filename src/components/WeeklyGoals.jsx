import React, { useState } from 'react';
import { Target, Edit2, X, Save, Plus } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function WeeklyGoals({ weeklyGoals, onUpdateGoals }) {
  const { isDark } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [goals, setGoals] = useState(weeklyGoals || {
    targetCompletion: 80,
    tasksPerDay: 5,
    streakTargetDays: 7,
    notes: ''
  });

  const handleChange = (field, value) => {
    setGoals(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onUpdateGoals(goals);
    setIsEditing(false);
  };

  const calculateGoalProgress = (current, target) => {
    return Math.min(100, Math.round((current / target) * 100));
  };

  if (isEditing) {
    return (
      <div className={`bg-gradient-to-br ${isDark ? 'from-slate-800 to-slate-900 border-slate-700' : 'from-slate-100 to-slate-50 border-slate-200'} rounded-lg p-6 border`}>
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-2xl font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            <Target size={28} className={isDark ? 'text-orange-400' : 'text-orange-500'} />
            Edit Weekly Goals
          </h2>
          <button
            onClick={() => setIsEditing(false)}
            className={`p-2 rounded-lg transition ${isDark ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-300 text-slate-600'}`}
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Target Completion % (for the week)
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="0"
                max="100"
                value={goals.targetCompletion}
                onChange={(e) => handleChange('targetCompletion', parseInt(e.target.value))}
                className="flex-1"
              />
              <input
                type="number"
                min="0"
                max="100"
                value={goals.targetCompletion}
                onChange={(e) => handleChange('targetCompletion', parseInt(e.target.value))}
                className={`w-16 px-2 py-1 rounded-lg text-white focus:outline-none ${isDark ? 'bg-slate-700 border border-slate-600 focus:border-indigo-400' : 'bg-white border border-slate-300 text-slate-900 focus:border-indigo-400'}`}
              />
              <span className={`font-semibold ${isDark ? 'text-orange-400' : 'text-orange-500'}`}>%</span>
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Tasks Per Day Target
            </label>
            <input
              type="number"
              min="1"
              value={goals.tasksPerDay}
              onChange={(e) => handleChange('tasksPerDay', parseInt(e.target.value))}
              className={`w-full px-4 py-2 rounded-lg focus:outline-none ${isDark ? 'bg-slate-700 border border-slate-600 text-white placeholder-slate-400 focus:border-indigo-400' : 'bg-white border border-slate-300 text-slate-900 placeholder-slate-500 focus:border-indigo-400'}`}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Streak Target (days)
            </label>
            <input
              type="number"
              min="1"
              value={goals.streakTargetDays}
              onChange={(e) => handleChange('streakTargetDays', parseInt(e.target.value))}
              className={`w-full px-4 py-2 rounded-lg focus:outline-none ${isDark ? 'bg-slate-700 border border-slate-600 text-white placeholder-slate-400 focus:border-indigo-400' : 'bg-white border border-slate-300 text-slate-900 placeholder-slate-500 focus:border-indigo-400'}`}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Weekly Notes
            </label>
            <textarea
              value={goals.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              rows="3"
              className={`w-full px-4 py-2 rounded-lg focus:outline-none ${isDark ? 'bg-slate-700 border border-slate-600 text-white placeholder-slate-400 focus:border-indigo-400' : 'bg-white border border-slate-300 text-slate-900 placeholder-slate-500 focus:border-indigo-400'}`}
              placeholder="What are you focusing on this week?"
            />
          </div>

          <button
            onClick={handleSave}
            className={`w-full font-semibold py-2 rounded-lg transition flex items-center justify-center gap-2 ${isDark ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'bg-indigo-500 hover:bg-indigo-600 text-white'}`}
          >
            <Save size={18} />
            Save Goals
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className={`bg-gradient-to-br ${isDark ? 'from-slate-800 to-slate-900 border-slate-700' : 'from-slate-100 to-slate-50 border-slate-200'} rounded-lg p-6 border`}>
        <div className="flex items-start justify-between mb-6">
          <h2 className={`text-2xl font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            <Target size={28} className={isDark ? 'text-orange-400' : 'text-orange-500'} />
            Weekly Goals
          </h2>
          <button
            onClick={() => setIsEditing(true)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition border ${isDark ? 'bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-400 border-indigo-400/30' : 'bg-indigo-100 hover:bg-indigo-200 text-indigo-700 border-indigo-400/30'}`}
          >
            <Edit2 size={18} />
            Edit
          </button>
        </div>

        <div className="space-y-4">
          {/* Target Completion */}
          <div className={isDark ? 'bg-slate-700/50' : 'bg-slate-200/30'} style={{ borderRadius: '0.5rem', padding: '1rem' }}>
            <div className="flex items-center justify-between mb-2">
              <p className={isDark ? 'text-slate-300' : 'text-slate-700'}>Target Completion</p>
              <p className={`text-2xl font-bold ${isDark ? 'text-orange-400' : 'text-orange-500'}`}>{goals.targetCompletion}%</p>
            </div>
            <div className={`w-full rounded-full h-2 overflow-hidden ${isDark ? 'bg-slate-600' : 'bg-slate-400'}`}>
              <div 
                className={`h-full bg-gradient-to-r ${isDark ? 'from-orange-500 to-orange-400' : 'from-orange-400 to-orange-300'} rounded-full transition-all`}
                style={{ width: `${goals.targetCompletion}%` }}
              />
            </div>
          </div>

          {/* Tasks Per Day */}
          <div className={isDark ? 'bg-slate-700/50' : 'bg-slate-200/30'} style={{ borderRadius: '0.5rem', padding: '1rem' }}>
            <div className="flex items-center justify-between mb-2">
              <p className={isDark ? 'text-slate-300' : 'text-slate-700'}>Daily Task Target</p>
              <div className="flex items-center gap-2">
                <span className={`text-2xl font-bold ${isDark ? 'text-teal-400' : 'text-teal-600'}`}>{goals.tasksPerDay}</span>
                <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>tasks/day</span>
              </div>
            </div>
          </div>

          {/* Streak Target */}
          <div className={isDark ? 'bg-slate-700/50' : 'bg-slate-200/30'} style={{ borderRadius: '0.5rem', padding: '1rem' }}>
            <div className="flex items-center justify-between mb-2">
              <p className={isDark ? 'text-slate-300' : 'text-slate-700'}>Streak Target</p>
              <div className="flex items-center gap-2">
                <span className={`text-2xl font-bold ${isDark ? 'text-rose-400' : 'text-rose-600'}`}>{goals.streakTargetDays}</span>
                <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>days</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {goals.notes && (
            <div className={`rounded-lg p-4 border-l-4 ${isDark ? 'bg-slate-700/50 border-orange-400' : 'bg-slate-200/30 border-orange-500'}`}>
              <p className={`text-sm mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>This Week's Focus</p>
              <p className={isDark ? 'text-white' : 'text-slate-900'}>{goals.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
