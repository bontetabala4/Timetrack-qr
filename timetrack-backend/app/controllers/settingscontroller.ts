import type { HttpContext } from '@adonisjs/core/http'
import hash from '@adonisjs/core/services/hash'
import app from '@adonisjs/core/services/app'
import { randomUUID } from 'node:crypto'
import { changePasswordValidator } from '#validators/change_password_validator'

export default class SettingsController {
  async changePassword({ auth, request, response }: HttpContext) {
    await auth.authenticateUsing(['api'])

    const user = auth.user!
    const payload = await request.validateUsing(changePasswordValidator)

    if (!user.password) {
      return response.badRequest({
        message:
          "Ce compte n'utilise pas de mot de passe local. Connecte-toi avec Google.",
      })
    }

    const isCurrentPasswordValid = await hash.verify(
      user.password,
      payload.currentPassword
    )

    if (!isCurrentPasswordValid) {
      return response.badRequest({
        message: 'Mot de passe actuel incorrect',
      })
    }

    const isSamePassword = await hash.verify(user.password, payload.newPassword)

    if (isSamePassword) {
      return response.badRequest({
        message: "Le nouveau mot de passe doit être différent de l'ancien",
      })
    }

    user.password = payload.newPassword
    await user.save()

    return response.ok({
      message: 'Mot de passe mis à jour avec succès',
    })
  }

  async uploadAvatar({ auth, request, response }: HttpContext) {
    await auth.authenticateUsing(['api'])

    const user = auth.user!

    const avatar = request.file('avatar', {
      size: '2mb',
      extnames: ['jpg', 'jpeg', 'png', 'webp'],
    })

    if (!avatar) {
      return response.badRequest({
        message: 'Aucune image envoyée',
      })
    }

    if (avatar.hasErrors) {
      return response.badRequest({
        message: 'Fichier invalide',
        errors: avatar.errors,
      })
    }

    const fileName = `${randomUUID()}.${avatar.extname}`

    await avatar.move(app.makePath('public/uploads'), {
      name: fileName,
      overwrite: true,
    })

    if (avatar.hasErrors) {
      return response.internalServerError({
        message: "Erreur lors de l'envoi de l'image",
        errors: avatar.errors,
      })
    }

    user.avatarUrl = `/uploads/${fileName}`
    await user.save()

    return response.ok({
      message: 'Photo mise à jour avec succès',
      avatarUrl: user.avatarUrl,
    })
  }
}