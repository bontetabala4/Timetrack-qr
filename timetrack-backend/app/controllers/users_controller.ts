import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { updateMeValidator } from '#validators/update_me_validator'
import { adminUpdateUserValidator } from '#validators/admin_update_user_validator'
import { adminCreateUserValidator } from '#validators/admin_create_user_validator'
import Attendance from '#models/attendance'
import { DateTime } from 'luxon'
import QrSession from '#models/qr_session'

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
        organizationId: user.organizationId,
      },
    })
  }

  async index({ auth, request, response }: HttpContext) {
    await auth.authenticateUsing(['api'])

    const currentUser = auth.user!

    if (currentUser.role !== 'admin') {
      return response.forbidden({ message: 'Accès refusé' })
    }

    const page = Number(request.input('page', 1))
    const limit = Number(request.input('limit', 10))
    const search = request.input('search', '').trim()
    const role = request.input('role', '').trim()
    const status = request.input('status', '').trim()

    const query = User.query().orderBy('id', 'desc')

    if (search) {
      query.where((builder) => {
        builder
          .whereILike('full_name', `%${search}%`)
          .orWhereILike('email', `%${search}%`)
          .orWhereILike('employee_id', `%${search}%`)
      })
    }

    if (role) {
      query.where('role', role)
    }

    if (status) {
      query.where('status', status)
    }

    const users = await query.paginate(page, limit)

    return response.ok(users)
  }

  async show({ auth, params, response }: HttpContext) {
    await auth.authenticateUsing(['api'])

    const currentUser = auth.user!

    if (currentUser.role !== 'admin') {
      return response.forbidden({ message: 'Accès refusé' })
    }

    const user = await User.findOrFail(params.id)

    return response.ok({
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

  async update({ auth, params, request, response }: HttpContext) {
    await auth.authenticateUsing(['api'])

    const currentUser = auth.user!

    if (currentUser.role !== 'admin') {
      return response.forbidden({ message: 'Accès refusé' })
    }

    const user = await User.findOrFail(params.id)
    const payload = await request.validateUsing(adminUpdateUserValidator)

    if (payload.fullName !== undefined) user.fullName = payload.fullName
    if (payload.phone !== undefined) user.phone = payload.phone
    if (payload.address !== undefined) user.address = payload.address
    if (payload.department !== undefined) user.department = payload.department
    if (payload.employeeId !== undefined) user.employeeId = payload.employeeId
    if (payload.role !== undefined) user.role = payload.role
    if (payload.status !== undefined) user.status = payload.status

    await user.save()

    return response.ok({
      message: 'Utilisateur mis à jour avec succès',
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

  async destroy({ auth, params, response }: HttpContext) {
    await auth.authenticateUsing(['api'])

    const currentUser = auth.user!

    if (currentUser.role !== 'admin') {
      return response.forbidden({ message: 'Accès refusé' })
    }

    const user = await User.findOrFail(params.id)
    await user.delete()

    return response.ok({
      message: 'Utilisateur supprimé avec succès',
    })
  }

  

async dashboard({ auth, response }: HttpContext) {
  await auth.authenticateUsing(['api'])

  const currentUser = auth.user!

  if (currentUser.role !== 'admin') {
    return response.forbidden({ message: 'Accès refusé' })
  }

  if (!currentUser.organizationId) {
    return response.badRequest({
      message: "Aucune organisation liée à cet administrateur",
    })
  }

  await currentUser.load((loader) => loader.load('organization'))

  const today = DateTime.local().toISODate()!

  const totalUsersResult = await User.query()
    .where('organization_id', currentUser.organizationId)
    .count('* as total')

  const presentTodayResult = await Attendance.query()
    .where('attendance_date', today)
    .where('status', 'present')
    .whereHas('user', (query) => {
      query.where('organization_id', currentUser.organizationId!)
    })
    .count('* as total')

  const lateTodayResult = await Attendance.query()
    .where('attendance_date', today)
    .where('status', 'late')
    .whereHas('user', (query) => {
      query.where('organization_id', currentUser.organizationId!)
    })
    .count('* as total')

  const totalUsers = Number(totalUsersResult[0].$extras.total)
  const presentToday = Number(presentTodayResult[0].$extras.total)
  const lateToday = Number(lateTodayResult[0].$extras.total)
  const absentToday = Math.max(0, totalUsers - (presentToday + lateToday))

  const recentAttendances = await Attendance.query()
    .whereHas('user', (query) => {
      query.where('organization_id', currentUser.organizationId!)
    })
    .preload('user')
    .orderBy('created_at', 'desc')
    .limit(10)

  const activeQr = await (await import('#models/qr_session')).default.query()
    .where('organization_id', currentUser.organizationId)
    .where('is_active', true)
    .where('expires_at', '>', DateTime.now().toSQL()!)
    .orderBy('id', 'desc')
    .first()

  return response.ok({
    organization: currentUser.organization
      ? {
          id: currentUser.organization.id,
          name: currentUser.organization.name,
          type: currentUser.organization.type,
        }
      : null,
    stats: {
      totalUsers,
      presentToday,
      lateToday,
      absentToday,
    },
    activeQr: activeQr
      ? {
          id: activeQr.id,
          code: activeQr.code,
          expiresAt: activeQr.expiresAt.toISO(),
        }
      : null,
    recentAttendances: recentAttendances.map((attendance) => ({
      id: attendance.id,
      fullName: attendance.user?.fullName || 'Utilisateur',
      employeeId: attendance.user?.employeeId || null,
      department: attendance.user?.department || null,
      checkInTime: attendance.checkInTime?.toISO() ?? null,
      status: attendance.status,
    })),
  })
}

    async store({ auth, request, response }: HttpContext) {
    await auth.authenticateUsing(['api'])

    const currentUser = auth.user!

    if (currentUser.role !== 'admin') {
      return response.forbidden({ message: 'Accès refusé' })
    }

    if (!currentUser.organizationId) {
      return response.badRequest({
        message: "L'administrateur n'est lié à aucune organisation",
      })
    }

    const payload = await request.validateUsing(adminCreateUserValidator)

    const existingUser = await User.query()
      .where('organization_id', currentUser.organizationId)
      .where('employee_id', payload.employeeId)
      .first()

    if (existingUser) {
      return response.conflict({
        message: 'Ce matricule existe déjà dans votre organisation',
      })
    }

    const existingEmail = await User.findBy('email', payload.email)

    if (existingEmail) {
      return response.conflict({
        message: 'Cet email est déjà utilisé',
      })
    }

    const user = await User.create({
      fullName: payload.fullName,
      email: payload.email,
      password: null,
      googleId: null,
      avatarUrl: null,
      authProvider: 'local',
      role: payload.role ?? 'user',
      status: payload.status ?? 'active',
      department: payload.department ?? null,
      phone: payload.phone ?? null,
      address: payload.address ?? null,
      employeeId: payload.employeeId,
      organizationId: currentUser.organizationId,
    })

    return response.status(201).ok({
      message: 'Utilisateur créé avec succès',
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
        organizationId: user.organizationId,
      },
    })
  }

async notifications({ auth, response }: HttpContext) {
  await auth.authenticateUsing(['api'])

  const currentUser = auth.user!

  if (currentUser.role !== 'admin') {
    return response.forbidden({ message: 'Accès refusé' })
  }

  if (!currentUser.organizationId) {
    return response.badRequest({
      message: "Aucune organisation liée à cet administrateur",
    })
  }

  const today = DateTime.local().toISODate()!

  const recentUsers = await User.query()
    .where('organization_id', currentUser.organizationId)
    .orderBy('created_at', 'desc')
    .limit(3)

  const lateAttendances = await Attendance.query()
    .where('attendance_date', today)
    .where('status', 'late')
    .whereHas('user', (query) => {
      query.where('organization_id', currentUser.organizationId!)
    })
    .preload('user')
    .orderBy('created_at', 'desc')
    .limit(5)

  const activeQr = await QrSession.query()
    .where('organization_id', currentUser.organizationId)
    .where('is_active', true)
    .where('expires_at', '>', DateTime.now().toSQL()!)
    .orderBy('id', 'desc')
    .first()

  const notifications: Array<{
    id: string
    title: string
    description: string
    time: string
    type: 'info' | 'warning' | 'success'
    target: string
  }> = []

  recentUsers.forEach((user) => {
    notifications.push({
      id: `user-${user.id}`,
      title: 'Nouvel agent créé',
      description: `${user.fullName} a été ajouté à votre organisation.`,
      time: user.createdAt.toRelative() || 'Récemment',
      type: 'success',
      target: '/admin/users',
    })
  })

  lateAttendances.forEach((attendance) => {
    notifications.push({
      id: `late-${attendance.id}`,
      title: 'Retard détecté',
      description: `${attendance.user?.fullName || 'Utilisateur'} est arrivé en retard.`,
      time: attendance.createdAt.toRelative() || 'Aujourd’hui',
      type: 'warning',
      target: '/admin/reports',
    })
  })

  if (activeQr) {
    notifications.push({
      id: `qr-${activeQr.id}`,
      title: 'QR actif disponible',
      description: 'Un QR code actif est disponible pour votre organisation.',
      time: activeQr.createdAt.toRelative() || 'Récemment',
      type: 'info',
      target: '/admin/qrcodes',
    })
  }

  return response.ok({
    notifications,
  })
}

async reports({ auth, request, response }: HttpContext) {
  await auth.authenticateUsing(['api'])

  const currentUser = auth.user!

  if (currentUser.role !== 'admin') {
    return response.forbidden({ message: 'Accès refusé' })
  }

  if (!currentUser.organizationId) {
    return response.badRequest({
      message: "Aucune organisation liée à cet administrateur",
    })
  }

  const from = request.input('from')
  const to = request.input('to')

  const query = Attendance.query()
    .whereHas('user', (userQuery) => {
      userQuery.where('organization_id', currentUser.organizationId!)
    })
    .preload('user')
    .orderBy('attendance_date', 'desc')

  if (from) {
    query.where('attendance_date', '>=', from)
  }

  if (to) {
    query.where('attendance_date', '<=', to)
  }

  const items = await query.limit(100)

  const total = items.length
  const present = items.filter((item) => item.status === 'present').length
  const late = items.filter((item) => item.status === 'late').length
  const absent = items.filter((item) => item.status === 'absent').length

  return response.ok({
    stats: {
      total,
      present,
      late,
      absent,
    },
    items: items.map((item) => ({
      id: item.id,
      fullName: item.user?.fullName || 'Agent',
      email: item.user?.email || '',
      department: item.user?.department || null,
      employeeId: item.user?.employeeId || null,
      attendanceDate: item.attendanceDate.toISODate(),
      checkInTime: item.checkInTime?.toISO() ?? null,
      checkOutTime: item.checkOutTime?.toISO() ?? null,
      status: item.status,
      lateMinutes: item.lateMinutes,
    })),
  })
}

async dashboardCharts({ auth, response }: HttpContext) {
  await auth.authenticateUsing(['api'])

  const currentUser = auth.user!

  if (currentUser.role !== 'admin') {
    return response.forbidden({ message: 'Accès refusé' })
  }

  if (!currentUser.organizationId) {
    return response.badRequest({
      message: "Aucune organisation liée à cet administrateur",
    })
  }

  const today = DateTime.local()

  const dailyPresence: Array<{
    day: string
    present: number
    late: number
  }> = []

  for (let i = 6; i >= 0; i--) {
    const date = today.minus({ days: i }).toISODate()!

    const attendances = await Attendance.query()
      .where('attendance_date', date)
      .whereHas('user', (query) => {
        query.where('organization_id', currentUser.organizationId!)
      })

    const present = attendances.filter((item) => item.status === 'present').length
    const late = attendances.filter((item) => item.status === 'late').length

    dailyPresence.push({
      day: DateTime.fromISO(date).toFormat('dd/MM'),
      present,
      late,
    })
  }

  const weeklyLate: Array<{
    week: string
    late: number
  }> = []

  for (let i = 3; i >= 0; i--) {
    const startOfWeek = today.minus({ weeks: i }).startOf('week')
    const endOfWeek = today.minus({ weeks: i }).endOf('week')

    const lateCountResult = await Attendance.query()
      .whereBetween('attendance_date', [
        startOfWeek.toISODate()!,
        endOfWeek.toISODate()!,
      ])
      .where('status', 'late')
      .whereHas('user', (query) => {
        query.where('organization_id', currentUser.organizationId!)
      })
      .count('* as total')

    weeklyLate.push({
      week: `${startOfWeek.toFormat('dd/MM')}`,
      late: Number(lateCountResult[0].$extras.total),
    })
  }

  const activeAgentsRaw = await User.query()
    .where('organization_id', currentUser.organizationId)
    .preload('attendances', (query) => {
      query
        .where('attendance_date', '>=', today.minus({ days: 30 }).toISODate()!)
        .orderBy('attendance_date', 'desc')
    })
    .limit(10)

  const agentActivity = activeAgentsRaw
    .map((user) => ({
      name: user.fullName,
      scans: user.attendances.length,
    }))
    .sort((a, b) => b.scans - a.scans)
    .slice(0, 5)

  return response.ok({
    dailyPresence,
    weeklyLate,
    agentActivity,
  })
 }
}
