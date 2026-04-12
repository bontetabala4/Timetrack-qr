import { createBrowserRouter } from 'react-router-dom'
import Login from '../pages/auth/Login'
import AuthCallback from '../pages/auth/AuthCallback'
import  Scan  from '../pages/user/Scan'
import History from '../pages/user/History'
import Profile from '../pages/user/Profile'
import ProtectedRoute from '../guards/ProtectedRoute'
import GuestRoute from '../guards/GuestRoute'

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <GuestRoute>
        <Login />
      </GuestRoute>
    ),
  },
  {
    path: '/auth/callback',
    element: <AuthCallback />,
  },
  {
    path: '/scan',
    element: (
      <ProtectedRoute allowedRoles={['user']}>
        <Scan />
      </ProtectedRoute>
    ),
  },
  {
    path: '/history',
    element: (
      <ProtectedRoute allowedRoles={['user']}>
        <History />
      </ProtectedRoute>
    ),
  },
  {
    path: '/profile',
    element: (
      <ProtectedRoute allowedRoles={['user']}>
        <Profile />
      </ProtectedRoute>
    ),
  },
])