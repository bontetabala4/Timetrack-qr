import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table
        .integer('organization_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('organizations')
        .onDelete('CASCADE')
    })

    this.schema.alterTable(this.tableName, (table) => {
      table.dropUnique(['employee_id'])
      table.unique(['organization_id', 'employee_id'])
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropUnique(['organization_id', 'employee_id'])
      table.unique(['employee_id'])
      table.dropColumn('organization_id')
    })
  }
}