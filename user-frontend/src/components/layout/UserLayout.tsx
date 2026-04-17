import type { ReactNode } from 'react'
import { useState } from 'react'
import { LogOut, Menu, Settings, X } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import UserBottomNav from './UserBottomNav'
import { useAuth } from '../../hooks/useAuth'
import { useToast } from '../../hooks/useToast'
import icon from '../../assets/icon.png'

type UserLayoutProps = {
  children: ReactNode
}

export default function UserLayout({ children }: UserLayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
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

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.14),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.12),transparent_24%)]" />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 pb-28 pt-6 sm:px-6 lg:px-8">
        <header className="mb-6 flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
          <Link to="/home">
        <img
                  src={icon}
                  alt="TimeTrack QR Icon"
                  className="h-10 w-10 rounded-xl object-cover"
                />
        <p className="text-xs text-slate-400">Espace utilisateur</p>
      </Link>

          <button
            type="button"
            onClick={() => setIsMenuOpen(true)}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-700 bg-slate-800 text-slate-300 transition hover:bg-slate-700 hover:text-white"
          >
            <Menu size={18} />
          </button>
        </header>

        {children}
      </div>

      <UserBottomNav />

      {isMenuOpen && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setIsMenuOpen(false)}
          />

          <div className="absolute right-0 top-0 h-full w-[85%] max-w-xs border-l border-white/10 bg-slate-950 p-4 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <img
                  src={icon}
                  alt="TimeTrack QR Icon"
                  className="h-10 w-10 rounded-xl object-cover"
                />
                <p className="text-xs text-slate-400">Navigation utilisateur</p>
              </div>

              <button
                type="button"
                onClick={() => setIsMenuOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-700 bg-slate-800 text-slate-300"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3">
              <button
                type="button"
                onClick={() => {
                  navigate('/settings')
                  setIsMenuOpen(false)
                }}
                className="flex w-full items-center gap-3 rounded-2xl bg-slate-900 px-4 py-4 text-left text-slate-300 transition hover:bg-slate-800 hover:text-white"
              >
                <Settings size={18} />
                Paramètres
              </button>

              <button
                type="button"
                onClick={() => {
                  void handleLogout()
                  setIsMenuOpen(false)
                }}
                className="flex w-full items-center gap-3 rounded-2xl bg-red-500/10 px-4 py-4 text-left text-red-400 transition hover:bg-red-500/20"
              >
                <LogOut size={18} />
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}