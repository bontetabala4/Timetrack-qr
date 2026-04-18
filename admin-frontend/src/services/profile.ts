const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export type UpdateAdminProfilePayload = {
  phone?: string
  department?: string
  address?: string
}

export type UpdateAdminProfileResponse = {
  message: string
  user: {
    id: number
    fullName: string
    email: string
    role: 'admin' | 'user'
    status?: string
    department?: string | null
    phone?: string | null
    address?: string | null
    employeeId?: string | null
    avatarUrl?: string | null
    authProvider?: string
    organizationId?: number | null
  }
}

function safeParse<T>(text: string, fallbackMessage: string): T {
  try {
    return JSON.parse(text) as T
  } catch {
    throw new Error(fallbackMessage)
  }
}

export async function updateAdminProfile(
  token: string,
  payload: UpdateAdminProfilePayload
): Promise<UpdateAdminProfileResponse> {
  const response = await fetch(`${API_BASE_URL}/admin/profile`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  })

  const text = await response.text()
  const data = safeParse<UpdateAdminProfileResponse & { message?: string }>(
    text,
    'La réponse profil admin n’est pas un JSON valide'
  )

  if (!response.ok) {
    throw new Error(data?.message || 'Impossible de mettre à jour le profil')
  }

  return data
}