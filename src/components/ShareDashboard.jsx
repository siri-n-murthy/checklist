import React, { useState } from 'react';
import { Share2, Copy, Mail, LinkIcon, Download, CheckCircle, Users } from 'lucide-react';

export default function ShareDashboard({ userProfile, checklistData, currentStreak, overallCompletion, tasks }) {
  const [copied, setCopied] = useState(false);
  const [showAccountability, setShowAccountability] = useState(false);
  const [accountabilityPartner, setAccountabilityPartner] = useState(() => {
    const saved = localStorage.getItem('accountabilityPartner');
    return saved ? JSON.parse(saved) : { name: '', email: '' };
  });

  const baseUrl = window.location.origin;
  const shareCode = Buffer.from(JSON.stringify({
    user: userProfile?.name || 'Anonymous',
    streak: currentStreak,
    completion: overallCompletion,
    tasks: tasks.length,
    date: new Date().toLocaleDateString()
  })).toString('base64');

  const shareUrl = `${baseUrl}?share=${shareCode}`;

  const generateWeeklyReport = () => {
    const today = new Date();
    const lastSevenDays = [];
    let totalCompleted = 0;
    let daysActive = 0;

    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateKey = date.toISOString().split('T')[0];
      const dayData = checklistData[dateKey] || {};
      const completed = Object.values(dayData).filter(v => v).length;
      const total = Object.keys(dayData).length;

      if (total > 0) {
        daysActive++;
        totalCompleted += completed;
        lastSevenDays.push({
          date: dateKey,
          completed,
          total,
          percentage: Math.round((completed / total) * 100)
        });
      }
    }

    const report = `
WEEKLY REPORT - ${today.toLocaleDateString()}
=====================================

User: ${userProfile?.name || 'Anonymous'}
${userProfile?.title ? `Title: ${userProfile.title}` : ''}

📊 PERFORMANCE METRICS
- Current Streak: ${currentStreak} days 🔥
- Overall Completion: ${overallCompletion}%
- Days Active: ${daysActive}/7
- Total Tasks Created: ${tasks.length}

📈 DAILY BREAKDOWN
${lastSevenDays.map(day => `${day.date}: ${day.completed}/${day.total} (${day.percentage}%)`).join('\n')}

📝 NOTES
${userProfile?.bio || 'No notes'}

=====================================
Generated on ${today.toLocaleString()}
    `.trim();

    return report;
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadReport = () => {
    const report = generateWeeklyReport();
    const element = document.createElement('a');
    const file = new Blob([report], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `weekly-report-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const downloadJSON = () => {
    const data = {
      user: userProfile,
      checklistData,
      stats: {
        currentStreak,
        overallCompletion,
        tasksCount: tasks.length
      },
      exportDate: new Date().toISOString()
    };
    const element = document.createElement('a');
    const file = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    element.href = URL.createObjectURL(file);
    element.download = `dashboard-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const saveAccountabilityPartner = () => {
    localStorage.setItem('accountabilityPartner', JSON.stringify(accountabilityPartner));
    setShowAccountability(false);
  };

  return (
    <div className="space-y-6">
      {/* Sharing Card */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-6 border border-slate-700">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2 mb-6">
          <Share2 size={28} className="text-cyan-400" />
          Share Your Progress
        </h2>

        {/* Share Link */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-300 mb-2">Share Link</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={shareUrl}
              readOnly
              className="flex-1 px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-300 text-sm focus:outline-none"
            />
            <button
              onClick={() => copyToClipboard(shareUrl)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
                copied
                  ? 'bg-green-600 text-white'
                  : 'bg-cyan-500 hover:bg-cyan-600 text-slate-900'
              }`}
            >
              {copied ? (
                <>
                  <CheckCircle size={18} />
                  Copied!
                </>
              ) : (
                <>
                  <Copy size={18} />
                  Copy
                </>
              )}
            </button>
          </div>
          <p className="text-slate-400 text-xs mt-2">Share this link to show your progress to friends</p>
        </div>

        {/* Quick Share Info */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-slate-700/50 rounded-lg p-4 text-center">
            <p className="text-slate-400 text-xs mb-1">STREAK</p>
            <p className="text-3xl font-bold text-orange-400">{currentStreak}</p>
          </div>
          <div className="bg-slate-700/50 rounded-lg p-4 text-center">
            <p className="text-slate-400 text-xs mb-1">COMPLETION</p>
            <p className="text-3xl font-bold text-cyan-400">{overallCompletion}%</p>
          </div>
          <div className="bg-slate-700/50 rounded-lg p-4 text-center">
            <p className="text-slate-400 text-xs mb-1">TASKS</p>
            <p className="text-3xl font-bold text-emerald-400">{tasks.length}</p>
          </div>
        </div>
      </div>

      {/* Weekly Report Card */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-6 border border-slate-700">
        <h3 className="text-xl font-bold text-white mb-4">Weekly Report Card</h3>
        <p className="text-slate-400 text-sm mb-4">Generate and share your weekly performance report</p>

        <div className="space-y-2">
          <button
            onClick={downloadReport}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-cyan-500 hover:bg-cyan-600 text-slate-900 font-semibold rounded-lg transition"
          >
            <Download size={18} />
            Download Report (TXT)
          </button>
          <button
            onClick={() => copyToClipboard(generateWeeklyReport())}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition"
          >
            <Copy size={18} />
            Copy Report to Clipboard
          </button>
        </div>

        {/* Report Preview */}
        <details className="mt-4">
          <summary className="cursor-pointer text-cyan-400 font-semibold hover:text-cyan-300">Preview Report</summary>
          <pre className="mt-3 bg-slate-900 rounded-lg p-4 text-xs text-slate-300 overflow-x-auto whitespace-pre-wrap break-words max-h-64 overflow-y-auto">
            {generateWeeklyReport()}
          </pre>
        </details>
      </div>

      {/* Data Export */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-6 border border-slate-700">
        <h3 className="text-xl font-bold text-white mb-4">Data Management</h3>
        <p className="text-slate-400 text-sm mb-4">Export all your data for backup or analysis</p>

        <button
          onClick={downloadJSON}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition"
        >
          <Download size={18} />
          Export All Data (JSON)
        </button>
        <p className="text-slate-400 text-xs mt-2">Download your complete dashboard data as JSON for backup or transfer</p>
      </div>

      {/* Accountability Partner */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-6 border border-slate-700">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Users size={24} className="text-purple-400" />
          Accountability Partner
        </h3>

        {accountabilityPartner?.name ? (
          <div className="bg-slate-700/50 rounded-lg p-4 mb-4">
            <p className="text-slate-400 text-sm mb-1">Your Accountability Partner</p>
            <p className="text-white font-semibold">{accountabilityPartner.name}</p>
            <p className="text-slate-400 text-sm">{accountabilityPartner.email}</p>
            <button
              onClick={() => setShowAccountability(true)}
              className="mt-3 px-3 py-1 text-sm bg-purple-600/30 hover:bg-purple-600/50 text-purple-300 rounded transition"
            >
              Change Partner
            </button>
          </div>
        ) : (
          <div className="bg-slate-700/30 rounded-lg p-4 mb-4 border border-dashed border-slate-600">
            <p className="text-slate-400 text-sm">No accountability partner set</p>
            <button
              onClick={() => setShowAccountability(true)}
              className="mt-3 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded transition"
            >
              Set Partner
            </button>
          </div>
        )}

        {showAccountability && (
          <div className="space-y-3 p-4 bg-slate-700/50 rounded-lg">
            <input
              type="text"
              placeholder="Partner Name"
              value={accountabilityPartner.name}
              onChange={(e) => setAccountabilityPartner({ ...accountabilityPartner, name: e.target.value })}
              className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-purple-400"
            />
            <input
              type="email"
              placeholder="Partner Email"
              value={accountabilityPartner.email}
              onChange={(e) => setAccountabilityPartner({ ...accountabilityPartner, email: e.target.value })}
              className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-purple-400"
            />
            <div className="flex gap-2">
              <button
                onClick={saveAccountabilityPartner}
                className="flex-1 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded transition"
              >
                Save
              </button>
              <button
                onClick={() => setShowAccountability(false)}
                className="flex-1 px-3 py-2 bg-slate-600 hover:bg-slate-500 text-white font-semibold rounded transition"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
