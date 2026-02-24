import React, { useMemo } from 'react';
import { Trophy, Flame, Target, Zap, Star, Award } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function Achievements({ checklistData, tasks, currentStreak, userProfile }) {
  const { isDark } = useTheme();
  const achievements = useMemo(() => {
    const allAchievements = [
      {
        id: 'first-task',
        name: 'Getting Started',
        description: 'Create your first task',
        icon: <Star size={32} className="text-yellow-400" />,
        unlocked: tasks.length > 0,
        rarity: 'common'
      },
      {
        id: 'first-day',
        name: 'Day One',
        description: 'Complete 1 task in a day',
        icon: <Zap size={32} className="text-yellow-400" />,
        unlocked: Object.keys(checklistData).length > 0,
        rarity: 'common'
      },
      {
        id: 'three-day-streak',
        name: '3-Day Streak',
        description: 'Complete tasks for 3 days in a row',
        icon: <Flame size={32} className="text-orange-400" />,
        unlocked: currentStreak >= 3,
        rarity: 'uncommon'
      },
      {
        id: 'week-streak',
        name: 'Week Warrior',
        description: 'Achieve a 7-day streak',
        icon: <Flame size={32} className="text-orange-500" />,
        unlocked: currentStreak >= 7,
        rarity: 'uncommon'
      },
      {
        id: 'perfect-week',
        name: 'Perfect Week',
        description: 'Complete 100% of tasks all 7 days',
        icon: <Trophy size={32} className="text-yellow-500" />,
        unlocked: calculatePerfectWeeks() >= 1,
        rarity: 'rare'
      },
      {
        id: 'analytics-pro',
        name: 'Analytics Pro',
        description: 'Check the analytics section 5 times',
        icon: <Target size={32} className="text-cyan-400" />,
        unlocked: Object.keys(checklistData).length >= 5,
        rarity: 'uncommon'
      },
      {
        id: 'profile-master',
        name: 'Profile Complete',
        description: 'Fill in all profile information',
        icon: <Award size={32} className="text-purple-400" />,
        unlocked: userProfile?.name && userProfile?.email && userProfile?.location && userProfile?.title && userProfile?.bio,
        rarity: 'uncommon'
      },
      {
        id: 'task-master',
        name: 'Task Master',
        description: 'Create 10 different tasks',
        icon: <Star size={32} className="text-blue-400" />,
        unlocked: tasks.length >= 10,
        rarity: 'rare'
      },
      {
        id: 'fifty-days',
        name: 'Committed',
        description: 'Track on 50 different days',
        icon: <Flame size={32} className="text-red-500" />,
        unlocked: Object.keys(checklistData).length >= 50,
        rarity: 'epic'
      },
      {
        id: 'hundred-days',
        name: 'Legendary',
        description: 'Track on 100 different days',
        icon: <Trophy size={32} className="text-yellow-500" />,
        unlocked: Object.keys(checklistData).length >= 100,
        rarity: 'legendary'
      }
    ];

    return allAchievements;
  }, [checklistData, tasks, currentStreak, userProfile]);

  function calculatePerfectWeeks() {
    const today = new Date();
    let perfectWeeks = 0;

    for (let week = 0; week < 12; week++) {
      const weekStart = new Date(today);
      weekStart.setDate(weekStart.getDate() - weekStart.getDay() - (week * 7));
      
      let weekPerfect = true;
      for (let i = 0; i < 7; i++) {
        const date = new Date(weekStart);
        date.setDate(date.getDate() + i);
        const dateKey = date.toISOString().split('T')[0];
        const dayData = checklistData[dateKey];
        
        if (dayData && Object.keys(dayData).length > 0) {
          const completed = Object.values(dayData).filter(v => v).length;
          const total = Object.keys(dayData).length;
          if (completed !== total) {
            weekPerfect = false;
            break;
          }
        }
      }
      
      if (weekPerfect) perfectWeeks++;
    }

    return perfectWeeks;
  }

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const rarityColors = {
    common: isDark ? 'from-gray-600 to-gray-700' : 'from-gray-400 to-gray-500',
    uncommon: isDark ? 'from-teal-600 to-teal-700' : 'from-teal-500 to-teal-600',
    rare: isDark ? 'from-indigo-600 to-indigo-700' : 'from-indigo-500 to-indigo-600',
    epic: isDark ? 'from-purple-600 to-purple-700' : 'from-purple-500 to-purple-600',
    legendary: isDark ? 'from-orange-500 to-orange-600' : 'from-orange-400 to-orange-500'
  };

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className={`bg-gradient-to-r ${isDark ? 'from-slate-800 to-slate-900 border-slate-700' : 'from-slate-100 to-slate-50 border-slate-200'} rounded-lg p-6 border`}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className={`text-2xl font-bold flex items-center gap-2 mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              <Trophy size={28} className={isDark ? 'text-yellow-400' : 'text-orange-500'} />
              Achievements
            </h2>
            <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
              {unlockedCount} of {achievements.length} unlocked
            </p>
          </div>
          <div className="text-right">
            <p className={`text-4xl font-bold ${isDark ? 'text-orange-400' : 'text-orange-500'}`}>{unlockedCount}</p>
            <p className={isDark ? 'text-slate-400 text-sm' : 'text-slate-600 text-sm'}>Badges Earned</p>
          </div>
        </div>
        <div className={`mt-4 w-full h-2 rounded-full overflow-hidden ${isDark ? 'bg-slate-700' : 'bg-slate-300'}`}>
          <div
            className={`h-full bg-gradient-to-r ${isDark ? 'from-orange-500 to-orange-400' : 'from-orange-400 to-orange-300'} transition-all`}
            style={{ width: `${(unlockedCount / achievements.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {achievements.map(achievement => (
          <div
            key={achievement.id}
            className={`rounded-lg p-6 border transition transform hover:scale-105 ${
              achievement.unlocked
                ? `bg-gradient-to-br ${rarityColors[achievement.rarity]} ${isDark ? 'border-orange-400/50 shadow-lg shadow-orange-500/20' : 'border-orange-300/50 shadow-lg shadow-orange-400/20'}`
                : isDark ? 'bg-slate-700/30 border-slate-600 opacity-60' : 'bg-slate-200/30 border-slate-300 opacity-60'
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="text-3xl">{achievement.icon}</div>
              {achievement.unlocked && (
                <div className="text-xl">✨</div>
              )}
            </div>

            <h3 className={`text-lg font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>{achievement.name}</h3>
            <p className={`text-sm mb-3 ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>{achievement.description}</p>

            <div className="flex items-center justify-between">
              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                achievement.rarity === 'common'
                  ? isDark ? 'bg-gray-600/50 text-gray-100' : 'bg-gray-400/50 text-gray-900'
                  : achievement.rarity === 'uncommon'
                  ? isDark ? 'bg-teal-600/50 text-teal-100' : 'bg-teal-400/50 text-teal-900'
                  : achievement.rarity === 'rare'
                  ? isDark ? 'bg-indigo-600/50 text-indigo-100' : 'bg-indigo-400/50 text-indigo-900'
                  : achievement.rarity === 'epic'
                  ? isDark ? 'bg-purple-600/50 text-purple-100' : 'bg-purple-400/50 text-purple-900'
                  : isDark ? 'bg-orange-600/50 text-orange-100' : 'bg-orange-400/50 text-orange-900'
              }`}>
                {achievement.rarity.toUpperCase()}
              </span>
              {achievement.unlocked && (
                <span className="text-sm font-bold text-green-300">UNLOCKED</span>
              )}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
