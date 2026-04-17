import { useEffect, useState } from 'react'
import UserLayout from '../../components/layout/UserLayout'
import { useAuth } from '../../hooks/useAuth'
import { useToast } from '../../hooks/useToast'
import {
  fetchAttendanceHistory,
  fetchTodayAttendance,
  type AttendanceHistoryItem,
} from '../../services/attendance'

export default function History() {
  const { token } = useAuth()
  const { showToast } = useToast()

  const [history, setHistory] = useState<AttendanceHistoryItem[]>([])
  const [todayAttendance, setTodayAttendance] =
    useState<AttendanceHistoryItem | null>(null)
  const [loading, setLoading] = useState(true)

  const loadHistory = async () => {
    if (!token) return

    try {
      setLoading(true)

      const [historyData, todayData] = await Promise.all([
        fetchAttendanceHistory(token),
        fetchTodayAttendance(token),
      ])

      setHistory(historyData.items)
      setTodayAttendance(todayData.attendance)
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Erreur lors du chargement de l'historique"
      showToast(message, 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadHistory()
  }, [token])

  const formatDate = (value: string | null) =>
    value
      ? new Date(value).toLocaleDateString('fr-FR', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        })
      : '--'

  const formatTime = (value: string | null) =>
    value
      ? new Date(value).toLocaleTimeString('fr-FR', {
          hour: '2-digit',
          minute: '2-digit',
        })
      : '--:--'

  const getStatusLabel = (status: AttendanceHistoryItem['status']) => {
    if (status === 'present') return 'Présent'
    if (status === 'late') return 'Retard'
    return 'Absent'
  }

  const getStatusClasses = (status: AttendanceHistoryItem['status']) => {
    if (status === 'present') {
      return 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400'
    }

    if (status === 'late') {
      return 'border-amber-500/20 bg-amber-500/10 text-amber-400'
    }

    return 'border-red-500/20 bg-red-500/10 text-red-400'
  }

  return (
    <UserLayout>
      <section className="space-y-6">
        <div className="user-theme-card rounded-3xl p-6 shadow-2xl backdrop-blur-xl transition-colors duration-300">
          <h1 className="text-2xl font-bold">Historique de présence</h1>
          <p className="user-theme-muted mt-2 text-sm">
            Consulte tes présences récentes et ton statut du jour.
          </p>
        </div>

        <section className="user-theme-card rounded-3xl p-6 shadow-2xl backdrop-blur-xl transition-colors duration-300">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Présence du jour</h2>

            <button
              onClick={() => void loadHistory()}
              className="user-theme-button rounded-xl px-4 py-2 text-sm font-semibold transition hover:opacity-90"
            >
              Actualiser
            </button>
          </div>

          {loading ? (
            <div className="user-theme-muted">Chargement...</div>
          ) : todayAttendance ? (
            <div className="grid gap-4 md:grid-cols-4">
              <div className="user-theme-soft rounded-2xl border p-4 transition-colors duration-300">
                <p className="user-theme-muted text-sm">Date</p>
                <p className="mt-2 font-semibold">
                  {formatDate(todayAttendance.attendanceDate)}
                </p>
              </div>

              <div className="user-theme-soft rounded-2xl border p-4 transition-colors duration-300">
                <p className="user-theme-muted text-sm">Heure d’arrivée</p>
                <p className="mt-2 font-semibold">
                  {formatTime(todayAttendance.checkInTime)}
                </p>
              </div>

              <div className="user-theme-soft rounded-2xl border p-4 transition-colors duration-300">
                <p className="user-theme-muted text-sm">Statut</p>
                <p className="mt-2 font-semibold">
                  {getStatusLabel(todayAttendance.status)}
                </p>
              </div>

              <div className="user-theme-soft rounded-2xl border p-4 transition-colors duration-300">
                <p className="user-theme-muted text-sm">Retard</p>
                <p className="mt-2 font-semibold">
                  {todayAttendance.lateMinutes} min
                </p>
              </div>
            </div>
          ) : (
            <div className="user-theme-soft rounded-2xl border p-4 transition-colors duration-300">
              Aucune présence enregistrée pour aujourd’hui.
            </div>
          )}
        </section>

        <section className="user-theme-card rounded-3xl p-6 shadow-2xl backdrop-blur-xl transition-colors duration-300">
          <h2 className="mb-4 text-lg font-semibold">Historique récent</h2>

          {loading ? (
            <div className="user-theme-muted">
              Chargement de l’historique...
            </div>
          ) : history.length === 0 ? (
            <div className="user-theme-soft rounded-2xl border p-4 transition-colors duration-300">
              Aucun historique disponible.
            </div>
          ) : (
            <div className="space-y-4">
              {history.map((item) => (
                <div
                  key={item.id}
                  className="user-theme-soft rounded-2xl border p-4 transition-colors duration-300"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="user-theme-muted text-sm">Date</p>
                      <p className="mt-1 font-semibold">
                        {formatDate(item.attendanceDate)}
                      </p>
                    </div>

                    <div>
                      <p className="user-theme-muted text-sm">Heure</p>
                      <p className="mt-1 font-semibold">
                        {formatTime(item.checkInTime)}
                      </p>
                    </div>

                    <div>
                      <p className="user-theme-muted text-sm">Retard</p>
                      <p className="mt-1 font-semibold">
                        {item.lateMinutes} min
                      </p>
                    </div>

                    <div>
                      <p className="user-theme-muted text-sm">Statut</p>
                      <span
                        className={`mt-2 inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClasses(
                          item.status
                        )}`}
                      >
                        {getStatusLabel(item.status)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </section>
    </UserLayout>
  )
}