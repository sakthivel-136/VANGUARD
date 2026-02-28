export type ReportType =
  | 'scanCompliance'
  | 'guardPerformance'
  | 'siteSecurity'
  | 'issuesIncidents'

export interface BaseReport {
  id: number
}

/* ================= SCAN COMPLIANCE ================= */
export interface ScanComplianceReport extends BaseReport {
  siteName: string
  routeName: string
  guardName: string
  totalScanPoints: number
  completedScans: number
  missedScans: number
  lateScans: number
  compliancePercentage: number
}

/* ================= GUARD PERFORMANCE ================= */
export interface GuardPerformanceReport extends BaseReport {
  guardName: string
  assignedRoutes: number
  totalScans: number
  missedScans: number
  issuesReported: number
  onTimeScanPercentage: number
}

/* ================= SITE SECURITY ================= */
export interface SiteSecurityReport extends BaseReport {
  siteName: string
  guardsAssigned: number
  patrolsCompleted: number
  issuesReported: number
  emergencyAlerts: number
  missedScans: number
}

/* ================= ISSUES / INCIDENTS ================= */
export interface IssuesIncidentsReport extends BaseReport {
  issueType: string
  severity: 'Low' | 'Medium' | 'High' | 'Critical'
  site: string
  location: string
  reportedBy: string
  status: 'Open' | 'Closed'
}

export type ReportRow =
  | ScanComplianceReport
  | GuardPerformanceReport
  | SiteSecurityReport
  | IssuesIncidentsReport
