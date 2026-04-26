import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { axiosInstance } from '@/api/axios'
import { useAuthStore } from '@/app/store'
import { normalizeError } from '@/utils/errorHandler'
import { useToast } from './useToast'
import type { LoginPayload, SignUpPayload, AuthResponse } from '@/types/auth.types'

export function useAuth() {
  const { setToken, clearToken } = useAuthStore()
  const navigate = useNavigate()
  const toast    = useToast()

  const login = useCallback(
    async (payload: LoginPayload) => {
      const { data } = await axiosInstance.post<AuthResponse>('/login', payload)
      setToken(data.accessToken)
      navigate('/dashboard', { replace: true })
    },
    [setToken, navigate]
  )

  const signUp = useCallback(
    async (payload: SignUpPayload) => {
      await axiosInstance.post('/signup', payload)
      toast.success('Account created! Please log in.')
      navigate('/login', { replace: true })
    },
    [navigate, toast]
  )

  const logout = useCallback(() => {
    clearToken()
    navigate('/login', { replace: true })
  }, [clearToken, navigate])

  return { login, signUp, logout, normalizeError }
}