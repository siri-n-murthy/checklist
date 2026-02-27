import React, { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Plus, X, Trash2 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

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

export default function CalendarView({ checklistData, onUpdateData, tasks = [] }) {
  const { isDark } = useTheme();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', color: 'indigo', icon: 'Star' });
  const today = new Date().toISOString().split('T')[0];

  const monthData = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { year, month, daysInMonth, startingDayOfWeek };
  }, [currentDate]);

  const getDayCompletion = (day) => {
    const date = new Date(monthData.year, monthData.month, day);
    const dateKey = date.toISOString().split('T')[0];
    const dayData = checklistData[dateKey] || {};
    
    // Get all task IDs from Dashboard tasks for this day
    const taskIds = tasks && tasks.length > 0 
      ? tasks.filter(task => dayData[task.id] !== undefined).map(task => task.id)
      : Object.keys(dayData).filter(key => typeof dayData[key] === 'boolean' || (typeof dayData[key] === 'object' && dayData[key].completed));
    
    // Count completed tasks (value is true)
    const completed = taskIds.filter(taskId => dayData[taskId] === true).length;
    const total = taskIds.length;
    
    return total > 0 
      ? { completed, total, percentage: Math.round((completed / total) * 100), dateKey } 
      : { total: 0, completed: 0, percentage: 0, dateKey };
  };

  const prevMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1));
  };

  const monthName = new Date(monthData.year, monthData.month).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const days = Array.from({ length: 7 }, (_, i) => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][i]);

  const calendarDays = [];
  for (let i = 0; i < monthData.startingDayOfWeek; i++) {
    calendarDays.push(null);
  }
  for (let i = 1; i <= monthData.daysInMonth; i++) {
    calendarDays.push(i);
  }

  const getCompletion = (day) => {
    if (!day) return null;
    return getDayCompletion(day);
  };

  const getColorClass = (percentage) => {
    if (!percentage) return 'bg-slate-700/50 hover:bg-slate-600';
    if (percentage === 100) return 'bg-emerald-500 hover:bg-emerald-600';
    if (percentage >= 75) return 'bg-emerald-600 hover:bg-emerald-700';
    if (percentage >= 50) return 'bg-yellow-600 hover:bg-yellow-700';
    if (percentage >= 25) return 'bg-orange-600 hover:bg-orange-700';
    return 'bg-red-600 hover:bg-red-700';
  };

  const isFutureDate = (dateKey) => {
    return dateKey > today;
  };

  const handleDayClick = (day) => {
    if (day) {
      const date = new Date(monthData.year, monthData.month, day);
      const dateKey = date.toISOString().split('T')[0];
      setSelectedDate({ day, dateKey, date });
      setShowModal(true);
      setShowAddForm(false);
    }
  };

  const handleToggleTask = (taskId) => {
    if (!selectedDate) return;
    
    if (isFutureDate(selectedDate.dateKey)) {
      return; // Can't mark tasks complete on future dates
    }

    const dateKey = selectedDate.dateKey;
    
    onUpdateData(prev => ({
      ...prev,
      [dateKey]: {
        ...prev[dateKey],
        [taskId]: !(prev[dateKey]?.[taskId])
      }
    }));
  };

  const handleAddTaskForDay = () => {
    if (newTask.title.trim() && selectedDate) {
      const taskId = `task-${Date.now()}`;
      
      onUpdateData(prev => ({
        ...prev,
        [selectedDate.dateKey]: {
          ...prev[selectedDate.dateKey],
          [taskId]: {
            id: taskId,
            title: newTask.title,
            color: newTask.color,
            icon: newTask.icon,
            createdAt: new Date().toISOString()
          }
        }
      }));
      
      setNewTask({ title: '', color: 'blue', icon: 'Star' });
      setShowAddForm(false);
    }
  };

  const handleDeleteTask = (taskId) => {
    if (!selectedDate) return;

    onUpdateData(prev => {
      const updated = { ...prev };
      const dayData = updated[selectedDate.dateKey];
      
      if (dayData && dayData[taskId]) {
        delete dayData[taskId];
        if (dayData[taskId + '_completed']) {
          delete dayData[taskId + '_completed'];
        }
      }
      
      return updated;
    });
  };

  const canAddTasks = !!selectedDate;

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-6 border border-slate-700">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Calendar size={28} className="text-cyan-400" />
            Calendar - Daily Tasks
          </h2>
        </div>

        <div className="flex items-center justify-between mb-6">
          <button
            onClick={prevMonth}
            className="p-2 hover:bg-slate-700 rounded-lg transition"
          >
            <ChevronLeft size={24} className="text-slate-300" />
          </button>
          <h3 className="text-xl font-bold text-white">{monthName}</h3>
          <button
            onClick={nextMonth}
            className="p-2 hover:bg-slate-700 rounded-lg transition"
          >
            <ChevronRight size={24} className="text-slate-300" />
          </button>
        </div>

        <div className="flex flex-wrap gap-4 mb-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-emerald-500 rounded"></div>
            <span className="text-slate-300">100%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-600 rounded"></div>
            <span className="text-slate-300">50-75%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-600 rounded"></div>
            <span className="text-slate-300">Below 50%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-slate-700/50 rounded"></div>
            <span className="text-slate-300">No Data</span>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2 mb-2">
          {days.map(day => (
            <div key={day} className="text-center font-bold text-slate-400 text-sm py-2">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {calendarDays.map((day, idx) => {
            const completion = getCompletion(day);
            const colorClass = getColorClass(completion?.percentage);

            return (
              <button
                key={idx}
                onClick={() => handleDayClick(day)}
                className={`aspect-square rounded-lg flex items-center justify-center font-semibold text-white cursor-pointer transition hover:ring-2 hover:ring-cyan-400 relative group ${
                  day ? colorClass : 'bg-transparent'
                }`}
              >
                {day && (
                  <>
                    <span className="text-sm">{day}</span>
                    {completion && completion.total > 0 && (
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition bg-slate-700 px-2 py-1 rounded text-xs text-white whitespace-nowrap z-10">
                        {completion.completed}/{completion.total} ({completion.percentage}%)
                      </div>
                    )}
                    <div className={`absolute -bottom-1 -right-1 ${isDark ? 'bg-indigo-400 text-slate-900' : 'bg-indigo-500 text-white'} rounded-full w-4 h-4 flex items-center justify-center text-xs font-bold opacity-0 group-hover:opacity-100 transition`}>
                      +
                    </div>
                  </>
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-6 grid grid-cols-4 gap-3">
          {(() => {
            let perfect = 0, good = 0, okay = 0, poor = 0;
            for (let i = 1; i <= monthData.daysInMonth; i++) {
              const completion = getDayCompletion(i);
              if (!completion || completion.total === 0) continue;
              if (completion.percentage === 100) perfect++;
              else if (completion.percentage >= 75) good++;
              else if (completion.percentage >= 50) okay++;
              else poor++;
            }
            return (
              <>
                <div className="bg-emerald-900/30 border border-emerald-700 rounded-lg p-3">
                  <p className="text-emerald-300 text-xs">Perfect Days</p>
                  <p className="text-2xl font-bold text-emerald-400">{perfect}</p>
                </div>
                <div className="bg-yellow-900/30 border border-yellow-700 rounded-lg p-3">
                  <p className="text-yellow-300 text-xs">Good Days</p>
                  <p className="text-2xl font-bold text-yellow-400">{good}</p>
                </div>
                <div className="bg-orange-900/30 border border-orange-700 rounded-lg p-3">
                  <p className="text-orange-300 text-xs">Okay Days</p>
                  <p className="text-2xl font-bold text-orange-400">{okay}</p>
                </div>
                <div className="bg-red-900/30 border border-red-700 rounded-lg p-3">
                  <p className="text-red-300 text-xs">Poor Days</p>
                  <p className="text-2xl font-bold text-red-400">{poor}</p>
                </div>
              </>
            );
          })()}
        </div>
      </div>

      {showModal && selectedDate && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-6 border border-slate-700 max-w-md w-full max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">
                {selectedDate.date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                {isFutureDate(selectedDate.dateKey) && (
                  <span className="ml-2 text-sm bg-orange-500/20 text-orange-300 px-2 py-1 rounded">Future Date</span>
                )}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-slate-700 rounded-lg transition"
              >
                <X size={20} className="text-slate-400" />
              </button>
            </div>

            {canAddTasks ? (
              !showAddForm ? (
                <button
                  onClick={() => setShowAddForm(true)}
                  className={`w-full flex items-center justify-center gap-2 p-2 mb-4 font-semibold rounded-lg transition ${isDark ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'bg-indigo-500 hover:bg-indigo-600 text-white'}`}
                >
                  <Plus size={18} />
                  Add Task for This Day
                </button>
              ) : (
                <div className="bg-slate-700/50 rounded-lg p-4 mb-4 space-y-3 border border-slate-600">
                  <input
                    type="text"
                    placeholder="Task title"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400"
                    onKeyPress={(e) => e.key === 'Enter' && handleAddTaskForDay()}
                  />

                  <div className="grid grid-cols-2 gap-2">
                    <select
                      value={newTask.icon}
                      onChange={(e) => setNewTask({ ...newTask, icon: e.target.value })}
                      className="px-2 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white text-sm focus:outline-none focus:border-cyan-400"
                    >
                      {ICON_OPTIONS.map(icon => (
                        <option key={icon.name} value={icon.name}>{icon.emoji} {icon.name}</option>
                      ))}
                    </select>

                    <select
                      value={newTask.color}
                      onChange={(e) => setNewTask({ ...newTask, color: e.target.value })}
                      className="px-2 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white text-sm focus:outline-none focus:border-cyan-400"
                    >
                      {COLORS.map(color => (
                        <option key={color.name} value={color.name}>{color.name.charAt(0).toUpperCase() + color.name.slice(1)}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={handleAddTaskForDay}
                      className={`flex-1 px-3 py-2 font-semibold rounded-lg transition ${isDark ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'bg-indigo-500 hover:bg-indigo-600 text-white'}`}
                    >
                      Create
                    </button>
                    <button
                      onClick={() => {
                        setShowAddForm(false);
                        setNewTask({ title: '', color: 'indigo', icon: 'Star' });
                      }}
                      className={`flex-1 px-3 py-2 font-semibold rounded-lg transition ${isDark ? 'bg-slate-600 hover:bg-slate-500 text-white' : 'bg-slate-300 hover:bg-slate-400 text-slate-900'}`}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )
            ) : (
              null
            )}

            <div className="space-y-2 mb-4">
              {(() => {
                const dayData = checklistData[selectedDate.dateKey] || {};
                
                // If tasks array is available from Dashboard, use those; otherwise use calendar-stored tasks
                let dayTasks = [];
                if (tasks && tasks.length > 0) {
                  dayTasks = tasks;
                } else {
                  dayTasks = Object.entries(dayData)
                    .filter(([key, value]) => typeof value === 'object' && value.title)
                    .map(([key, value]) => ({ id: key, ...value }));
                }

                return dayTasks.length > 0 ? (
                  dayTasks.map(task => {
                    const isCompleted = checklistData[selectedDate.dateKey]?.[task.id] || false;
                    
                    return (
                      <div
                        key={task.id}
                        className="flex items-center gap-3 p-3 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition group"
                      >
                        <div
                          className={`text-2xl cursor-pointer ${isFutureDate(selectedDate.dateKey) ? 'opacity-50 cursor-not-allowed' : ''}`}
                          onClick={() => !isFutureDate(selectedDate.dateKey) && handleToggleTask(task.id)}
                        >
                          {isCompleted ? '✅' : '📍'}
                        </div>
                        <div
                          className={`flex-1 min-w-0 ${!isFutureDate(selectedDate.dateKey) ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}`}
                          onClick={() => !isFutureDate(selectedDate.dateKey) && handleToggleTask(task.id)}
                        >
                          <p className={`font-semibold text-sm transition ${isCompleted ? 'text-slate-400 line-through' : 'text-white'}`}>
                            {task.title}
                          </p>
                        </div>
                        <button
                          onClick={() => handleDeleteTask(task.id)}
                          className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-900/20 rounded transition opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-slate-400 text-center py-4 text-sm">No tasks for this day</p>
                );
              })()}
            </div>

            {(() => {
              const dayData = checklistData[selectedDate.dateKey] || {};
              const dayTasks = Object.entries(dayData)
                .filter(([key, value]) => typeof value === 'object' && value.title)
                .map(([key, value]) => ({ id: key, ...value }));
              
              const total = dayTasks.length;
              const completed = dayTasks.filter(task => dayData[task.id + '_completed']).length;
              const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

              return (
                <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-slate-300 text-sm">Completion</span>
                    <span className="text-2xl font-bold text-cyan-400">{percentage}%</span>
                  </div>
                  <div className="w-full bg-slate-600 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-cyan-500 to-cyan-400 h-full rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <p className="text-slate-400 text-xs mt-2">{completed}/{total} tasks completed</p>
                </div>
              );
            })()}

            <button
              onClick={() => setShowModal(false)}
              className="w-full mt-4 px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white font-semibold rounded-lg transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
