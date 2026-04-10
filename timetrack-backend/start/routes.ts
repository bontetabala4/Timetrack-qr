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
