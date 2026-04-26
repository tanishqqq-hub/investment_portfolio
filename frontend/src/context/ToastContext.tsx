import {
  createContext,
  useCallback,
  useContext,
  useReducer,
  type ReactNode,
} from 'react'

type ToastVariant = 'success' | 'error' | 'info'

interface Toast {
  id:      string
  message: string
  variant: ToastVariant
}

interface ToastContextValue {
  toasts:      Toast[]
  addToast:    (message: string, variant?: ToastVariant) => void
  removeToast: (id: string) => void
}

type Action =
  | { type: 'ADD';    toast: Toast }
  | { type: 'REMOVE'; id: string }

function reducer(state: Toast[], action: Action): Toast[] {
  if (action.type === 'ADD')    return [...state, action.toast]
  if (action.type === 'REMOVE') return state.filter((t) => t.id !== action.id)
  return state
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, dispatch] = useReducer(reducer, [])

  const removeToast = useCallback((id: string) => {
    dispatch({ type: 'REMOVE', id })
  }, [])

  const addToast = useCallback(
    (message: string, variant: ToastVariant = 'info') => {
      const id = crypto.randomUUID()
      dispatch({ type: 'ADD', toast: { id, message, variant } })
      setTimeout(() => removeToast(id), 5000)
    },
    [removeToast]
  )

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  )
}

export function useToastContext(): ToastContextValue {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToastContext must be used within ToastProvider')
  return ctx
}

// ── Toast UI ──────────────────────────────────────────────────────────────────
const ICON: Record<ToastVariant, JSX.Element> = {
  success: (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 shrink-0" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  ),
  error: (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 shrink-0" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  ),
  info: (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 shrink-0" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4m0-4h.01" />
    </svg>
  ),
}

const STYLE: Record<ToastVariant, { iconColor: string; borderColor: string }> = {
  success: { iconColor: 'text-success-500', borderColor: 'border-l-success-500' },
  error:   { iconColor: 'text-danger-500',  borderColor: 'border-l-danger-500' },
  info:    { iconColor: 'text-cyan-500',    borderColor: 'border-l-cyan-500' },
}

function ToastContainer({ toasts, onRemove }: { toasts: Toast[]; onRemove: (id: string) => void }) {
  return (
    <div aria-live="polite" className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
      {toasts.map((t) => {
        const style = STYLE[t.variant]
        return (
          <div
            key={t.id}
            role="alert"
            className={`pointer-events-auto flex items-stretch overflow-hidden rounded-xl border border-dark-border border-l-4
                        bg-dark-card shadow-card min-w-[320px] max-w-sm animate-slide-up ${style.borderColor}`}
          >
            <div className={`flex items-center justify-center px-4 ${style.iconColor}`}>
              {ICON[t.variant]}
            </div>
            <div className="flex-1 px-4 py-3">
              <span className="text-sm font-semibold text-white">{t.message}</span>
            </div>
            <button
              onClick={() => onRemove(t.id)}
              className="flex items-center justify-center px-4 text-muted hover:text-white hover:bg-dark-hover transition-colors"
              aria-label="Dismiss"
            >
              <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        )
      })}
    </div>
  )
}