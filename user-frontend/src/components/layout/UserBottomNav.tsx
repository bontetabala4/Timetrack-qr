import { House, QrCode, History, User } from 'lucide-react'
import { NavLink } from 'react-router-dom'

export default function UserBottomNav() {
  const navClass = ({ isActive }: { isActive: boolean }) =>
    `flex flex-col items-center justify-center gap-1 rounded-2xl px-3 py-2 text-xs font-medium transition ${
      isActive
        ? 'bg-emerald-500 text-slate-950'
        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
    }`

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/10 bg-slate-950/95 px-3 py-3 backdrop-blur-xl">
      <div className="mx-auto grid max-w-md grid-cols-4 gap-2">
        <NavLink to="/home" className={navClass}>
          <House size={18} />
          <span>Accueil</span>
        </NavLink>

        <NavLink to="/scan" className={navClass}>
          <QrCode size={18} />
          <span>Scan</span>
        </NavLink>

        <NavLink to="/history" className={navClass}>
          <History size={18} />
          <span>Historique</span>
        </NavLink>

        <NavLink to="/profile" className={navClass}>
          <User size={18} />
          <span>Profil</span>
        </NavLink>
      </div>
    </nav>
  )
}