import {
  LayoutDashboard,
  Users,
  FileText,
  QrCode,
  LogOut,
  Bell,
  CircleUserRound,
} from 'lucide-react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useToast } from '../../hooks/useToast'
import icon from '../../assets/icon.png'

export default function Sidebar() {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const { showToast } = useToast()

  const handleLogout = async () => {
    try {
      await logout()
      showToast('Déconnexion réussie', 'success')
      navigate('/')
    } catch {
      showToast('Erreur lors de la déconnexion', 'error')
    }
  }

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
      isActive
        ? 'bg-emerald-500 text-slate-950'
        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
    }`

  return (
    <aside className="flex h-full w-full flex-col border-r border-slate-800 bg-slate-950 p-4">
      <Link to="/admin/dashboard" className="mb-8 flex items-center gap-3 px-2">
        <img
          src={icon}
          alt="TimeTrack QR Icon"
          className="h-12 w-12 rounded-2xl object-cover"
        />

        <div>
          <h1 className="text-lg font-bold text-white">TimeTrack</h1>
          <p className="text-xs text-slate-400">Admin Panel</p>
        </div>
      </Link>

      <nav className="flex flex-1 flex-col gap-2">
        <NavLink to="/admin/dashboard" className={linkClass}>
          <LayoutDashboard size={18} />
          Dashboard
        </NavLink>

        <NavLink to="/admin/users" className={linkClass}>
          <Users size={18} />
          Agents
        </NavLink>

        <NavLink to="/admin/reports" className={linkClass}>
          <FileText size={18} />
          Rapports
        </NavLink>

        <NavLink to="/admin/qrcodes" className={linkClass}>
          <QrCode size={18} />
          QR Codes
        </NavLink>

        <NavLink to="/admin/notifications" className={linkClass}>
          <Bell size={18} />
          Notifications
        </NavLink>

        <NavLink to="/admin/profile" className={linkClass}>
          <CircleUserRound size={18} />
          Profil
        </NavLink>
      </nav>

      <button
        type="button"
        onClick={() => void handleLogout()}
        className="mt-4 flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-400 transition hover:bg-red-500/10"
      >
        <LogOut size={18} />
        Déconnexion
      </button>
    </aside>
  )
}