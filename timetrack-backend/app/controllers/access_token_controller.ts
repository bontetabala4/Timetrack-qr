import User from '#models/user'
import { loginValidator } from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'
import UserTransformer from '#transformers/user_transformer'

export default class AccessTokenController {
  async store({ request, response }: HttpContext) {
    const { email, password } = await request.validateUsing(loginValidator)

    const user = await User.verifyCredentials(email, password)
    const token = await User.accessTokens.create(user)

    return response.ok({
      user: UserTransformer.transform(user),
      token: token.value!.release(),
    })
  }

  async destroy({ auth, response }: HttpContext) {
    await auth.authenticateUsing(['api'])

    const user = auth.user

    if (!user) {
      return response.unauthorized({
        message: 'Utilisateur non authentifié',
      })
    }

    const accessToken = user.currentAccessToken

    if (!accessToken) {
      return response.badRequest({
        message: 'Aucun token actif trouvé',
      })
    }

    await User.accessTokens.delete(user, accessToken.identifier)

    return response.ok({
      message: 'Déconnexion réussie',
    })
  }
}