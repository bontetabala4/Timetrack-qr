import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import crypto from 'node:crypto'
import QrSession from '#models/qr_session'

export default class QrCodesController {
  async current({ auth, response }: HttpContext) {
    await auth.authenticateUsing(['api'])

    const currentUser = auth.user!

    if (!currentUser.organizationId) {
      return response.badRequest({
        message: "Aucune organisation liée à cet utilisateur",
      })
    }

    const now = DateTime.local()
    const startOfDay = now.startOf('day').toSQL()!
    const endOfDay = now.endOf('day').toSQL()!

    const qrSession = await QrSession.query()
      .where('organization_id', currentUser.organizationId)
      .where('is_active', true)
      .where('created_at', '>=', startOfDay)
      .where('created_at', '<=', endOfDay)
      .where('expires_at', '>', now.toSQL()!)
      .orderBy('id', 'desc')
      .first()

    return response.ok({
      qr: qrSession
        ? {
            id: qrSession.id,
            code: qrSession.code,
            expiresAt: qrSession.expiresAt.toISO(),
            activeFrom: qrSession.createdAt.set({
              hour: 7,
              minute: 30,
              second: 0,
              millisecond: 0,
            }).toISO(),
            date: qrSession.createdAt.toISODate(),
          }
        : null,
    })
  }

  async generate({ auth, response }: HttpContext) {
    await auth.authenticateUsing(['api'])

    const currentUser = auth.user!

    if (currentUser.role !== 'admin') {
      return response.forbidden({
        message: 'Accès refusé',
      })
    }

    if (!currentUser.organizationId) {
      return response.badRequest({
        message: "Aucune organisation liée à cet administrateur",
      })
    }

    const now = DateTime.local()
    const qrActivationTime = now.set({
      hour: 7,
      minute: 30,
      second: 0,
      millisecond: 0,
    })

    if (now < qrActivationTime) {
      return response.badRequest({
        message: 'Le QR du jour devient actif à partir de 07h30.',
      })
    }

    const startOfDay = now.startOf('day').toSQL()!
    const endOfDay = now.endOf('day').toSQL()!

    const existingQr = await QrSession.query()
      .where('organization_id', currentUser.organizationId)
      .where('is_active', true)
      .where('created_at', '>=', startOfDay)
      .where('created_at', '<=', endOfDay)
      .where('expires_at', '>', now.toSQL()!)
      .orderBy('id', 'desc')
      .first()

    if (existingQr) {
      return response.ok({
        message: 'Le QR du jour existe déjà',
        qr: {
          id: existingQr.id,
          code: existingQr.code,
          expiresAt: existingQr.expiresAt.toISO(),
          activeFrom: qrActivationTime.toISO(),
          date: existingQr.createdAt.toISODate(),
        },
      })
    }

    await QrSession.query()
      .where('organization_id', currentUser.organizationId)
      .where('is_active', true)
      .update({ isActive: false })

    const code = crypto.randomUUID()
    const expiresAt = now.endOf('day')

    const qrSession = await QrSession.create({
      organizationId: currentUser.organizationId,
      code,
      isActive: true,
      expiresAt,
    })

    return response.ok({
      message: 'QR du jour généré avec succès',
      qr: {
        id: qrSession.id,
        code: qrSession.code,
        expiresAt: qrSession.expiresAt.toISO(),
        activeFrom: qrActivationTime.toISO(),
        date: qrSession.createdAt.toISODate(),
      },
    })
  }
}