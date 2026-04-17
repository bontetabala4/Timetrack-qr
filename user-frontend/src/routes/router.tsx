import { createBrowserRouter, Navigate } from 'react-router-dom'
import Login from '../pages/auth/Login'
import AuthCallback from '../pages/auth/AuthCallback'
import Home from '../pages/user/Home'
import Scan from '../pages/user/Scan'
import History from '../pages/user/History'
import Profile from '../pages/user/Profile'
import Settings from '../pages/user/Settings'
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
    path: '/home',
    element: (
      <ProtectedRoute allowedRoles={['user']}>
        <Home />
      </ProtectedRoute>
    ),
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
  {
    path: '/settings',
    element: (
      <ProtectedRoute allowedRoles={['user']}>
        <Settings />
      </ProtectedRoute>
    ),
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
])