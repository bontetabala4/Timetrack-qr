import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Users,
  CheckCircle2,
  Clock3,
  UserX,
  QrCode,
  FileText,
  ArrowRight,
  Building2,
  BarChart3,
} from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts'

import AdminLayout from '../../components/layout/AdminLayout'
import { useAuth } from '../../hooks/useAuth'
import { useToast } from '../../hooks/useToast'
import {
  fetchAdminDashboard,
  fetchDashboardCharts,
  type DashboardStats,
  type RecentAttendance,
  type DashboardOrganization,
  type ActiveQr,
} from '../../services/dashboard'

type DailyPresenceItem = {
  day: string
  present: number
  late: number
}

type WeeklyLateItem = {
  week: string
  late: number
}

type AgentActivityItem = {
  name: string
  scans: number
}

type DashboardChartsResponse = {
  dailyPresence: DailyPresenceItem[]
  weeklyLate: WeeklyLateItem[]
  agentActivity: AgentActivityItem[]
}

const defaultStats: DashboardStats = {
  totalUsers: 0,
  presentToday: 0,
  lateToday: 0,
  absentToday: 0,
}

const defaultCharts: DashboardChartsResponse = {
  dailyPresence: [],
  weeklyLate: [],
  agentActivity: [],
}

function StatCard({
  title,
  value,
  icon,
  tone,
}: {
  title: string
  value: number
  icon: ReactNode
  tone: string
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-400">{title}</p>
        <div className={`rounded-xl p-3 ${tone}`}>{icon}</div>
      </div>
      <p className="mt-4 text-3xl font-bold text-white">{value}</p>
    </div>
  )
}

