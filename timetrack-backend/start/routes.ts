/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const AuthController = () => import('#controllers/auth_controller')
const GoogleAuthController = () => import('#controllers/google_auth_controller')
const AttendancesController = () => import('#controllers/attendances_controller')
const UsersController = () => import('#controllers/users_controller')
const QrCodesController = () => import('#controllers/qr_codes_controller')
const SettingsController = () => import('#controllers/settingscontroller')

router.get('/', async () => {
  return { message: "Bienvenue sur l'API de Timetrack QR" }
})

router
  .group(() => {
    router.post('/register', [AuthController, 'register'])
    router.post('/login', [AuthController, 'login'])
    router.post('/forgot-password', [AuthController, 'forgotPassword'])
    router.post('/reset-password', [AuthController, 'resetPassword'])

    router
      .get('/me', [AuthController, 'me'])
      .use(middleware.auth({ guards: ['api'] }))

    router
      .post('/logout', [AuthController, 'logout'])
      .use(middleware.auth({ guards: ['api'] }))

    router.get('/google/redirect', [GoogleAuthController, 'redirect'])
    router.get('/google/callback', [GoogleAuthController, 'callback'])
  })
  .prefix('/api/auth')

router
  .group(() => {
    router.post('/scan', [AttendancesController, 'scan'])
    router.get('/me/history', [AttendancesController, 'myHistory'])
    router.get('/me/today', [AttendancesController, 'myToday'])
  })
  .prefix('/api/attendances')
  .use(middleware.auth({ guards: ['api'] }))

router
  .group(() => {
    router.get('/dashboard', [UsersController, 'dashboard'])
    router.get('/notifications', [UsersController, 'notifications'])
    router.get('/users', [UsersController, 'index'])
    router.get('/users/:id', [UsersController, 'show'])
    router.put('/users/:id', [UsersController, 'update'])
    router.delete('/users/:id', [UsersController, 'destroy'])
    router.post('/users', [UsersController, 'store'])
    router.get('/reports', [UsersController, 'reports'])
    router.get('/dashboard/charts', [UsersController, 'dashboardCharts'])
  })
  .prefix('/api/admin')
  .use(middleware.auth({ guards: ['api'] }))

router
  .put('/api/users/me', [UsersController, 'updateMe'])
  .use(middleware.auth({ guards: ['api'] }))

router
  .group(() => {
    router.get('/current', [QrCodesController, 'current'])
    router.post('/generate', [QrCodesController, 'generate'])
  })
  .prefix('/api/qrcodes')
  .use(middleware.auth({ guards: ['api'] }))

router
  .group(() => {
    router.post('/api/settings/change-password', [SettingsController, 'changePassword'])
    router.post('/api/settings/avatar', [SettingsController, 'uploadAvatar'])
  })
  .use(middleware.auth({ guards: ['api'] }))