import { DateTime } from 'luxon'
import { compose } from '@adonisjs/core/helpers'
import hash from '@adonisjs/core/services/hash'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import { DbAccessTokensProvider, AccessToken } from '@adonisjs/auth/access_tokens'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Attendance from '#models/attendance'
import Organization from '#models/organization'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export type UserRole = 'admin' | 'user'
export type UserStatus = 'active' | 'suspended'
export type AuthProvider = 'local' | 'google'

export default class User extends compose(BaseModel, AuthFinder) {
  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'full_name' })
  declare fullName: string

  @column()
  declare email: string

  @column({ serializeAs: null })
  declare password: string | null

  @column()
  declare role: UserRole

  @column()
  declare status: UserStatus

  @column({ columnName: 'auth_provider' })
  declare authProvider: AuthProvider | null

  @column({ columnName: 'google_id' })
  declare googleId: string | null

  @column({ columnName: 'avatar_url' })
  declare avatarUrl: string | null

  @column()
  declare department: string | null

  @column()
  declare phone: string | null

  @column()
  declare address: string | null

  @column({ columnName: 'employee_id' })
  declare employeeId: string | null

  @column({ columnName: 'organization_id' })
  declare organizationId: number | null

  @belongsTo(() => Organization)
  declare organization: BelongsTo<typeof Organization>

  @hasMany(() => Attendance)
  declare attendances: HasMany<typeof Attendance>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  static accessTokens = DbAccessTokensProvider.forModel(User, {
    expiresIn: '30 days',
  })

  declare currentAccessToken?: AccessToken
}