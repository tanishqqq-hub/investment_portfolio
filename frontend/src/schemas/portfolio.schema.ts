import { z } from 'zod'

export const portfolioItemSchema = z.object({
  asset_name:     z.string(),
  asset_type:     z.string(),
  allocation_pct: z.number().nullable(),
})

export const portfolioResponseSchema = z.object({
  user_id:   z.number(),
  portfolio: z.array(portfolioItemSchema),
})

export type PortfolioItem     = z.infer<typeof portfolioItemSchema>
export type PortfolioResponse = z.infer<typeof portfolioResponseSchema>