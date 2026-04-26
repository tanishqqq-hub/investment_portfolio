import { lazy, Suspense } from 'react'
import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from './store'
import { Skeleton } from '@/components/ui/Skeleton'

// Lazy-loaded pages
const Landing   = lazy(() => import('@/pages/Landing'))
const Login     = lazy(() => import('@/pages/Auth/Login'))
const SignUp    = lazy(() => import('@/pages/Auth/SignUp'))
const Dashboard = lazy(() => import('@/pages/Dashboard'))
const Portfolio = lazy(() => import('@/pages/Portfolio'))

// ── Route guards ──────────────────────────────────────────────────────────
const PageFallback = () => (
  <div className="flex min-h-screen items-center justify-center bg-surface">
    <Skeleton className="h-64 w-full max-w-lg rounded-card" />
  </div>
)

function PrivateRoute() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  return isAuthenticated ? (
    <Suspense fallback={<PageFallback />}>
      <Outlet />
    </Suspense>
  ) : (
    <Navigate to="/login" replace />
  )
}

function PublicOnlyRoute() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  return !isAuthenticated ? (
    <Suspense fallback={<PageFallback />}>
      <Outlet />
    </Suspense>
  ) : (
    <Navigate to="/dashboard" replace />
  )
}

// ── Router definition ─────────────────────────────────────────────────────
export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Suspense fallback={<PageFallback />}>
        <Landing />
      </Suspense>
    ),
  },
  {
    element: <PublicOnlyRoute />,
    children: [
      { path: '/login',  element: <Login /> },
      { path: '/signup', element: <SignUp /> },
    ],
  },
  {
    element: <PrivateRoute />,
    children: [
      { path: '/dashboard', element: <Dashboard /> },
      { path: '/portfolio', element: <Portfolio /> },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
])