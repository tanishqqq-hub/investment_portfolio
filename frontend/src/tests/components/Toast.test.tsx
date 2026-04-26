import { describe, it, expect, vi } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ToastProvider } from '@/context/ToastContext'
import { useToast } from '@/hooks/useToast'

function ToastTrigger() {
  const toast = useToast()
  return (
    <div>
      <button onClick={() => toast.success('Saved!')}>Success</button>
      <button onClick={() => toast.error('Failed!')}>Error</button>
      <button onClick={() => toast.info('Info message')}>Info</button>
    </div>
  )
}

function renderWithToast() {
  return render(
    <ToastProvider>
      <ToastTrigger />
    </ToastProvider>
  )
}

describe('Toast system', () => {
  it('shows success toast when triggered', async () => {
    renderWithToast()
    await userEvent.click(screen.getByText('Success'))
    expect(screen.getByRole('alert')).toHaveTextContent('Saved!')
  })

  it('shows error toast when triggered', async () => {
    renderWithToast()
    await userEvent.click(screen.getByText('Error'))
    expect(screen.getByRole('alert')).toHaveTextContent('Failed!')
  })

  it('dismisses toast when close button clicked', async () => {
    renderWithToast()
    await userEvent.click(screen.getByText('Success'))
    const dismiss = screen.getByRole('button', { name: /dismiss/i })
    await userEvent.click(dismiss)
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('auto-dismisses toast after 4 seconds', async () => {
    vi.useFakeTimers()
    renderWithToast()
    await userEvent.click(screen.getByText('Info'))
    expect(screen.getByRole('alert')).toBeInTheDocument()
    act(() => vi.advanceTimersByTime(4100))
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    vi.useRealTimers()
  })
})