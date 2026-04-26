import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from '@/components/ui/Button'

describe('Button', () => {
  it('renders children', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument()
  })

  it('calls onClick when clicked', async () => {
    const handler = vi.fn()
    render(<Button onClick={handler}>Click</Button>)
    await userEvent.click(screen.getByRole('button'))
    expect(handler).toHaveBeenCalledTimes(1)
  })

  it('is disabled when loading is true', () => {
    render(<Button loading>Submit</Button>)
    const btn = screen.getByRole('button')
    expect(btn).toBeDisabled()
    expect(btn).toHaveAttribute('aria-busy', 'true')
  })

  it('is disabled when disabled prop is passed', () => {
    render(<Button disabled>Submit</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('does not call onClick when disabled', async () => {
    const handler = vi.fn()
    render(<Button disabled onClick={handler}>Click</Button>)
    await userEvent.click(screen.getByRole('button'))
    expect(handler).not.toHaveBeenCalled()
  })

  it('applies primary variant classes by default', () => {
    render(<Button>Primary</Button>)
    expect(screen.getByRole('button')).toHaveClass('bg-primary-600')
  })

  it('applies secondary variant classes', () => {
    render(<Button variant="secondary">Secondary</Button>)
    expect(screen.getByRole('button')).toHaveClass('bg-white')
  })
})