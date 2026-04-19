const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.trim()

if (!API_BASE_URL) {
  throw new Error('VITE_API_BASE_URL n’est pas défini dans les variables d’environnement')
}

export type BackendUser = {
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
}

export type LoginResponse = {
  message: string
  user: BackendUser
  token: string
  tokenType: 'Bearer'
}

export type RegisterResponse = {
  message: string
  user: BackendUser
  token: string
  tokenType: 'Bearer'
}

export type MeResponse = {
  user: BackendUser
}

export async function loginWithBackend(payload: {
  email: string
  password: string
}): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(payload),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data?.message || 'Connexion impossible')
  }

  return data
}

export async function registerAdminWithBackend(payload: {
  fullName: string
  email: string
  password: string
  department?: string
  phone?: string
  organizationName: string
  organizationType: 'entreprise' | 'ecole' | 'universite' | 'institution' | 'ong' | 'autre'
  organizationEmail?: string
  organizationPhone?: string
  organizationAddress?: string
}): Promise<RegisterResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      ...payload,
      role: 'admin',
    }),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data?.message || 'Création du compte impossible')
  }

  return data
}

export async function fetchCurrentUser(token: string): Promise<MeResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data?.message || 'Impossible de récupérer le profil')
  }

  return data
}

export async function logoutFromBackend(token: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/auth/logout`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error('Déconnexion impossible')
  }
}