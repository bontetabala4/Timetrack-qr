import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'organizations'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()

      table.string('name', 150).notNullable()
      table
        .enu('type', ['entreprise', 'ecole', 'universite', 'institution', 'ong', 'autre'], {
          useNative: true,
          enumName: 'organization_type',
          existingType: false,
        })
        .notNullable()

      table.string('email', 255).nullable()
      table.string('phone', 30).nullable()
      table.text('address').nullable()

      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
    this.schema.raw('DROP TYPE IF EXISTS organization_type')
  }
}