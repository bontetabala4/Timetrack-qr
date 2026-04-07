import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()

      table.string('full_name', 150).notNullable()
      table.string('email', 255).notNullable().unique()
      table.string('password').notNullable()

      table
        .enu('role', ['admin', 'user'], {
          useNative: true,
          enumName: 'user_role',
          existingType: false,
        })
        .notNullable()
        .defaultTo('user')

      table
        .enu('status', ['active', 'suspended'], {
          useNative: true,
          enumName: 'user_status',
          existingType: false,
        })
        .notNullable()
        .defaultTo('active')

      table.string('department', 120).nullable()
      table.string('phone', 30).nullable()

      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
    this.schema.raw('DROP TYPE IF EXISTS user_role')
    this.schema.raw('DROP TYPE IF EXISTS user_status')
  }
}