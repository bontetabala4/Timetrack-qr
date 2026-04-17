import { useEffect, useState } from 'react'
import UserLayout from '../../components/layout/UserLayout'
import { useAuth } from '../../hooks/useAuth'
import { useToast } from '../../hooks/useToast'
import { changeMyPassword } from '../../services/settings'

type NotificationSettings = {
  attendanceReminders: boolean
  qrUpdates: boolean
  appAlerts: boolean
}

export default function Settings() {
  const { token } = useAuth()
  const { showToast } = useToast()

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isSavingPassword, setIsSavingPassword] = useState(false)

  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  const [notifications, setNotifications] = useState<NotificationSettings>({
    attendanceReminders: true,
    qrUpdates: true,
    appAlerts: true,
  })

  useEffect(() => {
    const savedTheme = localStorage.getItem('timetrack_user_theme')
    const savedNotifications = localStorage.getItem('timetrack_user_notifications')

    if (savedTheme === 'dark' || savedTheme === 'light') {
      setTheme(savedTheme)
      document.documentElement.classList.toggle('light', savedTheme === 'light')
    } else {
      document.documentElement.classList.remove('light')
    }

    if (savedNotifications) {
      try {
        setNotifications(JSON.parse(savedNotifications) as NotificationSettings)
      } catch {
        // ignore
      }
    }
  }, [])

  const handleThemeChange = (value: 'dark' | 'light') => {
    setTheme(value)
    localStorage.setItem('timetrack_user_theme', value)
    document.documentElement.classList.toggle('light', value === 'light')
    showToast('Thème mis à jour', 'success')
  }

  const handleNotificationToggle = (key: keyof NotificationSettings) => {
    const updated = {
      ...notifications,
      [key]: !notifications[key],
    }

    setNotifications(updated)
    localStorage.setItem('timetrack_user_notifications', JSON.stringify(updated))
    showToast('Préférences de notification mises à jour', 'success')
  }

  const handleChangePassword = async () => {
    if (!token) return

    if (newPassword !== confirmPassword) {
      showToast('Les nouveaux mots de passe ne correspondent pas', 'error')
      return
    }

    try {
      setIsSavingPassword(true)

      const data = await changeMyPassword(token, {
        currentPassword,
        newPassword,
      })

      showToast(data.message, 'success')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Erreur lors de la modification'
      showToast(message, 'error')
    } finally {
      setIsSavingPassword(false)
    }
  }

  return (
    <UserLayout>
      <section className="space-y-6">
        <div className="user-theme-card rounded-3xl p-6 shadow-2xl backdrop-blur-xl transition-colors duration-300">
          <h1 className="text-2xl font-bold">Paramètres</h1>
          <p className="user-theme-muted mt-2 text-sm">
            Gère la sécurité et les préférences de ton compte.
          </p>
        </div>

        <section className="user-theme-card rounded-3xl p-6 shadow-2xl backdrop-blur-xl transition-colors duration-300">
          <h2 className="text-lg font-semibold">Changer le mot de passe</h2>

          <div className="mt-4 grid gap-4">
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Mot de passe actuel"
              className="user-theme-soft rounded-xl border px-4 py-3 outline-none transition-colors duration-300"
            />

            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Nouveau mot de passe"
              className="user-theme-soft rounded-xl border px-4 py-3 outline-none transition-colors duration-300"
            />

            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirmer le nouveau mot de passe"
              className="user-theme-soft rounded-xl border px-4 py-3 outline-none transition-colors duration-300"
            />

            <button
              onClick={() => void handleChangePassword()}
              disabled={isSavingPassword}
              className="user-theme-button flex items-center justify-center gap-3 rounded-xl px-4 py-3 font-semibold transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSavingPassword ? (
                <>
                  <span className="flex h-5 w-5 animate-spin items-center justify-center rounded-full border-2 border-current/30 border-t-current">
                    <span className="text-[10px] font-bold">TT</span>
                  </span>
                  Enregistrement...
                </>
              ) : (
                'Modifier le mot de passe'
              )}
            </button>
          </div>
        </section>

        <section className="user-theme-card rounded-3xl p-6 shadow-2xl backdrop-blur-xl transition-colors duration-300">
          <h2 className="text-lg font-semibold">Notifications</h2>

          <div className="mt-4 space-y-3">
            <button
              onClick={() => handleNotificationToggle('attendanceReminders')}
              className="user-theme-soft flex w-full items-center justify-between rounded-2xl border p-4 text-left transition-colors duration-300"
            >
              <div>
                <p className="font-medium">Rappels de présence</p>
                <p className="user-theme-muted mt-1 text-sm">
                  Recevoir des rappels pour pointer.
                </p>
              </div>
              <span className="text-sm text-emerald-400">
                {notifications.attendanceReminders ? 'Activé' : 'Désactivé'}
              </span>
            </button>

            <button
              onClick={() => handleNotificationToggle('qrUpdates')}
              className="user-theme-soft flex w-full items-center justify-between rounded-2xl border p-4 text-left transition-colors duration-300"
            >
              <div>
                <p className="font-medium">Mises à jour QR</p>
                <p className="user-theme-muted mt-1 text-sm">
                  Être informé quand un QR est disponible.
                </p>
              </div>
              <span className="text-sm text-emerald-400">
                {notifications.qrUpdates ? 'Activé' : 'Désactivé'}
              </span>
            </button>

            <button
              onClick={() => handleNotificationToggle('appAlerts')}
              className="user-theme-soft flex w-full items-center justify-between rounded-2xl border p-4 text-left transition-colors duration-300"
            >
              <div>
                <p className="font-medium">Alertes application</p>
                <p className="user-theme-muted mt-1 text-sm">
                  Recevoir les informations système importantes.
                </p>
              </div>
              <span className="text-sm text-emerald-400">
                {notifications.appAlerts ? 'Activé' : 'Désactivé'}
              </span>
            </button>
          </div>
        </section>

        <section className="user-theme-card rounded-3xl p-6 shadow-2xl backdrop-blur-xl transition-colors duration-300">
          <h2 className="text-lg font-semibold">Apparence</h2>

          <div className="mt-4 flex flex-wrap gap-3">
            <button
              onClick={() => handleThemeChange('dark')}
              className={`rounded-xl px-4 py-3 font-semibold transition ${
                theme === 'dark'
                  ? 'bg-emerald-500 text-slate-950'
                  : 'user-theme-soft border'
              }`}
            >
              Thème sombre
            </button>

            <button
              onClick={() => handleThemeChange('light')}
              className={`rounded-xl px-4 py-3 font-semibold transition ${
                theme === 'light'
                  ? 'bg-emerald-500 text-slate-950'
                  : 'user-theme-soft border'
              }`}
            >
              Thème clair
            </button>
          </div>
        </section>
      </section>
    </UserLayout>
  )
}