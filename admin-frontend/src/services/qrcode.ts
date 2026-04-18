const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export type QrData = {
  id: number
  code: string
  expiresAt: string
  activeFrom: string
  date: string
} | null

export type CurrentQrResponse = {
  qr: QrData
}

export type GenerateQrResponse = {
  message: string
  qr: {
    id: number
    code: string
    expiresAt: string
    activeFrom: string
    date: string
  }
}

function safeParse<T>(text: string, fallbackMessage: string): T {
  try {
    return JSON.parse(text) as T
  } catch {
    throw new Error(fallbackMessage)
  }
}

export async function fetchCurrentQr(token: string): Promise<CurrentQrResponse> {
  const response = await fetch(`${API_BASE_URL}/qrcodes/current`, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  const text = await response.text()
  const data = safeParse<CurrentQrResponse & { message?: string }>(
    text,
    'La réponse QR current n’est pas un JSON valide'
  )

  if (!response.ok) {
    throw new Error(data?.message || 'Impossible de récupérer le QR')
  }

  return data
}

export async function generateQr(token: string): Promise<GenerateQrResponse> {
  const response = await fetch(`${API_BASE_URL}/qrcodes/generate`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  const text = await response.text()
  const data = safeParse<GenerateQrResponse & { message?: string }>(
    text,
    'La réponse QR generate n’est pas un JSON valide'
  )

  if (!response.ok) {
    throw new Error(data?.message || 'Impossible de générer le QR')
  }

  return data
}