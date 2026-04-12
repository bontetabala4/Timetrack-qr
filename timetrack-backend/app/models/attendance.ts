import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '#models/user'

export type AttendanceStatus = 'present' | 'late' | 'absent'

export default class Attendance extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'user_id' })
  declare userId: number

  @column.date({ columnName: 'attendance_date' })
  declare attendanceDate: DateTime

  @column.dateTime({ columnName: 'check_in_time' })
  declare checkInTime: DateTime | null

  @column.dateTime({ columnName: 'check_out_time' })
  declare checkOutTime: DateTime | null

  @column()
  declare status: AttendanceStatus

  @column({ columnName: 'late_minutes' })
  declare lateMinutes: number

  @column({ columnName: 'scan_code' })
  declare scanCode: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>
}