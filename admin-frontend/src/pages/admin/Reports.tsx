import { useEffect, useState } from 'react'
import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import AdminLayout from '../../components/layout/AdminLayout'
import { useAuth } from '../../hooks/useAuth'
import { useToast } from '../../hooks/useToast'
import { fetchAdminReports, type ReportItem } from '../../services/reports'

export default function Reports() {
  const { token } = useAuth()
  const { showToast } = useToast()

  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [loading, setLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [items, setItems] = useState<ReportItem[]>([])
  const [stats, setStats] = useState({
    total: 0,
    present: 0,
    late: 0,
    absent: 0,
  })

  const loadReports = async (refresh = false) => {
    if (!token) return

    try {
      if (refresh) {
        setIsRefreshing(true)
      } else {
        setLoading(true)
      }

      const data = await fetchAdminReports(token, { from, to })
      setItems(data.items)
      setStats(data.stats)
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Erreur lors du chargement'
      showToast(message, 'error')
    } finally {
      setLoading(false)
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    void loadReports()
  }, [token])

  const formatTime = (value: string | null) =>
    value
      ? new Date(value).toLocaleTimeString('fr-FR', {
          hour: '2-digit',
          minute: '2-digit',
        })
      : '--:--'

  const formatDate = (value: string | null) =>
    value
      ? new Date(value).toLocaleDateString('fr-FR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        })
      : '--/--/----'

  const labelStatus = (status: ReportItem['status']) => {
    if (status === 'present') return 'Présent'
    if (status === 'late') return 'Retard'
    return 'Absent'
  }

  const handleExportExcel = () => {
    try {
      if (items.length === 0) {
        showToast('Aucune donnée à exporter', 'error')
        return
      }

      const data = items.map((item) => ({
        Agent: item.fullName,
        Date: formatDate(item.attendanceDate),
        Entrée: formatTime(item.checkInTime),
        Département: item.department || '-',
        Matricule: item.employeeId || '-',
        'Retard (min)': item.lateMinutes,
        Statut: labelStatus(item.status),
      }))

      const worksheet = XLSX.utils.json_to_sheet(data)
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Rapports')
      XLSX.writeFile(workbook, 'timetrack-rapports.xlsx')

      showToast('Export Excel réussi', 'success')
    } catch (error) {
      showToast("Erreur lors de l'export Excel", 'error')
    }
  }

  const handleExportPdf = () => {
    try {
      if (items.length === 0) {
        showToast('Aucune donnée à exporter', 'error')
        return
      }

      const doc = new jsPDF()

      doc.setFontSize(16)
      doc.text('Rapport des présences', 14, 15)

      doc.setFontSize(10)
      doc.text(`Total: ${stats.total}`, 14, 25)
      doc.text(`Présents: ${stats.present}`, 14, 31)
      doc.text(`Retards: ${stats.late}`, 14, 37)
      doc.text(`Absents: ${stats.absent}`, 14, 43)

      autoTable(doc, {
    head: [['Agent', 'Date', 'Entrée', 'Département', 'Matricule', 'Retard', 'Statut']],
    body: items.map((item) => [
      item.fullName,
      item.attendanceDate || '',
      item.checkInTime || '',
      item.department || '',
      item.employeeId || '',
      String(item.lateMinutes),
      item.status,
    ]),
  })

  doc.save('timetrack-rapports.pdf')

      showToast('Export PDF réussi', 'success')
    } catch (error) {
      showToast("Erreur lors de l'export PDF", 'error')
    }
  }

  return (
    <AdminLayout
      title="Rapports"
      subtitle="Analyse des présences des agents par période"
      onRefresh={() => void loadReports(true)}
      isRefreshing={isRefreshing}
    >
      <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl">
        <div className="grid gap-4 md:grid-cols-3">
          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none"
          />

          <input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none"
          />

          <button
            onClick={() => void loadReports(true)}
            className="rounded-xl bg-emerald-500 px-4 py-3 font-semibold text-slate-950 transition hover:bg-emerald-400"
          >
            Filtrer
          </button>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
          <p className="text-sm text-slate-400">Total</p>
          <p className="mt-2 text-3xl font-bold text-white">{stats.total}</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
          <p className="text-sm text-slate-400">Présents</p>
          <p className="mt-2 text-3xl font-bold text-emerald-400">{stats.present}</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
          <p className="text-sm text-slate-400">Retards</p>
          <p className="mt-2 text-3xl font-bold text-amber-400">{stats.late}</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
          <p className="text-sm text-slate-400">Absents</p>
          <p className="mt-2 text-3xl font-bold text-red-400">{stats.absent}</p>
        </div>
      </section>

      <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl">
        {loading ? (
          <div className="text-slate-300">Chargement des rapports...</div>
        ) : items.length === 0 ? (
          <div className="text-slate-300">Aucune donnée trouvée.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-slate-800 text-sm text-slate-400">
                  <th className="pb-3 font-medium">Agent</th>
                  <th className="pb-3 font-medium">Date</th>
                  <th className="pb-3 font-medium">Entrée</th>
                  <th className="pb-3 font-medium">Département</th>
                  <th className="pb-3 font-medium">Matricule</th>
                  <th className="pb-3 font-medium">Retard</th>
                  <th className="pb-3 font-medium">Statut</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-b border-slate-800/70">
                    <td className="py-4 text-white">{item.fullName}</td>
                    <td className="py-4 text-slate-300">{formatDate(item.attendanceDate)}</td>
                    <td className="py-4 text-slate-300">{formatTime(item.checkInTime)}</td>
                    <td className="py-4 text-slate-300">{item.department || '-'}</td>
                    <td className="py-4 text-slate-300">{item.employeeId || '-'}</td>
                    <td className="py-4 text-slate-300">{item.lateMinutes} min</td>
                    <td className="py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          item.status === 'present'
                            ? 'bg-emerald-500/15 text-emerald-400'
                            : item.status === 'late'
                              ? 'bg-amber-500/15 text-amber-400'
                              : 'bg-red-500/15 text-red-400'
                        }`}
                      >
                        {labelStatus(item.status)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-4 flex flex-wrap gap-3">
              <button
                onClick={handleExportExcel}
                className="rounded-xl bg-emerald-500 px-4 py-3 font-semibold text-slate-950 transition hover:bg-emerald-400"
              >
                Exporter Excel
              </button>

              <button
                onClick={handleExportPdf}
                className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3 font-semibold text-white transition hover:bg-slate-800"
              >
                Exporter PDF
              </button>
            </div>
          </div>
        )}
      </section>
    </AdminLayout>
  )
}