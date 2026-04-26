import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { axiosInstance } from '@/api/axios'
import { portfolioResponseSchema } from '@/schemas/portfolio.schema'
import { normalizeError } from '@/utils/errorHandler'
import { useToast } from './useToast'
import type { PortfolioFormData } from '@/schemas/dashboard.schema'
import type { PortfolioResponse } from '@/types/portfolio.types'

const MAX_RETRIES = 2

export function usePortfolio() {
  const [data, setData]       = useState<PortfolioResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState<string | null>(null)
  const navigate              = useNavigate()
  const toast                 = useToast()

  const generate = useCallback(
    async (payload: PortfolioFormData) => {
      setLoading(true)
      setError(null)

      let attempt = 0

      while (attempt <= MAX_RETRIES) {
        try {
          // ✅ FIXED PAYLOAD FORMAT FOR BACKEND
          const { data: raw } = await axiosInstance.post(
            '/generate-portfolio',
            {
              risk_level: payload.risk_level,
              investment_amount: Number(payload.amount),
              investment_type: payload.investment_type,
              duration_years: Number(payload.duration),
              liquidity_need: payload.liquidity_need,
              existing_investment: payload.existing_investment?.trim() || 'None',
            }
          )

          // Validate API response with Zod before use
          const parsed = portfolioResponseSchema.safeParse(raw)
          if (!parsed.success) {
            throw new Error('Invalid response from server. Please try again.')
          }

          // Filter out null allocations
          const cleaned: PortfolioResponse = {
            ...parsed.data,
            portfolio: parsed.data.portfolio.filter(
              (item) => item.allocation_pct !== null
            ),
          }

          setData(cleaned)
          navigate('/portfolio', { state: { portfolio: cleaned } })
          return
        } catch (err) {
          const normalized = normalizeError(err)

          // Only retry on network errors (status 0)
          if (normalized.status !== 0 || attempt === MAX_RETRIES) {
            setError(normalized.message)
            toast.error(normalized.message)
            setLoading(false)
            return
          }

          attempt++
          toast.info(`Connection issue, retrying… (${attempt}/${MAX_RETRIES})`)
          await new Promise((r) => setTimeout(r, 1000 * attempt))
        }
      }

      setLoading(false)
    },
    [navigate, toast]
  )

  return { generate, data, loading, error }
}