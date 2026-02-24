// Export utilities for dashboard data

export const exportToCSV = (data, filename = 'dashboard-data.csv') => {
  let csv = 'Date,Task,Completed\n';
  
  Object.entries(data).forEach(([dateKey, dayData]) => {
    Object.entries(dayData).forEach(([taskId, completed]) => {
      csv += `${dateKey},"Task ${taskId}",${completed ? 'Yes' : 'No'}\n`;
    });
  });

  const element = document.createElement('a');
  const file = new Blob([csv], { type: 'text/csv' });
  element.href = URL.createObjectURL(file);
  element.download = filename;
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};

export const exportToJSON = (data, filename = 'dashboard-backup.json') => {
  const element = document.createElement('a');
  const file = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  element.href = URL.createObjectURL(file);
  element.download = filename;
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};

export const generatePDFReport = (userProfile, stats) => {
  let content = `
WEEKLY PERFORMANCE REPORT
Date Generated: ${new Date().toLocaleString()}

===========================================
USER INFORMATION
===========================================
Name: ${userProfile?.name || 'Anonymous'}
Email: ${userProfile?.email || 'N/A'}
Location: ${userProfile?.location || 'N/A'}
Title: ${userProfile?.title || 'N/A'}

===========================================
PERFORMANCE METRICS
===========================================
Current Streak: ${stats.currentStreak} days
Overall Completion: ${stats.overallCompletion}%
Days Active (Last 7): ${stats.daysActive}
Total Check-Ins: ${stats.totalCheckIns}

===========================================
WEEKLY BREAKDOWN
===========================================
${stats.lastSevenDays.map(day => 
  `${day.date}: ${day.completed}/${day.total} tasks (${day.percentage}%)`
).join('\n')}

===========================================
  `;
  return content;
};

export const importFromJSON = (jsonData) => {
  try {
    const parsed = JSON.parse(jsonData);
    if (parsed.dashboardData && parsed.userProfile) {
      return {
        success: true,
        data: parsed
      };
    }
    return {
      success: false,
      error: 'Invalid data format'
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};
