import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminLayout from '../../components/layout/AdminLayout'
import { useAuth } from '../../hooks/useAuth'
import { useToast } from '../../hooks/useToast'
import {
  fetchAdminNotifications,
  type AdminNotification,
} from '../../services/notifications'

export default function Notifications() {
  const navigate = useNavigate()
  const { token } = useAuth()
  const { showToast } = useToast()

  const [notifications, setNotifications] = useState<AdminNotification[]>([])
  const [loading, setLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const loadNotifications = async (refresh = false) => {
    if (!token) {
      setLoading(false)
      setIsRefreshing(false)
      return
    }

    try {
      if (refresh) {
        setIsRefreshing(true)
      } else {
        setLoading(true)
      }

      const data = await fetchAdminNotifications(token)
      setNotifications(data.notifications ?? [])
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Erreur de chargement'
      showToast(message, 'error')
      setNotifications([])
    } finally {
      setLoading(false)
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    void loadNotifications()
  }, [token])

  const toneClass = (type: AdminNotification['type']) => {
    if (type === 'success') {
      return 'border-emerald-500/20 bg-emerald-500/10'
    }

    if (type === 'warning') {
      return 'border-amber-500/20 bg-amber-500/10'
    }

    return 'border-blue-500/20 bg-blue-500/10'
  }

  const handleNotificationClick = (target?: string) => {
    if (!target) return
    navigate(target)
  }

  return (
    <AdminLayout
      title="Notifications"
      subtitle="Centre de notifications administrateur"
      onRefresh={() => void loadNotifications(true)}
      isRefreshing={isRefreshing}
    >
      <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        {loading ? (
          <div className="text-slate-300">Chargement des notifications...</div>
        ) : notifications.length > 0 ? (
          <div className="space-y-4">
            {notifications.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNotificationClick(item.target)}
                className={`w-full rounded-2xl border p-4 text-left transition hover:scale-[1.01] ${toneClass(item.type)}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold text-white">{item.title}</p>
                    <p className="mt-2 text-sm text-slate-300">
                      {item.description}
                    </p>
                  </div>
                  <span className="text-xs text-slate-400">{item.time}</span>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl bg-slate-800/60 p-4 text-slate-300">
            Aucune notification pour le moment.
          </div>
        )}
      </section>
    </AdminLayout>
  )
}