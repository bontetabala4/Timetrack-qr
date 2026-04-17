import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import Attendance from '#models/attendance'
import QrSession from '#models/qr_session'
import Notification from '#models/notification'
import { scanAttendanceValidator } from '#validators/scan_attendance_validator'

export default class AttendancesController {
  async scan({ auth, request, response }: HttpContext) {
    await auth.authenticateUsing(['api'])

    const user = auth.user!
    const payload = await request.validateUsing(scanAttendanceValidator)

    if (!user.organizationId) {
      return response.badRequest({
        message: "Aucune organisation liée à cet utilisateur",
      })
    }

    const now = DateTime.local()
    const today = now.toISODate()!

    if (now.hour < 7 || (now.hour === 7 && now.minute < 30)) {
      return response.badRequest({
        message: 'Le QR n’est pas encore actif',
      })
    }

    const lateLimit = now.set({
      hour: 8,
      minute: 30,
      second: 0,
      millisecond: 0,
    })

    const activeQr = await QrSession.query()
      .where('organization_id', user.organizationId)
      .where('code', payload.scanCode)
      .where('is_active', true)
      .where('expires_at', '>', now.toSQL()!)
      .first()

    if (!activeQr) {
      return response.badRequest({
        message: 'QR code invalide ou expiré',
      })
    }

    if (activeQr.organizationId !== user.organizationId) {
      return response.forbidden({
        message: 'QR invalide pour cette organisation',
      })
    }

    const existingAttendance = await Attendance.query()
      .where('user_id', user.id)
      .where('attendance_date', today)
      .first()

    if (existingAttendance) {
      return response.badRequest({
        message: 'Présence déjà enregistrée pour aujourd’hui',
      })
    }

    const isLate = now > lateLimit
    const lateMinutes = isLate
      ? Math.max(0, Math.floor(now.diff(lateLimit, 'minutes').minutes))
      : 0
    const status: 'present' | 'late' = isLate ? 'late' : 'present'

    const attendance = await Attendance.create({
      userId: user.id,
      attendanceDate: DateTime.fromISO(today),
      checkInTime: now,
      status,
      lateMinutes,
    })

    if (attendance.status === 'late' && user.organizationId) {
      await Notification.create({
        organizationId: user.organizationId,
        type: 'late',
        message: `${user.fullName} est arrivé en retard`,
      })
    }

    return response.ok({
      message:
        status === 'late'
          ? 'Présence enregistrée avec retard'
          : 'Présence enregistrée avec succès',
      attendance: {
        id: attendance.id,
        status: attendance.status,
        lateMinutes: attendance.lateMinutes,
        checkInTime: attendance.checkInTime?.toISO() ?? null,
        attendanceDate: attendance.attendanceDate.toISODate(),
      },
    })
  }

  async myHistory({ auth, response }: HttpContext) {
    await auth.authenticateUsing(['api'])

    const user = auth.user!

    const attendances = await Attendance.query()
      .where('user_id', user.id)
      .orderBy('attendance_date', 'desc')
      .limit(30)

    return response.ok({
      items: attendances.map((attendance) => ({
        id: attendance.id,
        attendanceDate: attendance.attendanceDate.toISODate(),
        checkInTime: attendance.checkInTime?.toISO() ?? null,
        checkOutTime: attendance.checkOutTime?.toISO() ?? null,
        status: attendance.status,
        lateMinutes: attendance.lateMinutes,
      })),
    })
  }

  async myToday({ auth, response }: HttpContext) {
    await auth.authenticateUsing(['api'])

    const user = auth.user!
    const today = DateTime.local().toISODate()!

    const attendance = await Attendance.query()
      .where('user_id', user.id)
      .where('attendance_date', today)
      .first()

    return response.ok({
      attendance: attendance
        ? {
            id: attendance.id,
            attendanceDate: attendance.attendanceDate.toISODate(),
            checkInTime: attendance.checkInTime?.toISO() ?? null,
            checkOutTime: attendance.checkOutTime?.toISO() ?? null,
            status: attendance.status,
            lateMinutes: attendance.lateMinutes,
          }
        : null,
    })
  }
  
}