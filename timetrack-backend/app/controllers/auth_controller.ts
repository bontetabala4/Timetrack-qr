import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import Organization from '#models/organization'
import PasswordResetToken from '#models/password_reset_token'
import { loginValidator } from '#validators/login_validator'
import { registerValidator } from '#validators/register_validator'
import { DateTime } from 'luxon'
import crypto from 'node:crypto'
import hash from '@adonisjs/core/services/hash'
import env from '#start/env'
import mail from '@adonisjs/mail/services/main'

export default class AuthController {
async register({ request, response }: HttpContext) {
  const data = await request.validateUsing(registerValidator)

  const existingUserByEmail = await User.findBy('email', data.email)

  if (existingUserByEmail) {
    return response.conflict({
      message: 'Cet email est déjà utilisé',
    })
  }

  if (data.role === 'admin') {
    if (!data.organizationName || !data.organizationType) {
      return response.badRequest({
        message:
          "Le nom et le type de l'organisation sont obligatoires pour créer un compte admin.",
      })
    }

    const organization = await Organization.create({
      name: data.organizationName,
      type: data.organizationType,
      email: data.organizationEmail ?? null,
      phone: data.organizationPhone ?? null,
      address: data.organizationAddress ?? null,
    })

    const user = await User.create({
      fullName: data.fullName,
      email: data.email,
      password: data.password,
      role: 'admin',
      status: 'active',
      department: data.department ?? null,
      phone: data.phone ?? null,
      authProvider: 'local',
      organizationId: organization.id,
    })

    const token = await User.accessTokens.create(user, ['*'], {
      name: 'admin-token',
    })

    return response.status(201).send({
      message: 'Compte administrateur et organisation créés avec succès',
      user,
      organization,
      token: token.value!.release(),
      tokenType: 'Bearer',
    })
  }

  const user = await User.create({
    fullName: data.fullName,
    email: data.email,
    password: data.password,
    role: data.role ?? 'user',
    status: 'active',
    department: data.department ?? null,
    phone: data.phone ?? null,
    authProvider: 'local',
    organizationId: null,
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
}

  async login({ request, response }: HttpContext) {
    const data = await request.validateUsing(loginValidator)

    const user = await User.verifyCredentials(data.email, data.password)

    if (user.status !== 'active') {
      return response.forbidden({
        message: 'Compte suspendu',
      })
    }

    if (user.role !== 'admin') {
      return response.forbidden({
        message: 'Cet espace est réservé aux administrateurs',
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
        organizationId: auth.user!.organizationId,
      },
    })
  }

  async logout({ auth, response }: HttpContext) {
    const authenticatedUser = await auth.authenticateUsing(['api'])

    const currentToken =
      authenticatedUser && 'currentAccessToken' in authenticatedUser
        ? authenticatedUser.currentAccessToken
        : null

    if (currentToken) {
      await User.accessTokens.delete(authenticatedUser, currentToken.identifier)
    }

    return response.ok({
      message: 'Déconnexion réussie',
    })
  }

  async forgotPassword({ request, response }: HttpContext) {
  const email = request.input('email') as string

  const user = await User.findBy('email', email)

  if (!user || user.role !== 'admin') {
    return response.ok({
      message: 'Si ce compte existe, un lien a été envoyé',
    })
  }

  const token = crypto.randomUUID()

  await PasswordResetToken.query().where('user_id', user.id).delete()

  await PasswordResetToken.create({
    userId: user.id,
    token,
    expiresAt: DateTime.now().plus({ hours: 1 }),
  })

  const resetUrl = `${env.get('ADMIN_FRONTEND_URL')}/reset-password?token=${token}`

  await mail.send((message: any) => {
    message
      .to(user.email)
      .subject('Réinitialisation du mot de passe TimeTrack')
      .html(`
        <p>Bonjour ${user.fullName},</p>
        <p>Clique sur ce lien pour réinitialiser ton mot de passe :</p>
        <p><a href="${resetUrl}">${resetUrl}</a></p>
        <p>Ce lien expire dans 1 heure.</p>
      `)
  })

  return response.ok({
    message: 'Si ce compte existe, un lien a été envoyé',
  })
}

  async resetPassword({ request, response }: HttpContext) {
    const token = request.input('token') as string
    const password = request.input('password') as string

    const resetToken = await PasswordResetToken.findBy('token', token)

    if (!resetToken) {
      return response.badRequest({ message: 'Lien invalide' })
    }

    if (resetToken.expiresAt < DateTime.now()) {
      await resetToken.delete()
      return response.badRequest({ message: 'Lien expiré' })
    }

    const user = await User.findOrFail(resetToken.userId)

    user.password = await hash.make(password)
    await user.save()

    await resetToken.delete()

    return response.ok({
      message: 'Mot de passe réinitialisé avec succès',
    })
  }
}