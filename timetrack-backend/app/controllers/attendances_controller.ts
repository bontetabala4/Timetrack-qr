import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import Attendance from '#models/attendance'
import { scanAttendanceValidator } from '#validators/scan_attendance_validator'

export default class AttendancesController {
  async scan({ auth, request, response }: HttpContext) {
    await auth.authenticateUsing(['api'])

    const user = auth.user!
    const payload = await request.validateUsing(scanAttendanceValidator)

    const now = DateTime.local()
    const attendanceDate = now.toISODate()!
    const lateLimitHour = 8
    const lateLimitMinute = 30

    let attendance = await Attendance.query()
      .where('user_id', user.id)
      .where('attendance_date', attendanceDate)
      .first()

    if (attendance?.checkInTime) {
      return response.conflict({
        message: 'La présence du jour est déjà enregistrée',
        attendance,
      })
    }

    const isLate =
      now.hour > lateLimitHour ||
      (now.hour === lateLimitHour && now.minute > lateLimitMinute)

    let lateMinutes = 0
    if (isLate) {
      const lateBase = now.set({
        hour: lateLimitHour,
        minute: lateLimitMinute,
        second: 0,
        millisecond: 0,
      })
      lateMinutes = Math.max(0, Math.floor(now.diff(lateBase, 'minutes').minutes))
    }

    if (!attendance) {
      attendance = await Attendance.create({
        userId: user.id,
        attendanceDate: DateTime.fromISO(attendanceDate),
        checkInTime: now,
        checkOutTime: null,
        status: isLate ? 'late' : 'present',
        lateMinutes,
        scanCode: payload.scanCode,
      })
    } else {
      attendance.checkInTime = now
      attendance.status = isLate ? 'late' : 'present'
      attendance.lateMinutes = lateMinutes
      attendance.scanCode = payload.scanCode
      await attendance.save()
    }

    return response.ok({
      message: 'Présence enregistrée avec succès',
      attendance,
    })
  }

  async myHistory({ auth, request, response }: HttpContext) {
    await auth.authenticateUsing(['api'])

    const user = auth.user!
    const page = Number(request.input('page', 1))
    const limit = Number(request.input('limit', 20))

    const attendances = await Attendance.query()
      .where('user_id', user.id)
      .orderBy('attendance_date', 'desc')
      .paginate(page, limit)

    return response.ok(attendances)
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
      attendance,
    })
  }
}