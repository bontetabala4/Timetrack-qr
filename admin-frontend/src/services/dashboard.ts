const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export type DashboardStats = {
  totalUsers: number
  presentToday: number
  lateToday: number
  absentToday: number
}

export type RecentAttendance = {
  id: number
  fullName: string
  employeeId: string | null
  department: string | null
  checkInTime: string | null
  status: 'present' | 'late' | 'absent'
}

export type ActiveQr = {
  id: number
  code: string
  expiresAt: string
  activeFrom: string
  date: string
} | null

export type DashboardOrganization = {
  id: number
  name: string
  type: string
} | null

export type DashboardResponse = {
  organization: DashboardOrganization
  stats: DashboardStats
  activeQr: ActiveQr
  recentAttendances: RecentAttendance[]
}

export type DashboardChartsResponse = {
  dailyPresence: Array<{
    day: string
    present: number
    late: number
  }>
  weeklyLate: Array<{
    week: string
    late: number
  }>
  agentActivity: Array<{
    name: string
    scans: number
  }>
}

export async function fetchAdminDashboard(
  token: string
): Promise<DashboardResponse> {
  const response = await fetch(`${API_BASE_URL}/admin/dashboard`, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  const text = await response.text()
  let data: DashboardResponse | { message?: string }

  try {
    data = JSON.parse(text)
  } catch {
    throw new Error('La réponse dashboard n’est pas un JSON valide')
  }

  if (!response.ok) {
    throw new Error(
      (data as { message?: string })?.message ||
        'Impossible de charger le dashboard'
    )
  }

  return data as DashboardResponse
}

export async function fetchDashboardCharts(
  token: string
): Promise<DashboardChartsResponse> {
  const response = await fetch(`${API_BASE_URL}/admin/dashboard/charts`, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  const text = await response.text()
  let data: DashboardChartsResponse | { message?: string }

  try {
    data = JSON.parse(text)
  } catch {
    throw new Error('La réponse des graphiques n’est pas un JSON valide')
  }

  if (!response.ok) {
    throw new Error(
      (data as { message?: string })?.message ||
        'Erreur chargement graphiques'
    )
  }

  return data as DashboardChartsResponse
}