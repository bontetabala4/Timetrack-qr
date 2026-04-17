const API_BASE_URL = 'http://localhost:3333/api'

export type UserProfileResponse = {
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

export type UpdateMyProfileResponse = {
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

export async function fetchMyProfile(token: string): Promise<UserProfileResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data?.message || 'Impossible de charger le profil')
  }

  return data
}

export async function updateMyProfile(
  token: string,
  payload: { phone?: string; address?: string }
): Promise<UpdateMyProfileResponse> {
  const response = await fetch(`${API_BASE_URL}/users/me`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data?.message || 'Impossible de mettre à jour le profil')
  }

  return data
}