import vine from '@vinejs/vine'

export const registerValidator = vine.compile(
  vine.object({
    fullName: vine.string().trim().minLength(3).maxLength(150),
    email: vine.string().trim().email(),
    password: vine.string().minLength(6).maxLength(64),
    role: vine.enum(['admin', 'user']).optional(),
    department: vine.string().trim().maxLength(120).optional(),
    phone: vine.string().trim().maxLength(30).optional(),

    organizationName: vine.string().trim().minLength(2).maxLength(150).optional(),
    organizationType: vine
      .enum(['entreprise', 'ecole', 'universite', 'institution', 'ong', 'autre'])
      .optional(),
    organizationEmail: vine.string().trim().email().optional(),
    organizationPhone: vine.string().trim().maxLength(30).optional(),
    organizationAddress: vine.string().trim().maxLength(255).optional(),
  })
)