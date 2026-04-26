import type { AxiosError, InternalAxiosRequestConfig } from 'axios'
import { axiosInstance } from './axios'
import { useAuthStore } from '@/app/store'

interface QueueItem {
  resolve: (token: string) => void
  reject:  (error: unknown) => void
}

let isRefreshing = false
let failedQueue: QueueItem[] = []

const processQueue = (error: unknown, token: string | null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (token) resolve(token)
    else reject(error)
  })
  failedQueue = []
}

export function setupInterceptors() {
  // ── Request: attach Bearer token ──────────────────────────────────────
  axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = useAuthStore.getState().accessToken
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    },
    (error: unknown) => Promise.reject(error)
  )

  // ── Response: silent refresh on 401 ───────────────────────────────────
  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & {
        _retry?: boolean
      }

      if (error.response?.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          return new Promise<string>((resolve, reject) => {
            failedQueue.push({ resolve, reject })
          })
            .then((token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`
              return axiosInstance(originalRequest)
            })
            .catch((err: unknown) => Promise.reject(err))
        }

        originalRequest._retry = true
        isRefreshing = true

        try {
          const { data } = await axiosInstance.post<{ accessToken: string }>(
            '/refresh-token'
          )
          const newToken = data.accessToken
          useAuthStore.getState().setToken(newToken)
          originalRequest.headers.Authorization = `Bearer ${newToken}`
          processQueue(null, newToken)
          return axiosInstance(originalRequest)
        } catch (refreshError) {
          processQueue(refreshError, null)
          useAuthStore.getState().clearToken()
          window.location.replace('/login')
          return Promise.reject(refreshError)
        } finally {
          isRefreshing = false
        }
      }

      return Promise.reject(error)
    }
  )
}