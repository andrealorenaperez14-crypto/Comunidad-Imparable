export interface User {
  id: string
  email: string
  dni: string
  role: 'ADMIN' | 'STUDENT' | 'CLIENT'
  clientId: string
  firstName?: string
  lastName?: string
  avatarUrl?: string
  lastLoginAt?: string
  schoolName?: string
  branding?: Branding
  subscription?: Subscription | null
}

export interface Branding {
  primaryColor: string
  secondaryColor: string
  accentColor: string
  logo: string
  darkMode: boolean
}

export interface Subscription {
  id: string
  planType: 'TRIAL' | '30_DAYS' | 'VITALICIO'
  status: 'ACTIVE' | 'TRIAL' | 'SUSPENDED' | 'EXPIRED'
  createdAt: string
  activeUntil: string
  suspensionDate?: string
  daysRemaining?: number
  isExpired?: boolean
  isSuspended?: boolean
  isVitalicio?: boolean
}

export interface IAAgent {
  id: string
  type: 'COACH' | 'MENTALIDAD' | 'CONSULTIVA'
  name: string
  description: string
  icon: string
  published: boolean
  publishedDate?: string
  systemPrompt?: string
  instructions?: string
  metricsConfig?: MetricsConfig
  _count?: { interactions: number }
}

export interface MetricsConfig {
  alertThresholdLow: number
  alertThresholdHigh: number
  reportingSchedule: string
}

export interface IAMetric {
  id: string
  agentId: string
  userId: string
  totalQuestions: number
  avgResolutionTime: number
  problemResolutionRate: number
  totalSessions: number
  avgSessionDuration: number
  completionRate: number
  engagementScore: number
  habitStreak: number
  status: 'EXCELENTE' | 'BUENO' | 'ALERTA'
  reportContent?: string
  alertMessage?: string
  lastReportDate?: string
  agent?: { name: string; type: string; icon: string }
}

export interface RankingEntry {
  position: number
  userId: string
  nombre: string
  totalScore: number
  gainPercentage: number
  daysInTop10: number
  lastUpdated: string
}

export interface Certificate {
  id: string
  serialNumber: string
  userId: string
  courseId: string
  courseName: string
  issueDate: string
  validityDate?: string
  pdfUrl: string
  status: 'ISSUED' | 'REVOKED'
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  modelUsed?: string
  timestamp: Date
}

export interface DashboardStats {
  totalStudents: number
  activeSubscriptions: number
  alertStudents: number
  totalInteractions: number
  recentAlerts: Alert[]
}

export interface Alert {
  userId: string
  studentName: string
  agentName: string
  agentType: string
  status: string
  alertMessage?: string
}
