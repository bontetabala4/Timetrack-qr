import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

type GuestRouteProps = {
  children: ReactNode
}

export default function GuestRoute({ children }: GuestRouteProps) {
  const { user, isAuthenticated, token } = useAuth()

  if (isAuthenticated && token && user) {
    if (user.role === 'admin') {
      return <Navigate to="/admin/dashboard" replace />
    }

    return <Navigate to="/" replace />
  }

  return <>{children}</>
}