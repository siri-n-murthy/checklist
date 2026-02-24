import React, { useState, useEffect } from 'react';
import { CheckCircle2, Circle, Plus, X, Edit2, Trash2, ListTodo, BarChart3, User, Calendar, Trophy, Target, LogOut, Moon, Sun } from 'lucide-react';
import UserProfile from './UserProfile';
import Analytics from './Analytics';
import WeeklyGoals from './WeeklyGoals';
import CalendarView from './CalendarView';
import Achievements from './Achievements';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const ICON_OPTIONS = [
  { name: 'Book', emoji: '📚' },
  { name: 'Activity', emoji: '🏃' },
  { name: 'Code', emoji: '💻' },
  { name: 'Trophy', emoji: '🏆' },
  { name: 'Water', emoji: '💧' },
  { name: 'Moon', emoji: '🌙' },
  { name: 'Star', emoji: '⭐' },
  { name: 'Heart', emoji: '❤️' },
];

const COLORS = [
  { name: 'indigo', border: 'border-indigo-400', bg: 'bg-indigo-900/20', light: 'text-indigo-300' },
  { name: 'teal', border: 'border-teal-400', bg: 'bg-teal-900/20', light: 'text-teal-300' },
  { name: 'purple', border: 'border-purple-400', bg: 'bg-purple-900/20', light: 'text-purple-300' },
  { name: 'rose', border: 'border-rose-400', bg: 'bg-rose-900/20', light: 'text-rose-300' },
  { name: 'orange', border: 'border-orange-400', bg: 'bg-orange-900/20', light: 'text-orange-300' },
  { name: 'emerald', border: 'border-emerald-400', bg: 'bg-emerald-900/20', light: 'text-emerald-300' },
];

