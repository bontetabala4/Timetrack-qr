import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  QrCode,
  History,
  User,
  Clock3,
  CheckCircle2,
  TriangleAlert,
} from 'lucide-react'
import UserLayout from '../../components/layout/UserLayout'
import { useAuth } from '../../hooks/useAuth'
import { useToast } from '../../hooks/useToast'
import {
  fetchTodayAttendance,
  type AttendanceHistoryItem,
} from '../../services/attendance'
import { fetchMyProfile } from '../../services/profile'

type UserProfile = {
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
} | null

export default function Home() {
  const navigate = useNavigate()
  const { token } = useAuth()
  const { showToast } = useToast()

  const [profile, setProfile] = useState<UserProfile>(null)
  const [todayAttendance, setTodayAttendance] =
    useState<AttendanceHistoryItem | null>(null)
  const [loading, setLoading] = useState(true)

  const loadHome = async () => {
    if (!token) return

    try {
      setLoading(true)

      const [profileData, todayData] = await Promise.all([
        fetchMyProfile(token),
        fetchTodayAttendance(token),
      ])

      setProfile(profileData.user)
      setTodayAttendance(todayData.attendance)
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Erreur lors du chargement'
      showToast(message, 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadHome()
  }, [token])

  const formatTime = (value: string | null) =>
    value
      ? new Date(value).toLocaleTimeString('fr-FR', {
          hour: '2-digit',
          minute: '2-digit',
        })
      : '--:--'

  const getStatusLabel = (status?: AttendanceHistoryItem['status']) => {
    if (status === 'present') return 'Présent'
    if (status === 'late') return 'Retard'
    if (status === 'absent') return 'Absent'
    return 'Non pointé'
  }

  const getStatusTone = (status?: AttendanceHistoryItem['status']) => {
    if (status === 'present')
      return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
    if (status === 'late')
      return 'text-amber-400 bg-amber-500/10 border-amber-500/20'
    if (status === 'absent')
      return 'text-red-400 bg-red-500/10 border-red-500/20'
    return 'user-theme-muted user-theme-soft border'
  }

  return (
    <UserLayout>
      <section className="space-y-6">
        <div className="user-theme-card rounded-3xl p-6 shadow-2xl backdrop-blur-xl transition-colors duration-300">
          <p className="user-theme-muted text-sm">Bienvenue</p>
          <h1 className="mt-2 text-2xl font-bold">
            {profile?.fullName || 'Utilisateur'}
          </h1>
          <p className="user-theme-muted mt-2 text-sm">
            Consulte ton statut du jour et accède rapidement aux fonctions
            principales.
          </p>
        </div>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="user-theme-card rounded-2xl p-5 backdrop-blur-xl transition-colors duration-300">
            <p className="user-theme-muted text-sm">Statut du jour</p>
            <div
              className={`mt-3 inline-flex rounded-full border px-3 py-1 text-sm font-semibold ${getStatusTone(
                todayAttendance?.status
              )}`}
            >
              {getStatusLabel(todayAttendance?.status)}
            </div>
          </div>

          <div className="user-theme-card rounded-2xl p-5 backdrop-blur-xl transition-colors duration-300">
            <p className="user-theme-muted text-sm">Heure d’arrivée</p>
            <p className="mt-3 text-2xl font-bold">
              {formatTime(todayAttendance?.checkInTime || null)}
            </p>
          </div>

          <div className="user-theme-card rounded-2xl p-5 backdrop-blur-xl transition-colors duration-300">
            <p className="user-theme-muted text-sm">Retard</p>
            <p className="mt-3 text-2xl font-bold">
              {todayAttendance ? `${todayAttendance.lateMinutes} min` : '--'}
            </p>
          </div>

          <div className="user-theme-card rounded-2xl p-5 backdrop-blur-xl transition-colors duration-300">
            <p className="user-theme-muted text-sm">Matricule</p>
            <p className="mt-3 text-lg font-bold">
              {profile?.employeeId || 'Non renseigné'}
            </p>
          </div>
        </section>

        <section className="user-theme-card rounded-3xl p-6 shadow-2xl backdrop-blur-xl transition-colors duration-300">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Accès rapides</h2>

            <button
              onClick={() => void loadHome()}
              className="user-theme-button rounded-xl px-4 py-2 text-sm font-semibold transition hover:opacity-90"
            >
              Actualiser
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <button
              onClick={() => navigate('/scan')}
              className="user-theme-soft flex items-center gap-4 rounded-2xl border p-4 text-left transition hover:opacity-90"
            >
              <div className="rounded-2xl bg-emerald-500/15 p-3 text-emerald-400">
                <QrCode size={22} />
              </div>
              <div>
                <p className="font-semibold">Scanner</p>
                <p className="user-theme-muted mt-1 text-sm">
                  Scanner le QR du jour
                </p>
              </div>
            </button>

            <button
              onClick={() => navigate('/history')}
              className="user-theme-soft flex items-center gap-4 rounded-2xl border p-4 text-left transition hover:opacity-90"
            >
              <div className="rounded-2xl bg-blue-500/15 p-3 text-blue-400">
                <History size={22} />
              </div>
              <div>
                <p className="font-semibold">Historique</p>
                <p className="user-theme-muted mt-1 text-sm">
                  Voir les présences passées
                </p>
              </div>
            </button>

            <button
              onClick={() => navigate('/profile')}
              className="user-theme-soft flex items-center gap-4 rounded-2xl border p-4 text-left transition hover:opacity-90"
            >
              <div className="rounded-2xl bg-amber-500/15 p-3 text-amber-400">
                <User size={22} />
              </div>
              <div>
                <p className="font-semibold">Profil</p>
                <p className="user-theme-muted mt-1 text-sm">
                  Gérer tes informations
                </p>
              </div>
            </button>
          </div>
        </section>

        <section className="user-theme-card rounded-3xl p-6 shadow-2xl backdrop-blur-xl transition-colors duration-300">
          <h2 className="mb-4 text-lg font-semibold">Résumé du jour</h2>

          {loading ? (
            <div className="user-theme-muted">Chargement...</div>
          ) : todayAttendance ? (
            <div className="grid gap-4 md:grid-cols-3">
              <div className="user-theme-soft rounded-2xl border p-4 transition-colors duration-300">
                <div className="user-theme-muted flex items-center gap-2 text-sm">
                  <Clock3 size={16} />
                  <span>Heure</span>
                </div>
                <p className="mt-2 font-semibold">
                  {formatTime(todayAttendance.checkInTime)}
                </p>
              </div>

              <div className="user-theme-soft rounded-2xl border p-4 transition-colors duration-300">
                <div className="user-theme-muted flex items-center gap-2 text-sm">
                  {todayAttendance.status === 'late' ? (
                    <TriangleAlert size={16} />
                  ) : (
                    <CheckCircle2 size={16} />
                  )}
                  <span>Statut</span>
                </div>
                <p className="mt-2 font-semibold">
                  {getStatusLabel(todayAttendance.status)}
                </p>
              </div>

              <div className="user-theme-soft rounded-2xl border p-4 transition-colors duration-300">
                <p className="user-theme-muted text-sm">Retard</p>
                <p className="mt-2 font-semibold">
                  {todayAttendance.lateMinutes} minute(s)
                </p>
              </div>
            </div>
          ) : (
            <div className="user-theme-soft rounded-2xl border p-4 transition-colors duration-300">
              Aucune présence enregistrée pour aujourd’hui.
            </div>
          )}
        </section>
      </section>
    </UserLayout>
  )
}