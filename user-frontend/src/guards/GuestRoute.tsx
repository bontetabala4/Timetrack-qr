import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function GuestRoute({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isAuthenticated } = useAuth()

  if (isAuthenticated && user) {
    return <Navigate to="/scan" replace />
  }

  return <>{children}</>
}