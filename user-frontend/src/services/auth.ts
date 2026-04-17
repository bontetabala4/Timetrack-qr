const API_BASE_URL = 'http://localhost:3333/api'

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
  organizationId?: number | null
}


type LoginPayload = {
  email: string
  password: string
}

type LoginResponse = {
    user: BackendUser
    token: string
}


export type MeResponse = {
  user: BackendUser
}

export type AttendanceItem = {
  id: number
  userId: number
  attendanceDate: string
  checkInTime: string | null
  checkOutTime: string | null
  status: 'present' | 'late' | 'absent'
  lateMinutes: number
  scanCode: string | null
  createdAt: string
  updatedAt: string | null
}

export type TodayAttendanceResponse = {
  attendance: AttendanceItem | null
}

export type HistoryResponse = {
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
  data: AttendanceItem[]
}

export async function updateMyProfile(
  token: string,
  payload: { phone?: string; address?: string }
): Promise<{ message: string; user: BackendUser }> {
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

export async function scanAttendance(token: string, scanCode: string) {
  const response = await fetch(`${API_BASE_URL}/attendances/scan`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ scanCode }),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data?.message || 'Échec du scan')
  }

  return data
}

export async function fetchMyHistory(
  token: string,
  page = 1,
  limit = 20
): Promise<HistoryResponse> {
  const response = await fetch(
    `${API_BASE_URL}/attendances/me/history?page=${page}&limit=${limit}`,
    {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  )

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data?.message || 'Impossible de récupérer l’historique')
  }

  return data
}

export async function fetchMyToday(token: string): Promise<TodayAttendanceResponse> {
  const response = await fetch(`${API_BASE_URL}/attendances/me/today`, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data?.message || 'Impossible de récupérer la présence du jour')
  }

  return data
}

export async function loginToBackend(
  payload: LoginPayload
): Promise<LoginResponse> {
  const response = await fetch('http://localhost:3333/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Erreur de connexion')
  }

  return data
}