import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'attendances'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()

      table
        .integer('user_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')

      table.date('attendance_date').notNullable()

      table.timestamp('check_in_time', { useTz: true }).nullable()
      table.timestamp('check_out_time', { useTz: true }).nullable()

      table
        .enu('status', ['present', 'late', 'absent'], {
          useNative: true,
          enumName: 'attendance_status',
          existingType: false,
        })
        .notNullable()
        .defaultTo('present')

      table.integer('late_minutes').notNullable().defaultTo(0)

      table.string('scan_code', 255).nullable()

      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).nullable()

      table.unique(['user_id', 'attendance_date'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
    this.schema.raw('DROP TYPE IF EXISTS attendance_status')
  }
}