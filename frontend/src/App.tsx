import type { ErrorInfo, ReactNode } from 'react'
import { Component } from 'react'

interface Props   { children: ReactNode }
interface State   { hasError: boolean; message: string }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, message: '' }

  static getDerivedStateFromError(error: unknown): State {
    const message =
      error instanceof Error ? error.message : 'An unexpected error occurred.'
    return { hasError: true, message }
  }

  componentDidCatch(error: unknown, info: ErrorInfo) {
    console.error('[ErrorBoundary]', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-surface p-6">
          <div className="rounded-card bg-white p-8 shadow-card text-center max-w-md w-full">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Something went wrong
            </h1>
            <p className="text-sm text-gray-500 mb-6">{this.state.message}</p>
            <button
              onClick={() => window.location.replace('/')}
              className="rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-medium text-white
                         hover:bg-primary-700 transition-colors"
            >
              Return to Home
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}