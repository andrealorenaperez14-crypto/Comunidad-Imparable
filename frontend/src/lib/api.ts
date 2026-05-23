import axios from 'axios'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' }
})

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token')
    if (token) config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      const refreshToken = localStorage.getItem('refreshToken')
      if (refreshToken) {
        try {
          const { data } = await axios.post(`${BASE_URL}/api/auth/refresh`, { refreshToken })
          localStorage.setItem('token', data.token)
          error.config.headers.Authorization = `Bearer ${data.token}`
          return api.request(error.config)
        } catch {
          localStorage.removeItem('token')
          localStorage.removeItem('refreshToken')
          window.location.href = '/login'
        }
      }
    }
    return Promise.reject(error)
  }
)

// Auth
export const authApi = {
  login: (data: { email: string; password: string }) =>
    api.post('/api/auth/login', data),
  register: (data: { email: string; dni: string; password: string; firstName: string; lastName: string }) =>
    api.post('/api/auth/register', data),
  me: () => api.get('/api/auth/me'),
  logout: () => api.post('/api/auth/logout'),
  refresh: (refreshToken: string) => api.post('/api/auth/refresh', { refreshToken }),
  forgotPassword: (email: string) =>
    api.post('/api/auth/forgot-password', { email }),
  resetPassword: (email: string, otp: string, newPassword: string) =>
    api.post('/api/auth/reset-password', { email, otp, newPassword })
}

// Subscription
export const subscriptionApi = {
  status: () => api.get('/api/subscription/status'),
  upgrade: (planType: string) => api.post('/api/subscription/upgrade', { planType }),
  cancel: () => api.post('/api/subscription/cancel'),
  history: () => api.get('/api/subscription/history')
}

// Agents (student)
export const agentApi = {
  list: () => api.get('/api/agents'),
  chat: (agentId: string, message: string) =>
    api.post(`/api/agents/${agentId}/chat`, { message }),
  metrics: (agentId: string) => api.get(`/api/agents/${agentId}/metrics`),
  reports: (agentId: string) => api.get(`/api/agents/${agentId}/reports`)
}

// Admin agents
export const adminAgentApi = {
  list: () => api.get('/api/admin/agents'),
  create: (data: object) => api.post('/api/admin/agents', data),
  update: (id: string, data: object) => api.put(`/api/admin/agents/${id}`, data),
  uploadKnowledge: (id: string, formData: FormData) =>
    api.post(`/api/admin/agents/${id}/knowledge`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  interactions: (id: string, page = 1) =>
    api.get(`/api/admin/agents/${id}/interactions?page=${page}`),
  publish: (id: string) => api.post(`/api/admin/agents/${id}/publish`)
}

// Admin courses
export const adminCourseApi = {
  list: () => api.get('/api/admin/courses'),
  create: (data: object) => api.post('/api/admin/courses', data),
  update: (id: string, data: object) => api.put(`/api/admin/courses/${id}`, data),
  remove: (id: string) => api.delete(`/api/admin/courses/${id}`)
}

// Metrics
export const metricsApi = {
  student: (studentId: string) => api.get(`/api/metrics/student/${studentId}`),
  dashboard: () => api.get('/api/metrics/dashboard'),
  generateReport: (studentId?: string) =>
    api.post('/api/metrics/generate-report', studentId ? { studentId } : {}),
  uploadParams: (formData: FormData) =>
    api.post('/api/metrics/upload-params', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
}

// Ranking
export const rankingApi = {
  top10: () => api.get('/api/ranking'),
  student: (studentId: string) => api.get(`/api/ranking/student/${studentId}`)
}

// Admin users
export const adminUserApi = {
  search: (q: string) => api.get(`/api/admin/users/search?q=${encodeURIComponent(q)}`),
  resetPassword: (emailOrDni: string, newPassword: string, confirmPassword: string) =>
    api.post('/api/admin/users/reset-password', { emailOrDni, newPassword, confirmPassword }),
  resetStudentPassword: (userId: string, newPassword: string, confirmPassword: string) =>
    api.post(`/api/admin/users/students/${userId}/reset-password`, { newPassword, confirmPassword }),
  students: (q = '', page = 1) =>
    api.get(`/api/admin/users/students?q=${encodeURIComponent(q)}&page=${page}`)
}

// Certificates
export const certificateApi = {
  list: (studentId: string) => api.get(`/api/certificates/${studentId}`),
  verify: (certId: string) => api.get(`/api/certificates/${certId}/verify`),
  download: (certId: string) =>
    api.post(`/api/certificates/${certId}/download`, {}, { responseType: 'blob' })
}
