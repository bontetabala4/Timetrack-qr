import { History, LogOut, QrCode, User } from 'lucide-react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useToast } from '../../hooks/useToast'

export default function UserBottomNav() {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const { showToast } = useToast()

  const handleLogout = async () => {
    await logout()
    showToast('Déconnexion réussie', 'success')
    navigate('/')
  }

  return (
    <nav className="fixed bottom-5 left-1/2 z-20 flex w-[calc(100%-1rem)] max-w-xl -translate-x-1/2 items-center justify-around rounded-[1.75rem] border border-white/10 bg-slate-950/70 px-4 py-4 shadow-2xl backdrop-blur-2xl sm:w-[calc(100%-2rem)]">
      <NavLink
        to="/scan"
        className={({ isActive }) =>
          `flex flex-col items-center gap-2 text-sm ${
            isActive ? 'text-blue-400' : 'text-slate-400'
          }`
        }
      >
        <QrCode size={24} />
        <span>Scan</span>
      </NavLink>

      <NavLink
        to="/history"
        className={({ isActive }) =>
          `flex flex-col items-center gap-2 text-sm ${
            isActive ? 'text-blue-400' : 'text-slate-400'
          }`
        }
      >
        <History size={24} />
        <span>Historique</span>
      </NavLink>

      <NavLink
        to="/profile"
        className={({ isActive }) =>
          `flex flex-col items-center gap-2 text-sm ${
            isActive ? 'text-blue-400' : 'text-slate-400'
          }`
        }
      >
        <User size={24} />
        <span>Profil</span>
      </NavLink>

      <button
        onClick={handleLogout}
        className="flex flex-col items-center gap-2 text-sm text-slate-400 transition hover:text-red-400"
      >
        <LogOut size={24} />
        <span>Quitter</span>
      </button>
    </nav>
  )
}