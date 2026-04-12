import vine from '@vinejs/vine'

export const updateMeValidator = vine.compile(
  vine.object({
    phone: vine.string().trim().maxLength(30).optional(),
    address: vine.string().trim().maxLength(255).optional(),
  })
)