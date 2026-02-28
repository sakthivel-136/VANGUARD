export interface DashboardStats {
  totalGuards: number;
  roundsToday: {
    completed: number;
    scheduled: number;
  };
  missedRounds: number;
  activeAlerts: number;
}

export interface RoundStatusData {
  name: string;
  value: number;
  color: string;
}

export interface RecentActivity {
  id: string;
  guardName: string;
  site: string;
  location: string;
  time: string;
  status: 'on-time' | 'late';
}

export interface GuardIssue {
  id: string;
  guardName: string;
  issue: string;
  severity: 'low' | 'medium' | 'high';
}

export interface DashboardFilters {
  dateRange: {
    start: string;
    end: string;
  };
  site: string;
}

export interface SiteOption {
  id: string;
  name: string;
}