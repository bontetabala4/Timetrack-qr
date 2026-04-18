const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export type AdminUser = {
  id: number
  fullName: string
  email: string
  role: 'admin' | 'user'
  status: 'active' | 'suspended'
  department?: string | null
  phone?: string | null
  address?: string | null
  employeeId?: string | null
  avatarUrl?: string | null
  authProvider?: string
  organizationId?: number | null
}

export type AdminUsersResponse = {
  meta: {
    total: number
    perPage: number
    currentPage: number
    lastPage: number
    firstPage: number
    firstPageUrl: string | null
    lastPageUrl: string | null
    nextPageUrl: string | null
    previousPageUrl: string | null
  }
  data: AdminUser[]
}

export type UpdateAdminUserPayload = {
  phone?: string | null
  address?: string | null
  department?: string | null
  employeeId?: string | null
  role?: 'admin' | 'user'
  status?: 'active' | 'suspended'
}

export type UpdateAdminUserResponse = {
  message: string
  user: AdminUser
}

export type CreateAdminUserPayload = {
  fullName: string
  email: string
  phone?: string
  address?: string
  department?: string
  employeeId: string
  role?: 'admin' | 'user'
  status?: 'active' | 'suspended'
}

export type CreateAdminUserResponse = {
  message: string
  user: AdminUser
}

export type DeleteAdminUserResponse = {
  message: string
}

function safeParse<T>(text: string, fallbackMessage: string): T {
  try {
    return JSON.parse(text) as T
  } catch {
    throw new Error(fallbackMessage)
  }
}

export async function fetchAdminUsers(
  token: string,
  params: {
    page?: number
    limit?: number
    search?: string
    role?: string
    status?: string
  } = {}
): Promise<AdminUsersResponse> {
  const query = new URLSearchParams()

  if (params.page) query.set('page', String(params.page))
  if (params.limit) query.set('limit', String(params.limit))
  if (params.search) query.set('search', params.search)
  if (params.role && params.role !== 'Tous') query.set('role', params.role)
  if (params.status && params.status !== 'Tous') query.set('status', params.status)

  const response = await fetch(`${API_BASE_URL}/admin/users?${query.toString()}`, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  const text = await response.text()
  const data = safeParse<AdminUsersResponse & { message?: string }>(
    text,
    'La réponse utilisateurs n’est pas un JSON valide'
  )

  if (!response.ok) {
    throw new Error(data?.message || 'Impossible de récupérer les utilisateurs')
  }

  return data
}

export async function updateAdminUser(
  token: string,
  userId: number,
  payload: UpdateAdminUserPayload
): Promise<UpdateAdminUserResponse> {
  const response = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  })

  const text = await response.text()
  const data = safeParse<UpdateAdminUserResponse & { message?: string }>(
    text,
    'La réponse modification agent n’est pas un JSON valide'
  )

  if (!response.ok) {
    throw new Error(data?.message || 'Impossible de mettre à jour cet utilisateur')
  }

  return data
}

export async function createAdminUser(
  token: string,
  payload: CreateAdminUserPayload
): Promise<CreateAdminUserResponse> {
  const response = await fetch(`${API_BASE_URL}/admin/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  })

  const text = await response.text()
  const data = safeParse<CreateAdminUserResponse & { message?: string }>(
    text,
    'La réponse création agent n’est pas un JSON valide'
  )

  if (!response.ok) {
    throw new Error(data?.message || "Impossible de créer l'utilisateur")
  }

  return data
}

export async function deleteAdminUser(
  token: string,
  userId: number
): Promise<DeleteAdminUserResponse> {
  const response = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  const text = await response.text()
  const data = safeParse<DeleteAdminUserResponse & { message?: string }>(
    text,
    'La réponse suppression agent n’est pas un JSON valide'
  )

  if (!response.ok) {
    throw new Error(data?.message || 'Suppression impossible')
  }

  return data
}