export default function Dashboard() {
  const navigate = useNavigate()
  const { token } = useAuth()
  const { showToast } = useToast()

  const [organization, setOrganization] = useState<DashboardOrganization>(null)
  const [stats, setStats] = useState<DashboardStats>(defaultStats)
  const [activeQr, setActiveQr] = useState<ActiveQr>(null)
  const [recentAttendances, setRecentAttendances] = useState<RecentAttendance[]>([])
  const [charts, setCharts] = useState<DashboardChartsResponse>(defaultCharts)
  const [loading, setLoading] = useState(true)
  const [chartsLoading, setChartsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [now, setNow] = useState(new Date())

  const loadDashboard = async (refresh = false) => {
    if (!token) return

    try {
      if (refresh) {
        setIsRefreshing(true)
      } else {
        setLoading(true)
      }

      const data = await fetchAdminDashboard(token)
      setOrganization(data.organization)
      setStats(data.stats)
      setActiveQr(data.activeQr)
      setRecentAttendances(data.recentAttendances)
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Erreur de chargement du dashboard'
      showToast(message, 'error')
    } finally {
      setLoading(false)
      setIsRefreshing(false)
    }
  }

  const loadCharts = async () => {
    if (!token) return

    try {
      setChartsLoading(true)

      const data = (await fetchDashboardCharts(token)) as DashboardChartsResponse

      setCharts({
        dailyPresence: data?.dailyPresence ?? [],
        weeklyLate: data?.weeklyLate ?? [],
        agentActivity: data?.agentActivity ?? [],
      })
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Erreur lors du chargement des graphiques'
      showToast(message, 'error')
      setCharts(defaultCharts)
    } finally {
      setChartsLoading(false)
    }
  }

  useEffect(() => {
    if (!token) return

    void loadDashboard()
    void loadCharts()
  }, [token])

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const currentClock = now.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })

  const currentDate = now.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })

  const qrSecondsLeft = useMemo(() => {
    if (!activeQr?.expiresAt) return 0

    const diff = Math.floor(
      (new Date(activeQr.expiresAt).getTime() - now.getTime()) / 1000
    )

    return Math.max(0, diff)
  }, [activeQr, now])

  const formatTime = (value: string | null) =>
    value
      ? new Date(value).toLocaleTimeString('fr-FR', {
          hour: '2-digit',
          minute: '2-digit',
        })
      : '--:--'

  const formatStatus = (status: RecentAttendance['status']) => {
    if (status === 'present') return 'Présent'
    if (status === 'late') return 'Retard'
    return 'Absent'
  }

  const quickLinks = [
    {
      title: 'Gérer les agents',
      description: 'Créer, modifier et supprimer des agents',
      icon: <Users size={18} />,
      action: () => navigate('/admin/users'),
    },
    {
      title: 'Voir les rapports',
      description: 'Consulter les statistiques et historiques',
      icon: <FileText size={18} />,
      action: () => navigate('/admin/reports'),
    },
    {
      title: 'Gérer les QR codes',
      description: 'Afficher et générer un QR actif',
      icon: <QrCode size={18} />,
      action: () => navigate('/admin/qrcodes'),
    },
  ]

  return (
    <AdminLayout
      title="Dashboard"
      subtitle="Vue d’ensemble moderne de votre organisation"
      onRefresh={() => {
        void loadDashboard(true)
        void loadCharts()
      }}
      isRefreshing={isRefreshing}
    >
      <section className="grid grid-cols-1 gap-5 xl:grid-cols-[1.35fr_0.65fr]">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-900/40 px-3 py-1 text-xs text-slate-300">
                <Building2 size={14} />
                {organization?.type || 'Organisation'}
              </div>

              <h2 className="mt-4 text-3xl font-bold text-white">
                {organization?.name || 'Organisation non définie'}
              </h2>

              <p className="mt-2 text-sm capitalize text-slate-300">
                {currentDate}
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <div className="rounded-2xl border border-white/10 bg-slate-900/40 px-5 py-4 text-center">
                <p className="text-xs text-slate-400">Heure actuelle</p>
                <p className="mt-2 text-2xl font-bold text-white">{currentClock}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">QR actif</h3>
            <QrCode className="text-emerald-400" size={22} />
          </div>

          {activeQr ? (
            <>
              <p className="mt-4 text-sm text-slate-400">Code actif</p>
              <p className="mt-2 break-all text-sm text-white">{activeQr.code}</p>

              <div className="mt-5 rounded-2xl bg-slate-900/50 p-4">
                <p className="text-xs text-slate-400">Temps restant</p>
                <p className="mt-2 text-2xl font-bold text-emerald-400">
                  {qrSecondsLeft}s
                </p>
              </div>

              <button
                onClick={() => navigate('/admin/qrcodes')}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900/60 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
              >
                Ouvrir QR Codes
                <ArrowRight size={16} />
              </button>
            </>
          ) : (
            <>
              <p className="mt-4 text-sm text-slate-300">
                Aucun QR actif pour le moment.
              </p>

              <button
                onClick={() => navigate('/admin/qrcodes')}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
              >
                Générer un QR
                <ArrowRight size={16} />
              </button>
            </>
          )}
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total agents"
          value={stats.totalUsers}
          icon={<Users size={20} className="text-white" />}
          tone="bg-blue-500/20"
        />
        <StatCard
          title="Présents aujourd’hui"
          value={stats.presentToday}
          icon={<CheckCircle2 size={20} className="text-white" />}
          tone="bg-emerald-500/20"
        />
        <StatCard
          title="Retards aujourd’hui"
          value={stats.lateToday}
          icon={<Clock3 size={20} className="text-white" />}
          tone="bg-amber-500/20"
        />
        <StatCard
          title="Absents aujourd’hui"
          value={stats.absentToday}
          icon={<UserX size={20} className="text-white" />}
          tone="bg-red-500/20"
        />
      </section>

      <section className="grid grid-cols-1 gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl">
          <h3 className="text-lg font-semibold text-white">Accès rapides</h3>

          <div className="mt-5 space-y-3">
            {quickLinks.map((item) => (
              <button
                key={item.title}
                onClick={item.action}
                className="flex w-full items-center justify-between rounded-2xl bg-slate-900/50 px-4 py-4 text-left transition hover:bg-slate-800"
              >
                <div className="flex items-start gap-3">
                  <div className="rounded-xl bg-slate-800 p-3 text-emerald-400">
                    {item.icon}
                  </div>

                  <div>
                    <p className="font-medium text-white">{item.title}</p>
                    <p className="mt-1 text-sm text-slate-400">
                      {item.description}
                    </p>
                  </div>
                </div>

                <ArrowRight size={18} className="text-slate-400" />
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl">
          <div className="mb-5 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Présences récentes</h3>
          </div>

          {loading ? (
            <div className="text-slate-300">Chargement du dashboard...</div>
          ) : recentAttendances.length === 0 ? (
            <div className="text-slate-300">Aucune présence enregistrée.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-slate-800 text-sm text-slate-400">
                    <th className="pb-3 font-medium">Nom</th>
                    <th className="pb-3 font-medium">Matricule</th>
                    <th className="pb-3 font-medium">Département</th>
                    <th className="pb-3 font-medium">Heure</th>
                    <th className="pb-3 font-medium">Statut</th>
                  </tr>
                </thead>

                <tbody>
                  {recentAttendances.map((attendance) => (
                    <tr key={attendance.id} className="border-b border-slate-800/70">
                      <td className="py-4 text-white">{attendance.fullName}</td>
                      <td className="py-4 text-slate-300">
                        {attendance.employeeId || '-'}
                      </td>
                      <td className="py-4 text-slate-300">
                        {attendance.department || '-'}
                      </td>
                      <td className="py-4 text-slate-300">
                        {formatTime(attendance.checkInTime)}
                      </td>
                      <td className="py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            attendance.status === 'present'
                              ? 'bg-emerald-500/15 text-emerald-400'
                              : attendance.status === 'late'
                              ? 'bg-amber-500/15 text-amber-400'
                              : 'bg-red-500/15 text-red-400'
                          }`}
                        >
                          {formatStatus(attendance.status)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      <section className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl">
          <div className="mb-5 flex items-center gap-2">
            <BarChart3 size={20} className="text-emerald-400" />
            <h3 className="text-lg font-semibold text-white">Présence par jour</h3>
          </div>

          {chartsLoading ? (
            <div className="text-slate-300">Chargement des graphiques...</div>
          ) : (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={charts.dailyPresence}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="day" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip />
                  <Bar dataKey="present" fill="#10b981" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="late" fill="#f59e0b" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl">
          <div className="mb-5 flex items-center gap-2">
            <Clock3 size={20} className="text-amber-400" />
            <h3 className="text-lg font-semibold text-white">Retards par semaine</h3>
          </div>

          {chartsLoading ? (
            <div className="text-slate-300">Chargement des graphiques...</div>
          ) : (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={charts.weeklyLate}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="week" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="late"
                    stroke="#f59e0b"
                    strokeWidth={3}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </section>

      <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl">
        <div className="mb-5 flex items-center gap-2">
          <Users size={20} className="text-blue-400" />
          <h3 className="text-lg font-semibold text-white">Activité des agents</h3>
        </div>

        {chartsLoading ? (
          <div className="text-slate-300">Chargement des graphiques...</div>
        ) : (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.agentActivity}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Bar dataKey="scans" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </section>
    </AdminLayout>
  )
}