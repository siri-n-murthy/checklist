import React, { useState, useEffect } from 'react';
import { CheckCircle2, Circle, Flame, Droplets, BookOpen, Code, Activity, Moon, Trophy, Download, Share2, Plus, X, Edit2, Trash2 } from 'lucide-react';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// No default tasks - user adds them manually
const DEFAULT_TASKS = [];

const ICON_OPTIONS = [
  { name: 'BookOpen', icon: <BookOpen size={18} /> },
  { name: 'Activity', icon: <Activity size={18} /> },
  { name: 'Code', icon: <Code size={18} /> },
  { name: 'Trophy', icon: <Trophy size={18} /> },
  { name: 'Droplets', icon: <Droplets size={18} /> },
  { name: 'Moon', icon: <Moon size={18} /> },
];

const COLORS = [
  { name: 'blue', border: 'border-blue-400', bg: 'bg-blue-900/20' },
  { name: 'green', border: 'border-green-400', bg: 'bg-green-900/20' },
  { name: 'yellow', border: 'border-yellow-400', bg: 'bg-yellow-900/20' },
  { name: 'purple', border: 'border-purple-400', bg: 'bg-purple-900/20' },
  { name: 'red', border: 'border-red-400', bg: 'bg-red-900/20' },
  { name: 'cyan', border: 'border-cyan-400', bg: 'bg-cyan-900/20' },
  { name: 'indigo', border: 'border-indigo-400', bg: 'bg-indigo-900/20' },
  { name: 'pink', border: 'border-pink-400', bg: 'bg-pink-900/20' },
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

const getIconComponent = (iconName) => {
  const iconMap = {
    BookOpen: <BookOpen size={18} />,
    Activity: <Activity size={18} />,
    Code: <Code size={18} />,
    Trophy: <Trophy size={18} />,
    Droplets: <Droplets size={18} />,
    Moon: <Moon size={18} />,
  };
  return iconMap[iconName] || <Trophy size={18} />;
};

export default function ChecklistApp() {
  const [data, setData] = useState(() => {
    const saved = localStorage.getItem('checklistData');
    return saved ? JSON.parse(saved) : {};
  });

  const [tasks, setTasks] = useState(() => {
    // Start with empty tasks, ignoring any saved ones
    localStorage.removeItem('customTasks');
    return [];
  });

  const [activeDay, setActiveDay] = useState(DAYS[new Date().getDay()]);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [installable, setInstallable] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [dailyQuote, setDailyQuote] = useState('');
  const [formData, setFormData] = useState({ label: '', icon: 'Trophy', color: 'blue', category: 'Code', schedule: 'Daily', customDate: '' });

  // PWA Install prompt handler
  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  // Set daily motivation quote
  useEffect(() => {
    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 86400000);
    const quoteIndex = dayOfYear % MOTIVATION_QUOTES.length;
    setDailyQuote(MOTIVATION_QUOTES[quoteIndex]);
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
        setInstallable(false);
      }
    }
  };

  // Persist data to localStorage
  useEffect(() => {
    localStorage.setItem('checklistData', JSON.stringify(data));
  }, [data]);

  // Persist tasks to localStorage
  useEffect(() => {
    localStorage.setItem('customTasks', JSON.stringify(tasks));
  }, [tasks]);

  const toggleTask = (day, taskId) => {
    const key = `${day}-${taskId}`;
    setData(prev => ({ ...prev, [key]: !prev[key] }));
    // Haptic feedback simulation
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }
  };

  const handleAddTask = () => {
    if (!formData.label.trim()) return;
    
    const colorObj = COLORS.find(c => c.name === formData.color);
    
    if (editingTask) {
      // Edit existing task
      setTasks(tasks.map(t => 
        t.id === editingTask.id 
          ? { 
              ...t, 
              label: formData.label, 
              icon: formData.icon,
              color: colorObj.border,
              bgColor: colorObj.bg,
              category: formData.category,
              schedule: formData.schedule,
              customDate: formData.customDate
            }
          : t
      ));
    } else {
      // Add new task
      const newTask = {
        id: `custom-${Date.now()}`,
        label: formData.label,
        icon: formData.icon,
        color: colorObj.border,
        bgColor: colorObj.bg,
        category: formData.category,
        schedule: formData.schedule,
        customDate: formData.customDate,
      };
      setTasks([...tasks, newTask]);
    }
    
    resetForm();
    setShowModal(false);
  };

  const handleEditTask = (task) => {
    const colorObj = COLORS.find(c => c.bg === task.bgColor);
    setFormData({
      label: task.label,
      icon: task.icon,
      color: colorObj?.name || 'blue',
      category: task.category,
      schedule: task.schedule || 'Daily',
      customDate: task.customDate || '',
    });
    setEditingTask(task);
    setShowModal(true);
  };

  const handleDeleteTask = (taskId) => {
    if (confirm('Are you sure you want to delete this task?')) {
      setTasks(tasks.filter(t => t.id !== taskId));
      // Clean up data for deleted task
      setData(prev => {
        const newData = { ...prev };
        DAYS.forEach(day => {
          delete newData[`${day}-${taskId}`];
        });
        return newData;
      });
    }
  };

  const resetForm = () => {
    setFormData({ label: '', icon: 'Trophy', color: 'blue', category: 'Code', schedule: 'Daily', customDate: '' });
    setEditingTask(null);
  };

  const getDayProgress = (day) => {
    const completed = tasks.filter(t => data[`${day}-${t.id}`]).length;
    return tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0;
  };

  const weeklyScore = DAYS.reduce((acc, day) => acc + getDayProgress(day), 0) / DAYS.length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-4 pb-24">
      {/* Header */}
      <header className="flex justify-between items-center mb-8 pt-4 sticky top-0 bg-slate-950 z-10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">WEEK 1 DASHBOARD</h1>
          <p className="text-slate-400 text-xs sm:text-sm">Keep the momentum going! 🔥</p>
        </div>
        <div className="bg-slate-800/90 backdrop-blur p-3 rounded-2xl flex items-center gap-2 border border-slate-700 weekly-score shadow-lg">
          <Flame className="text-orange-500 fill-orange-500" size={20} />
          <span className="font-bold text-lg">{Math.round(weeklyScore)}%</span>
        </div>
      </header>

      {/* Install Button */}
      {installable && (
        <div className="mb-4 p-4 bg-gradient-to-r from-blue-900/40 to-purple-900/40 border border-blue-700/50 rounded-2xl flex items-center justify-between haptic-button cursor-pointer hover:from-blue-900/60 hover:to-purple-900/60">
          <div className="flex items-center gap-3">
            <Download size={20} className="text-blue-400" />
            <span className="text-sm font-semibold">Add to Home Screen</span>
          </div>
          <button 
            onClick={handleInstall}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-xs font-bold transition-all"
          >
            Install
          </button>
        </div>
      )}

      {/* Daily Motivation Quote */}
      <div className="mb-8 p-4 bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-700/50 rounded-2xl shadow-lg hover:shadow-xl transition-all">
        <p className="text-center text-sm sm:text-base font-semibold text-purple-100 italic">{dailyQuote}</p>
      </div>

      {/* Horizontal Day Selector */}
      <div className="flex justify-between mb-8 overflow-x-auto gap-2 py-2 pb-3">
        {DAYS.map((day, idx) => {
          const progress = getDayProgress(day);
          const isActive = activeDay === day;
          return (
            <button 
              key={day}
              onClick={() => setActiveDay(day)}
              className={`day-switcher flex flex-col items-center min-w-[60px] p-3 rounded-2xl font-semibold transition-all haptic-button ${
                isActive 
                  ? 'bg-gradient-to-br from-blue-600 to-blue-700 scale-110 shadow-xl shadow-blue-900/50 border border-blue-500' 
                  : 'bg-slate-900 border border-slate-800 hover:bg-slate-800'
              }`}
              style={isActive ? { animationDelay: `${idx * 0.05}s` } : {}}
            >
              <span className={`text-xs font-black tracking-wide ${isActive ? 'text-white' : 'text-slate-500'}`}>
                {day.toUpperCase()}
              </span>
              <div className={`mt-2 w-2.5 h-2.5 rounded-full transition-all ${
                progress === 100 
                  ? 'bg-green-400 shadow-lg shadow-green-500/50' 
                  : 'bg-slate-700'
              }`} />
            </button>
          );
        })}
      </div>

      {/* Task List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">
            Tasks for <span className="text-blue-400">{activeDay}</span>
          </h2>
          <button
            onClick={() => { resetForm(); setShowModal(true); }}
            className="flex items-center gap-2 text-sm font-semibold bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 px-3 py-2 rounded-lg transition-all haptic-button"
          >
            <Plus size={16} /> Add
          </button>
        </div>

        {tasks.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-400 mb-4">No tasks yet. Create one to get started!</p>
            <button
              onClick={() => { resetForm(); setShowModal(true); }}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-semibold transition-all"
            >
              <Plus size={18} /> Create Task
            </button>
          </div>
        ) : (
          tasks.map((task, idx) => {
            const isDone = data[`${activeDay}-${task.id}`];
            
            return (
              <div 
                key={task.id}
                className={`task-item group flex items-center gap-4 p-4 rounded-2xl border-l-4 cursor-pointer haptic-button shadow-md transition-all ${
                  isDone 
                    ? 'bg-slate-900/40 border-slate-700 opacity-50 hover:opacity-60' 
                    : `${task.bgColor} border-l-4 ${task.color} bg-slate-900/80 hover:bg-slate-800 shadow-lg hover:shadow-xl hover:scale-102`
                }`}
                style={{ animationDelay: `${idx * 0.08}s` }}
              >
                <div 
                  className={`flex-shrink-0 transition-all cursor-pointer ${
                    isDone ? 'text-slate-600 scale-90' : 'text-blue-400 scale-100'
                  }`}
                  onClick={() => toggleTask(activeDay, task.id)}
                >
                  {getIconComponent(task.icon)}
                </div>
                
                <div className="flex-1 min-w-0 cursor-pointer" onClick={() => toggleTask(activeDay, task.id)}>
                  <p className={`font-medium text-sm leading-tight ${
                    isDone ? 'line-through text-slate-500' : 'text-slate-200'
                  }`}>
                    {task.label}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    {isDone ? '✓ Completed' : task.category}
                  </p>
                  {task.schedule && (
                    <p className="text-xs text-slate-400 mt-0.5">
                      📅 {task.schedule} {task.schedule === 'Custom Date' && task.customDate ? `- ${new Date(task.customDate).toLocaleDateString()}` : ''}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleEditTask(task)}
                      className="p-2 hover:bg-slate-700 rounded-lg transition-all"
                      title="Edit task"
                    >
                      <Edit2 size={16} className="text-amber-400" />
                    </button>
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="p-2 hover:bg-red-900/30 rounded-lg transition-all"
                      title="Delete task"
                    >
                      <Trash2 size={16} className="text-red-400" />
                    </button>
                  </div>
                  {isDone ? (
                    <CheckCircle2 className="text-green-400 drop-shadow-lg" size={24} />
                  ) : (
                    <Circle className="text-slate-700 hover:text-slate-600" size={24} />
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Floating Bottom Stats */}
      <div className="fixed bottom-6 left-4 right-4 bg-gradient-to-r from-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-slate-700 p-5 rounded-3xl shadow-2xl">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-bold">Weekly Average</span>
            <span className="text-2xl font-black text-blue-400">{Math.round(weeklyScore)}%</span>
          </div>
          <div className="w-full bg-slate-700/50 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${weeklyScore}%` }}
            />
          </div>
          <div className="text-xs text-slate-400 flex justify-between">
            <span>Target: 100% ✨</span>
            <span>{DAYS.filter(d => getDayProgress(d) === 100).length}/7 days complete</span>
          </div>
        </div>
      </div>

      {/* Add/Edit Task Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end z-50">
          <div className="w-full bg-slate-900 rounded-t-3xl p-6 space-y-4 border-t border-slate-700 max-h-[90vh] overflow-y-auto animate-slide-up">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">
                {editingTask ? 'Edit Task' : 'Add New Task'}
              </h3>
              <button 
                onClick={() => { setShowModal(false); resetForm(); }}
                className="p-2 hover:bg-slate-800 rounded-lg transition-all"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Task Name */}
              <div>
                <label className="block text-sm font-semibold mb-2">Task Name</label>
                <input
                  type="text"
                  value={formData.label}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                  placeholder="e.g., Read documentation..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Icon Selection */}
              <div>
                <label className="block text-sm font-semibold mb-2">Icon</label>
                <div className="grid grid-cols-6 gap-2">
                  {ICON_OPTIONS.map(option => (
                    <button
                      key={option.name}
                      onClick={() => setFormData({ ...formData, icon: option.name })}
                      className={`p-3 rounded-lg transition-all ${
                        formData.icon === option.name
                          ? 'bg-blue-600 border-2 border-blue-400'
                          : 'bg-slate-800 border-2 border-slate-700 hover:border-slate-600'
                      }`}
                    >
                      {option.icon}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Selection */}
              <div>
                <label className="block text-sm font-semibold mb-2">Color</label>
                <div className="grid grid-cols-4 gap-2">
                  {COLORS.map(color => (
                    <button
                      key={color.name}
                      onClick={() => setFormData({ ...formData, color: color.name })}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        formData.color === color.name
                          ? `${color.bg} ${color.border} border-2`
                          : `${color.bg} border-2 border-slate-700 hover:border-slate-600`
                      }`}
                    >
                      <div className="w-6 h-6 rounded-full" style={{ background: color.border.replace('border-', '').replace('-400', '') }}></div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Category Selection */}
              <div>
                <label className="block text-sm font-semibold mb-2">Category</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Health', 'Study', 'Code'].map(cat => (
                    <button
                      key={cat}
                      onClick={() => setFormData({ ...formData, category: cat })}
                      className={`p-3 rounded-lg transition-all font-semibold ${
                        formData.category === cat
                          ? 'bg-blue-600 border-2 border-blue-400'
                          : 'bg-slate-800 border-2 border-slate-700 hover:border-slate-600'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Schedule Selection */}
              <div>
                <label className="block text-sm font-semibold mb-2">Schedule</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Daily', 'Tomorrow', 'Every Day', 'Custom Date'].map(sched => (
                    <button
                      key={sched}
                      onClick={() => setFormData({ ...formData, schedule: sched })}
                      className={`p-3 rounded-lg transition-all font-semibold text-sm ${
                        formData.schedule === sched
                          ? 'bg-green-600 border-2 border-green-400'
                          : 'bg-slate-800 border-2 border-slate-700 hover:border-slate-600'
                      }`}
                    >
                      {sched}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Date Input */}
              {formData.schedule === 'Custom Date' && (
                <div>
                  <label className="block text-sm font-semibold mb-2">Select Date</label>
                  <input
                    type="date"
                    value={formData.customDate}
                    onChange={(e) => setFormData({ ...formData, customDate: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-slate-100 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                  />
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => { setShowModal(false); resetForm(); }}
                  className="flex-1 py-3 px-4 bg-slate-800 hover:bg-slate-700 rounded-lg font-semibold transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddTask}
                  disabled={!formData.label.trim()}
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {editingTask ? 'Update Task' : 'Add Task'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}