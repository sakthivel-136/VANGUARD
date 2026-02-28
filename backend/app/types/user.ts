/* ================= USER TYPES ================= */

export type UserRole = 'Admin' | 'Supervisor' | 'Guard'

export interface User {
  id: string
  securityId: string

  fullName: string
  email: string
  phoneNumber: string

  role: UserRole

  assignedSite: string
  assignedRoute: string
  shiftTiming: string
  supervisor: string | null

  loginMethod: string
  temporaryPassword: string | null
  forcePasswordReset: boolean

  employeeId: string | null
  gpsValidationRequired: boolean | null
  offlineScansAllowed: boolean | null

  dashboardAccess: boolean
  activityLogAccess: boolean
  issueResolutionPermission: boolean

  lastLogin: Date
}

/* ================= FILTER TYPES ================= */

export interface UserFiltersState {
  role: UserRole | 'All'
  site: string
}
