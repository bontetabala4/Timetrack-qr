import type { HttpContext } from '@adonisjs/core/http'
import { updateMeValidator } from '#validators/update_me_validator'

export default class UsersController {
  async updateMe({ auth, request, response }: HttpContext) {
    await auth.authenticateUsing(['api'])

    const user = auth.user!
    const payload = await request.validateUsing(updateMeValidator)

    if (payload.phone !== undefined) {
      user.phone = payload.phone
    }

    if (payload.address !== undefined) {
      user.address = payload.address
    }

    await user.save()

    return response.ok({
      message: 'Profil mis à jour avec succès',
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        status: user.status,
        department: user.department,
        phone: user.phone,
        address: user.address,
        employeeId: user.employeeId,
        avatarUrl: user.avatarUrl,
        authProvider: user.authProvider,
      },
    })
  }
}