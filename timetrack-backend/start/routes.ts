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



router.get('/', async () => {
  return { message: 'Bienvenue sur l\'API de Timetrack QR'   }
})
router.group(() => {
  router.post('/register', [AuthController, 'register'])
  router.post('/login', [AuthController, 'login'])

  router.get('/me', [AuthController, 'me']).use(middleware.auth({ guards: ['api'] }))
  router.post('/logout', [AuthController, 'logout']).use(middleware.auth({ guards: ['api'] }))

  router.get('/google/redirect', [GoogleAuthController, 'redirect'])
  router.get('/google/callback', [GoogleAuthController, 'callback'])
  
}).prefix('/api/auth')

router.group(() => {
  router.post('/scan', [AttendancesController, 'scan'])
  router.get('/me/history', [AttendancesController, 'myHistory'])
  router.get('/me/today', [AttendancesController, 'myToday'])
})
.prefix('/api/attendances')
.use(middleware.auth({ guards: ['api'] }))

router
    .put('/api/users/me', [UsersController, 'updateMe'])
    .use(middleware.auth({ guards: ['api'] }))