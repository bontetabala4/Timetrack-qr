import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { loginValidator } from '#validators/login_validator'
import { registerValidator } from '#validators/register_validator'

export default class AuthController {
  async register({ request, response }: HttpContext) {
    try {
      const data = await request.validateUsing(registerValidator)

      const user = await User.create({
        fullName: data.fullName,
        email: data.email,
        password: data.password,
        role: (data.role ?? 'user') as 'admin' | 'user',
        status: 'active',
        department: data.department ?? null,
        phone: data.phone ?? null,
      })

      const token = await User.accessTokens.create(user, ['*'], {
        name: `${user.role}-token`,
      })

      return response.status(201).send({
        message: 'Compte créé avec succès',
        user,
        token: token.value!.release(),
        tokenType: 'Bearer',
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      return response.badRequest({
        message: 'Erreur lors de la création du compte',
        error: message,
      })
    }
  }

  async login({ request, response }: HttpContext) {
    try {
      const data = await request.validateUsing(loginValidator)

      const user = await User.verifyCredentials(data.email, data.password)

      if (user.status !== 'active') {
        return response.forbidden({
          message: 'Compte suspendu',
        })
      }

      const token = await User.accessTokens.create(user, ['*'], {
        name: `${user.role}-token`,
      })

      return response.ok({
        message: 'Connexion réussie',
        user,
        token: token.value!.release(),
        tokenType: 'Bearer',
      })
    } catch (error) {
      return response.unauthorized({
        message: 'Email ou mot de passe incorrect',
      })
    }
  }

async me({ auth, response }: HttpContext) {
  await auth.authenticateUsing(['api'])

  return response.ok({
    user: {
      id: auth.user!.id,
      fullName: auth.user!.fullName,
      email: auth.user!.email,
      role: auth.user!.role,
      status: auth.user!.status,
      department: auth.user!.department,
      phone: auth.user!.phone,
      address: auth.user!.address,
      employeeId: auth.user!.employeeId,
      avatarUrl: auth.user!.avatarUrl,
      authProvider: auth.user!.authProvider,
    },
  })
}

  async logout({ auth, response }: HttpContext) {
    try {
      await auth.authenticateUsing(['api'])

      const user = auth.user!

      if (!user || !('currentAccessToken' in user)) {
        return response.unauthorized({
          message: 'Utilisateur non authentifié',
        })
      }

      const currentToken = user.currentAccessToken

      if (currentToken) {
        await User.accessTokens.delete(user, currentToken.identifier)
      }

      return response.ok({
        message: 'Déconnexion réussie',
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      return response.unauthorized({
        message: 'Erreur lors de la déconnexion',
      })
    }
  }
}