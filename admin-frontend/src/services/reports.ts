const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export type ReportItem = {
  id: number
  fullName: string
  email: string
  department: string | null
  employeeId: string | null
  attendanceDate: string | null
  checkInTime: string | null
  checkOutTime: string | null
  status: 'present' | 'late' | 'absent'
  lateMinutes: number
}

export type ReportsResponse = {
  stats: {
    total: number
    present: number
    late: number
    absent: number
  }
  items: ReportItem[]
}

function safeParse<T>(text: string, fallbackMessage: string): T {
  try {
    return JSON.parse(text) as T
  } catch {
    throw new Error(fallbackMessage)
  }
}

export async function fetchAdminReports(
  token: string,
  params?: { from?: string; to?: string }
): Promise<ReportsResponse> {
  const query = new URLSearchParams()

  if (params?.from) query.set('from', params.from)
  if (params?.to) query.set('to', params.to)

  const url = query.toString()
    ? `${API_BASE_URL}/admin/reports?${query.toString()}`
    : `${API_BASE_URL}/admin/reports`

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  const text = await response.text()
  const data = safeParse<ReportsResponse & { message?: string }>(
    text,
    'La réponse reports n’est pas un JSON valide'
  )

  if (!response.ok) {
    throw new Error(data?.message || 'Impossible de charger les rapports')
  }

  return {
    stats: data?.stats ?? {
      total: 0,
      present: 0,
      late: 0,
      absent: 0,
    },
    items: data?.items ?? [],
  }
}