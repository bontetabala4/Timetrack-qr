const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export type AdminNotification = {
  id: string
  title: string
  description: string
  time: string
  type: 'info' | 'warning' | 'success'
  target: string
}

export type NotificationsResponse = {
  notifications: AdminNotification[]
}

function safeParse<T>(text: string, fallbackMessage: string): T {
  try {
    return JSON.parse(text) as T
  } catch {
    throw new Error(fallbackMessage)
  }
}

export async function fetchAdminNotifications(
  token: string
): Promise<NotificationsResponse> {
  const response = await fetch(`${API_BASE_URL}/admin/notifications`, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  const text = await response.text()

  const data = safeParse<NotificationsResponse & { message?: string }>(
    text,
    'La réponse notifications n’est pas un JSON valide'
  )

  if (!response.ok) {
    throw new Error(data?.message || 'Impossible de charger les notifications')
  }

  return data
}