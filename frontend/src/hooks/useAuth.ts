'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { authApi } from '@/lib/api'

export function useAuth() {
  const { user, token, setUser, setAuth, logout, isLoading, setLoading, _hasHydrated } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    if (_hasHydrated && token && !user) {
      setLoading(true)
      authApi.me()
        .then(({ data }) => setUser(data))
        .catch(() => logout())
        .finally(() => setLoading(false))
    }
  }, [token, user, _hasHydrated])

  const login = async (email: string, password: string) => {
    const { data } = await authApi.login({ email, password })
    setAuth(data.user, data.token, data.refreshToken)
    return data
  }

  const register = async (formData: {
    email: string; dni: string; password: string; firstName: string; lastName: string
  }) => {
    const { data } = await authApi.register(formData)
    setAuth(data.user, data.token)
    return data
  }

  const logoutAndRedirect = async () => {
    try { await authApi.logout() } catch { /* ignore */ }
    logout()
    router.push('/login')
  }

  return {
    user,
    token,
    isLoading: !_hasHydrated || isLoading || (!!token && !user),
    isAuthenticated: !!token,
    isAdmin: user?.role === 'ADMIN',
    isStudent: user?.role === 'STUDENT',
    login,
    register,
    logout: logoutAndRedirect
  }
}

export function useRequireAuth(redirectTo = '/login') {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(redirectTo)
    }
  }, [isAuthenticated, isLoading])

  return { isAuthenticated, isLoading }
}

export function useRequireAdmin() {
  const { isAuthenticated, isAdmin, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) router.push('/login')
      else if (!isAdmin) router.push('/dashboard')
    }
  }, [isAuthenticated, isAdmin, isLoading])

  return { isAdmin, isLoading }
}
