import vine from '@vinejs/vine'

export const adminUpdateUserValidator = vine.compile(
  vine.object({
    fullName: vine.string().trim().minLength(3).maxLength(150).optional(),
    phone: vine.string().trim().maxLength(30).optional(),
    address: vine.string().trim().maxLength(255).optional(),
    department: vine.string().trim().maxLength(120).optional(),
    employeeId: vine.string().trim().maxLength(50).optional(),
    role: vine.enum(['admin', 'user']).optional(),
    status: vine.enum(['active', 'suspended']).optional(),
  })
)