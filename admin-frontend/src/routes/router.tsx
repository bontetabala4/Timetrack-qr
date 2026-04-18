import { createBrowserRouter } from 'react-router-dom'
import Login from '../pages/auth/Login'
import Register from '../pages/auth/Register'
import ForgotPassword from '../pages/auth/ForgotPassword'
import ResetPassword from '../pages/auth/ResetPassword'
import Dashboard from '../pages/admin/Dashboard'
import Users from '../pages/admin/Users'
import Reports from '../pages/admin/Reports'
import QrCodes from '../pages/admin/QrCodes'
import Notifications from '../pages/admin/Notifications'
import Profile from '../pages/admin/Profile'
import ProtectedRoute from '../guards/ProtectedRoute'
import GuestRoute from '../guards/GuestRoute'
import ErrorPage from '../pages/ErrorPage'


export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <GuestRoute>
        <Login />
      </GuestRoute>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: '/register',
    element: (
      <GuestRoute>
        <Register />
      </GuestRoute>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: '/forgot-password',
    element: (
      <GuestRoute>
        <ForgotPassword />
      </GuestRoute>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: '/reset-password',
    element: (
      <GuestRoute>
        <ResetPassword />
      </GuestRoute>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: '/admin/dashboard',
    element: (
      <ProtectedRoute allowedRoles={['admin']}>
        <Dashboard />
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: '/admin/users',
    element: (
      <ProtectedRoute allowedRoles={['admin']}>
        <Users />
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: '/admin/reports',
    element: (
      <ProtectedRoute allowedRoles={['admin']}>
        <Reports />
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: '/admin/qrcodes',
    element: (
      <ProtectedRoute allowedRoles={['admin']}>
        <QrCodes />
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: '/admin/notifications',
    element: (
      <ProtectedRoute allowedRoles={['admin']}>
        <Notifications />
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: '/admin/profile',
    element: (
      <ProtectedRoute allowedRoles={['admin']}>
        <Profile />
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: '*',
    element: <ErrorPage />,
  },
])