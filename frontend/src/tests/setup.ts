import '@testing-library/jest-dom'
import { afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'

// Clean up after each test
afterEach(() => {
  cleanup()
})

// Mock window.location.replace (used in interceptors on auth failure)
Object.defineProperty(window, 'location', {
  value: { replace: vi.fn() },
  writable: true,
})

// Mock crypto.randomUUID (used in ToastContext)
Object.defineProperty(globalThis, 'crypto', {
  value: { randomUUID: () => 'test-uuid-1234' },
})