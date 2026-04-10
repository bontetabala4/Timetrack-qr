import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'

type GoogleAuthContext = HttpContext & { ally: any }

export default class GoogleAuthController {
  async redirect({ ally }: GoogleAuthContext) {
    return ally.use('google').redirect((request: any) => {
      request.param('prompt', 'select_account')
      request.param('access_type', 'offline')
    })
  }

  async callback({ ally, response, request }: GoogleAuthContext) {
    const google = ally.use('google')

    if (google.accessDenied()) {
      return response.redirect().toPath('/?error=google_access_denied')
    }

    if (google.stateMisMatch()) {
      return response.redirect().toPath('/?error=google_state_mismatch')
    }

    if (google.hasError()) {
      return response.redirect().toPath(`/?error=${encodeURIComponent(google.getError() || 'google_error')}`)
    }

    const googleUser = await google.user()

    const user = await User.firstOrCreate(
      { email: googleUser.email! },
      {
        fullName: googleUser.name || googleUser.nickName || 'Utilisateur Google',
        email: googleUser.email!,
        password: null,
        role: 'user',
        status: 'active',
        authProvider: 'google',
        googleId: googleUser.id,
        avatarUrl: googleUser.avatarUrl || null,
        department: null,
        phone: null,
      }
    )

    if (!user.googleId) {
      user.googleId = googleUser.id
      user.avatarUrl = googleUser.avatarUrl || user.avatarUrl
      user.authProvider = 'google'
      await user.save()
    }

    if (user.status !== 'active') {
      return response.redirect().toPath('/?error=account_suspended')
    }

    const token = await User.accessTokens.create(user, ['*'], {
      name: 'google-login-token',
    })

    const frontendUrl = request.completeUrl().includes('localhost')
      ? 'http://localhost:5173'
      : process.env.FRONTEND_URL || 'http://localhost:5173'

    return response.redirect().toPath(
      `${frontendUrl}/auth/callback?token=${encodeURIComponent(token.value!.release())}&role=${user.role}`
    )
  }
}