import vine from '@vinejs/vine'

export const scanAttendanceValidator = vine.compile(
  vine.object({
    scanCode: vine.string().trim().minLength(3),
  })
)