const MOTIVATION_QUOTES = [
  "✨ Small progress is still progress. Keep going!",
  "🚀 Every completed task is a step towards your goals.",
  "💪 You're stronger than you think. Believe in yourself!",
  "🌟 Consistency is the key to success. Don't give up!",
  "🎯 Focus on what matters today, tomorrow will take care of itself.",
  "⭐ Your effort today shapes your tomorrow. Make it count!",
  "🔥 You've got this! One task at a time.",
  "💎 Excellence is born from small daily habits.",
  "🏆 Every champion was once a beginner. Keep pushing!",
  "🌈 Celebrate your wins, no matter how small.",
  "⚡ The only way to do great work is to love what you do.",
  "🌱 Growth happens outside your comfort zone.",
  "💫 Be the energy you want to attract.",
  "🎨 Your journey is unique. Own it with pride.",
  "🚀 Dream big. Work hard. Stay focused. Succeed."
];

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('checklist');
  const [data, setData] = useState(() => {
    const saved = localStorage.getItem('dashboardData');
    return saved ? JSON.parse(saved) : {};
  });

  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('checklistTasks');
    return saved ? JSON.parse(saved) : [];
  });

  const [userProfile, setUserProfile] = useState(() => {
    const saved = localStorage.getItem('userProfile');
    return saved ? JSON.parse(saved) : {};
  });

  const [showAddTask, setShowAddTask] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', color: 'blue', icon: 'Star', recurring: 'none' });
  const [editingTask, setEditingTask] = useState(null);
  const [dailyQuote, setDailyQuote] = useState('');
  const [weeklyGoals, setWeeklyGoals] = useState(() => {
    const saved = localStorage.getItem('weeklyGoals');
    return saved ? JSON.parse(saved) : { targetCompletion: 80, tasksPerDay: 5, streakTargetDays: 7, notes: '' };
  });

  // Save data on changes
  useEffect(() => {
    localStorage.setItem('dashboardData', JSON.stringify(data));
  }, [data]);

  useEffect(() => {
    localStorage.setItem('checklistTasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('userProfile', JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem('weeklyGoals', JSON.stringify(weeklyGoals));
  }, [weeklyGoals]);

  // Set daily motivation quote - Random on each login
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * MOTIVATION_QUOTES.length);
    setDailyQuote(MOTIVATION_QUOTES[randomIndex]);
  }, []);

  // Apply recurring tasks for today
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const todayData = data[today] || {};
    
    let needsUpdate = false;
    const recurringTasks = tasks.filter(t => t.recurring && t.recurring !== 'none');
    
    recurringTasks.forEach(task => {
      if (!todayData[task.id]) {
        needsUpdate = true;
      }
    });

    if (needsUpdate && recurringTasks.length > 0) {
      setData(prev => {
        const updated = { ...prev };
        recurringTasks.forEach(task => {
          if (!updated[today]?.[task.id]) {
            updated[today] = { ...updated[today], [task.id]: false };
          }
        });
        return updated;
      });
    }
  }, [tasks]);

  const today = new Date().toISOString().split('T')[0];
  const todayData = data[today] || {};

  const toggleTask = (taskId) => {
    setData(prev => ({
      ...prev,
      [today]: {
        ...prev[today],
        [taskId]: !prev[today]?.[taskId]
      }
    }));
  };

  const handleAddTask = () => {
    if (newTask.title.trim()) {
      const taskId = Date.now().toString();
      const task = {
        id: taskId,
        title: newTask.title,
        color: newTask.color,
        icon: newTask.icon,
        recurring: newTask.recurring || 'none',
        createdAt: new Date().toISOString()
      };
      setTasks([...tasks, task]);
      
      // If recurring, add to today
      if (task.recurring !== 'none') {
        const today = new Date().toISOString().split('T')[0];
        setData(prev => ({
          ...prev,
          [today]: { ...prev[today], [taskId]: false }
        }));
      }
      
      setNewTask({ title: '', color: 'blue', icon: 'Star', recurring: 'none' });
      setShowAddTask(false);
    }
  };

  const handleDeleteTask = (taskId) => {
    setTasks(tasks.filter(t => t.id !== taskId));
    // Remove from all dates
    setData(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(date => {
        if (updated[date][taskId]) {
          delete updated[date][taskId];
        }
      });
      return updated;
    });
  };

  const handleUpdateProfile = (profile) => {
    setUserProfile(profile);
  };

  const getColorClass = (colorName) => {
    return COLORS.find(c => c.name === colorName) || COLORS[0];
  };

  const getEmoji = (iconName) => {
    return ICON_OPTIONS.find(i => i.name === iconName)?.emoji || '⭐';
  };

  const calculateCurrentStreak = () => {
    let currentStreak = 0;
    let checkDate = new Date();
    while (true) {
      const dateKey = checkDate.toISOString().split('T')[0];
      const dayData = data[dateKey];
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
    return currentStreak;
  };

  const calculateOverallCompletion = () => {
    const allDates = Object.keys(data || {});
    const lastSevenDays = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateKey = date.toISOString().split('T')[0];
      const dayData = data[dateKey] || {};
      const completed = Object.values(dayData).filter(v => v).length;
      const total = Object.keys(dayData).length || 0;
      
      if (total > 0) {
        lastSevenDays.push(Math.round((completed / total) * 100));
      }
    }
    
    return lastSevenDays.length > 0 ? Math.round(lastSevenDays.reduce((a, b) => a + b) / lastSevenDays.length) : 0;
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800' : 'bg-gradient-to-br from-slate-50 via-white to-slate-100'}`}>
      {/* Header */}
      <header className={`${isDark ? 'bg-slate-900/80 border-slate-700' : 'bg-white/80 border-slate-200'} backdrop-blur border-b sticky top-0 z-50`}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'} flex items-center gap-3`}>
                <div className={`w-10 h-10 ${isDark ? 'bg-gradient-to-br from-indigo-500 to-teal-500' : 'bg-gradient-to-br from-indigo-500 to-teal-500'} rounded-lg flex items-center justify-center`}>
                  <ListTodo size={24} className={isDark ? 'text-slate-900' : 'text-white'} />
                </div>
                Dashboard
              </h1>
              <p className={`${isDark ? 'text-slate-400' : 'text-slate-600'} mt-1`}>Welcome, {user?.name || 'User'}! 👋</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg transition ${isDark ? 'bg-slate-800 hover:bg-slate-700 text-indigo-400' : 'bg-slate-100 hover:bg-slate-200 text-indigo-600'}`}
                title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <button
                onClick={logout}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition ${isDark ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-red-500 hover:bg-red-600 text-white'}`}
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {[
              { id: 'checklist', label: 'Checklist', icon: ListTodo },
              { id: 'goals', label: 'Goals', icon: Target },
              { id: 'calendar', label: 'Calendar', icon: Calendar },
              { id: 'profile', label: 'Profile', icon: User },
              { id: 'analytics', label: 'Analytics', icon: BarChart3 },
              { id: 'achievements', label: 'Achievements', icon: Trophy }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition whitespace-nowrap ${
                    activeTab === tab.id
                      ? isDark ? 'bg-indigo-600 text-white' : 'bg-indigo-500 text-white'
                      : isDark ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                  }`}
                >
                  <Icon size={18} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Daily Motivation Banner */}
        <div className={`mb-6 p-3 rounded-lg text-center text-sm font-medium italic ${isDark ? 'bg-slate-800/50 text-slate-300' : 'bg-slate-100/50 text-slate-700'}`}>
          {dailyQuote}
        </div>

        {/* Checklist Tab */}
        {activeTab === 'checklist' && (
          <div className="space-y-6">
            {/* Date Display */}
            <div className={`${isDark ? 'bg-gradient-to-r from-indigo-500/20 to-teal-500/20 border-indigo-400/30' : 'bg-gradient-to-r from-indigo-100/50 to-teal-100/50 border-indigo-200/50'} border rounded-lg p-6`}>
              <p className={`${isDark ? 'text-indigo-300' : 'text-indigo-700'} text-sm font-medium mb-2`}>TODAY</p>
              <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
              <p className={`${isDark ? 'text-slate-400' : 'text-slate-600'} mt-2`}>
                {Object.values(todayData).filter(v => v).length}/{tasks.length} tasks completed
              </p>
            </div>

            {/* Tasks List */}
            <div className="grid gap-3">
              {tasks.length > 0 ? (
                tasks.map(task => {
                  const isCompleted = todayData[task.id];
                  const colorClass = getColorClass(task.color);
                  return (
                    <div
                      key={task.id}
                      className={`flex items-center gap-4 p-4 rounded-lg border transition cursor-pointer group ${
                        colorClass.bg
                      } ${colorClass.border} border-l-4 hover:shadow-lg hover:scale-102`}
                      onClick={() => toggleTask(task.id)}
                    >
                      <div className="flex-shrink-0 text-2xl">
                        {isCompleted ? '✅' : '📍'}
                      </div>
                      <div className="flex-grow">
                        <p className={`font-semibold transition ${isCompleted ? (isDark ? 'text-slate-500 line-through' : 'text-slate-400 line-through') : (isDark ? 'text-white' : 'text-slate-900')}`}>
                          {task.title}
                          {task.recurring && task.recurring !== 'none' && (
                            <span className={`ml-2 text-xs px-2 py-1 rounded-full ${isDark ? 'bg-indigo-500/30 text-indigo-300' : 'bg-indigo-100 text-indigo-700'}`}>
                              🔄 {task.recurring}
                            </span>
                          )}
                        </p>
                        <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                          Created {new Date(task.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteTask(task.id);
                        }}
                        className={`p-2 ${isDark ? 'text-slate-400 hover:text-red-400 hover:bg-red-900/20' : 'text-slate-500 hover:text-red-600 hover:bg-red-100'} rounded-lg transition opacity-0 group-hover:opacity-100`}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  );
                })
              ) : (
                <div className={`text-center py-12 ${isDark ? 'bg-slate-700/30 border-slate-600' : 'bg-slate-100/30 border-slate-300'} border dashed rounded-lg`}>
                  <p className={`${isDark ? 'text-slate-400' : 'text-slate-600'} mb-4`}>No tasks yet. Create one to get started!</p>
                </div>
              )}
            </div>

            {/* Add Task Button */}
            {!showAddTask ? (
              <button
                onClick={() => setShowAddTask(true)}
                className={`w-full flex items-center justify-center gap-2 p-3 font-semibold rounded-lg transition border-2 ${isDark ? 'bg-indigo-600 hover:bg-indigo-700 text-white border-indigo-500' : 'bg-indigo-500 hover:bg-indigo-600 text-white border-indigo-400'}`}
              >
                <Plus size={20} />
                Add New Task
              </button>
            ) : (
              /* Add Task Form */
              <div className={`${isDark ? 'bg-slate-700 border-slate-600' : 'bg-slate-100 border-slate-300'} border rounded-lg p-6 space-y-4`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Add New Task</h3>
                  <button onClick={() => setShowAddTask(false)} className={`${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}>
                    <X size={20} />
                  </button>
                </div>

                <input
                  type="text"
                  placeholder="Task title"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className={`w-full px-4 py-2 rounded-lg focus:outline-none transition ${isDark ? 'bg-slate-600 border border-slate-500 text-white placeholder-slate-400 focus:border-indigo-400' : 'bg-white border border-slate-300 text-slate-900 placeholder-slate-500 focus:border-indigo-400'}`}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
                />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`text-sm block mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Icon</label>
                    <select
                      value={newTask.icon}
                      onChange={(e) => setNewTask({ ...newTask, icon: e.target.value })}
                      className={`w-full px-3 py-2 rounded-lg focus:outline-none transition ${isDark ? 'bg-slate-600 border border-slate-500 text-white focus:border-indigo-400' : 'bg-white border border-slate-300 text-slate-900 focus:border-indigo-400'}`}
                    >
                      {ICON_OPTIONS.map(icon => (
                        <option key={icon.name} value={icon.name}>{icon.emoji} {icon.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={`text-sm block mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Color</label>
                    <select
                      value={newTask.color}
                      onChange={(e) => setNewTask({ ...newTask, color: e.target.value })}
                      className={`w-full px-3 py-2 rounded-lg focus:outline-none transition ${isDark ? 'bg-slate-600 border border-slate-500 text-white focus:border-indigo-400' : 'bg-white border border-slate-300 text-slate-900 focus:border-indigo-400'}`}
                    >
                      {COLORS.map(color => (
                        <option key={color.name} value={color.name}>{color.name.charAt(0).toUpperCase() + color.name.slice(1)}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className={`text-sm block mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Recurring</label>
                  <select
                    value={newTask.recurring || 'none'}
                    onChange={(e) => setNewTask({ ...newTask, recurring: e.target.value })}
                    className={`w-full px-3 py-2 rounded-lg focus:outline-none transition ${isDark ? 'bg-slate-600 border border-slate-500 text-white focus:border-indigo-400' : 'bg-white border border-slate-300 text-slate-900 focus:border-indigo-400'}`}
                  >
                    <option value="none">No Recurrence</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleAddTask}
                    className={`flex-1 font-semibold py-2 rounded-lg transition ${isDark ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'bg-indigo-500 hover:bg-indigo-600 text-white'}`}
                  >
                    Create Task
                  </button>
                  <button
                    onClick={() => {
                      setShowAddTask(false);
                      setNewTask({ title: '', color: 'indigo', icon: 'Star', recurring: 'none' });
                    }}
                    className={`flex-1 font-semibold py-2 rounded-lg transition ${isDark ? 'bg-slate-600 hover:bg-slate-500 text-white' : 'bg-slate-300 hover:bg-slate-400 text-slate-900'}`}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <UserProfile userProfile={userProfile} onUpdateProfile={handleUpdateProfile} />
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <Analytics checklistData={data} />
        )}

        {/* Weekly Goals Tab */}
        {activeTab === 'goals' && (
          <WeeklyGoals weeklyGoals={weeklyGoals} onUpdateGoals={setWeeklyGoals} />
        )}

        {/* Calendar View Tab */}
        {activeTab === 'calendar' && (
          <CalendarView checklistData={data} onUpdateData={setData} tasks={tasks} />
        )}

        {/* Achievements Tab */}
        {activeTab === 'achievements' && (
          <Achievements 
            checklistData={data} 
            tasks={tasks}
            currentStreak={calculateCurrentStreak()}
            userProfile={userProfile}
          />
        )}
      </main>
    </div>
  );
}
