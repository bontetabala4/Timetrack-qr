const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.trim()

export type ScanAttendanceResponse = {
  message: string
  attendance: {
    id: number
    status: 'present' | 'late' | 'absent'
    lateMinutes: number
    checkInTime: string | null
    attendanceDate: string | null
  }
}

export type AttendanceHistoryItem = {
  id: number
  attendanceDate: string | null
  checkInTime: string | null
  checkOutTime: string | null
  status: 'present' | 'late' | 'absent'
  lateMinutes: number
}

export type AttendanceHistoryResponse = {
  items: AttendanceHistoryItem[]
}

export type TodayAttendanceResponse = {
  attendance: AttendanceHistoryItem | null
}

export async function scanAttendance(
  token: string,
  scanCode: string
): Promise<ScanAttendanceResponse> {
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

export async function fetchAttendanceHistory(
  token: string
): Promise<AttendanceHistoryResponse> {
  const response = await fetch(`${API_BASE_URL}/attendances/me/history`, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data?.message || "Impossible de charger l'historique")
  }

  return data
}

export async function fetchTodayAttendance(
  token: string
): Promise<TodayAttendanceResponse> {
  const response = await fetch(`${API_BASE_URL}/attendances/me/today`, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data?.message || "Impossible de charger la présence du jour")
  }

  return data
}