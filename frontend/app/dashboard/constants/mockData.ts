// constants/mockData.ts

/* ================= DASHBOARD STATS ================= */

export const mockStats = {
  totalGuards: 42,
  roundsToday: {
    completed: 156,
    scheduled: 180,
  },
  missedRounds: 8,
  activeAlerts: 5,
};

/* ================= ROUND STATUS (PIE / DONUT) ================= */

export const mockRoundStatusData = [
  { name: 'Completed', value: 156, color: '#10b981' },
  { name: 'In Progress', value: 18, color: '#3b82f6' },
  { name: 'Missed', value: 8, color: '#ef4444' },
  { name: 'Upcoming', value: 24, color: '#6b7280' },
];

/* ================= SITE FILTER OPTIONS ================= */

export const mockSiteOptions = [
  { id: 'all', name: 'All Sites' },
  { id: 'downtown', name: 'Downtown Office' },
  { id: 'north', name: 'North Facility' },
  { id: 'west', name: 'West Warehouse' },
  { id: 'south', name: 'South Campus' },
  { id: 'east', name: 'East Plaza' },
];

/* ================= (LEGACY) RECENT ACTIVITY ================= */
/* You can safely remove this later */

export const mockRecentActivity = [
  { id: 1, guard: 'John Smith', action: 'Completed round', time: '10:45 AM', site: 'Downtown Office', duration: '42 min' },
  { id: 2, guard: 'Sarah Johnson', action: 'Started round', time: '10:30 AM', site: 'North Facility', duration: '-' },
  { id: 3, guard: 'Michael Brown', action: 'Reported issue', time: '10:15 AM', site: 'West Warehouse', duration: '38 min' },
  { id: 4, guard: 'Emily Davis', action: 'Completed round', time: '9:45 AM', site: 'South Campus', duration: '45 min' },
  { id: 5, guard: 'Robert Wilson', action: 'Started round', time: '9:30 AM', site: 'East Plaza', duration: '-' },
  { id: 6, guard: 'Jessica Martinez', action: 'Completed round', time: '9:15 AM', site: 'Downtown Office', duration: '40 min' },
  { id: 7, guard: 'David Anderson', action: 'Reported issue', time: '8:45 AM', site: 'North Facility', duration: '35 min' },
  { id: 8, guard: 'Lisa Thompson', action: 'Completed round', time: '8:30 AM', site: 'West Warehouse', duration: '43 min' },
  { id: 9, guard: 'James Garcia', action: 'Started round', time: '8:15 AM', site: 'South Campus', duration: '-' },
  { id: 10, guard: 'Mary Rodriguez', action: 'Completed round', time: '7:45 AM', site: 'East Plaza', duration: '41 min' },
];

/* ================= GUARD ISSUES ================= */

export const mockGuardIssues = [
  { id: 1, guard: 'Michael Brown', issue: 'Equipment malfunction', severity: 'high', time: '10:15 AM', site: 'West Warehouse' },
  { id: 2, guard: 'David Anderson', issue: 'Access denied at sector 3', severity: 'medium', time: '8:45 AM', site: 'North Facility' },
  { id: 3, guard: 'John Smith', issue: 'Late check-in', severity: 'low', time: 'Yesterday', site: 'Downtown Office' },
  { id: 4, guard: 'Emily Davis', issue: 'Missed checkpoint', severity: 'medium', time: 'Yesterday', site: 'South Campus' },
  { id: 5, guard: 'Robert Wilson', issue: 'Communication device failure', severity: 'high', time: '2 days ago', site: 'East Plaza' },
  { id: 6, guard: 'Jessica Martinez', issue: 'Injury during patrol', severity: 'critical', time: '3 days ago', site: 'Downtown Office' },
  { id: 7, guard: 'James Garcia', issue: 'Vehicle malfunction', severity: 'high', time: '3 days ago', site: 'South Campus' },
  { id: 8, guard: 'Mary Rodriguez', issue: 'Unauthorized access attempt', severity: 'critical', time: '4 days ago', site: 'East Plaza' },
];

/* ================= NEW: ATTENDANCE TREND ================= */

export const mockAttendanceData = [
  { date: 'Jan 10', present: 42 },
  { date: 'Jan 11', present: 39 },
  { date: 'Jan 12', present: 45 },
  { date: 'Jan 13', present: 41 },
];

/* ================= NEW: ROUNDS COMPLETION % ================= */

export const mockCompletionData = [
  { date: 'Jan 10', completionPercentage: 88 },
  { date: 'Jan 11', completionPercentage: 92 },
  { date: 'Jan 12', completionPercentage: 79 },
  { date: 'Jan 13', completionPercentage: 85 },
];
