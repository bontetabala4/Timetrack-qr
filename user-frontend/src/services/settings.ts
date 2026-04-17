type Theme = 'dark' | 'light'

const STORAGE_KEY = 'timetrack_user_theme'

export function getSavedTheme(): Theme {
  const saved = localStorage.getItem(STORAGE_KEY)

  if (saved === 'light') {
    return 'light'
  }

  return 'dark'
}

export function saveTheme(theme: Theme) {
  localStorage.setItem(STORAGE_KEY, theme)
}

export function applyTheme(theme: Theme) {
  if (theme === 'light') {
    document.documentElement.classList.add('light')
  } else {
    document.documentElement.classList.remove('light')
  }
}

/* ---------- CHANGEMENT MOT DE PASSE ---------- */

export async function changeMyPassword(
  token: string,
  data: {
    currentPassword: string
    newPassword: string
  }
) {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/me/change-password`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    }
  )

  const result = await response.json()

  if (!response.ok) {
    throw new Error(result.message || 'Erreur changement mot de passe')
  }

  return result
}