import { describe, it, expect, beforeEach } from 'vitest'
import { useAuthStore } from '@/app/store'

describe('useAuthStore', () => {
  beforeEach(() => {
    useAuthStore.setState({ accessToken: null, isAuthenticated: false })
  })

  it('initializes with no token and unauthenticated', () => {
    const state = useAuthStore.getState()
    expect(state.accessToken).toBeNull()
    expect(state.isAuthenticated).toBe(false)
  })

  it('setToken stores token and marks authenticated', () => {
    useAuthStore.getState().setToken('my.jwt.token')
    const state = useAuthStore.getState()
    expect(state.accessToken).toBe('my.jwt.token')
    expect(state.isAuthenticated).toBe(true)
  })

  it('clearToken removes token and marks unauthenticated', () => {
    useAuthStore.getState().setToken('my.jwt.token')
    useAuthStore.getState().clearToken()
    const state = useAuthStore.getState()
    expect(state.accessToken).toBeNull()
    expect(state.isAuthenticated).toBe(false)
  })
})