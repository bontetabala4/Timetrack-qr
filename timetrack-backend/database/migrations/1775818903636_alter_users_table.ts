import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('google_id', 255).nullable().unique()
      table.string('avatar_url', 500).nullable()

      table
        .enu('auth_provider', ['local', 'google'], {
          useNative: true,
          enumName: 'auth_provider',
          existingType: false,
        })
        .notNullable()
        .defaultTo('local')

      table.string('password').nullable().alter()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('google_id')
      table.dropColumn('avatar_url')
      table.dropColumn('auth_provider')

      table.string('password').notNullable().alter()
    })

    this.schema.raw('DROP TYPE IF EXISTS auth_provider')
  }
}