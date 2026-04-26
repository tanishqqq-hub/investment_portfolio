import { describe, it, expect } from 'vitest'
import { formatPercent, formatCurrency } from '@/utils/formatters'
import { normalizeError } from '@/utils/errorHandler'

describe('formatPercent', () => {
  it('formats number to percent string with 1 decimal', () => {
    expect(formatPercent(25.5)).toBe('25.5%')
  })

  it('formats with custom decimal places', () => {
    expect(formatPercent(25.555, 2)).toBe('25.56%')
  })

  it('formats zero correctly', () => {
    expect(formatPercent(0)).toBe('0.0%')
  })
})

describe('formatCurrency', () => {
  it('formats number as USD', () => {
    expect(formatCurrency(50000)).toBe('$50,000')
  })

  it('formats large numbers correctly', () => {
    expect(formatCurrency(1000000)).toBe('$1,000,000')
  })
})

describe('normalizeError', () => {
  it('returns message from axios response data', () => {
    const err = {
      response: { status: 400, data: { message: 'Bad request' } },
      request:  {},
    }
    const result = normalizeError(err)
    expect(result.message).toBe('Bad request')
    expect(result.status).toBe(400)
  })

  it('returns network error for no response', () => {
    const err = { request: {}, response: undefined }
    const result = normalizeError(err)
    expect(result.status).toBe(0)
    expect(result.message).toContain('Network error')
  })

  it('handles plain Error instances', () => {
    const result = normalizeError(new Error('Something broke'))
    expect(result.message).toBe('Something broke')
  })

  it('handles unknown errors gracefully', () => {
    const result = normalizeError('totally unknown')
    expect(result.message).toBe('An unexpected error occurred.')
  })

  it('extracts message from FastAPI validation detail arrays', () => {
    const err = {
      response: {
        status: 422,
        data: {
          detail: [
            {
              type: 'missing',
              loc: ['body', 'existing_investment'],
              msg: 'Field required',
            },
          ],
        },
      },
      request: {},
    }

    const result = normalizeError(err)
    expect(result.status).toBe(422)
    expect(result.message).toBe('Field required')
  })

  it('falls back to status message when detail is not parseable', () => {
    const err = {
      response: { status: 500, data: { detail: { nested: true } } },
      request: {},
    }

    const result = normalizeError(err)
    expect(result.message).toBe('Request failed with status 500')
  })
})