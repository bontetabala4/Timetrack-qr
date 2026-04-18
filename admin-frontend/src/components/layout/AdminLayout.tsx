import type { ReactNode } from 'react'
import { useState } from 'react'
import { Bell, CircleUserRound, Menu, RefreshCw, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Sidebar from './Sidebar'
import icon from '../../assets/icon.png'

type AdminLayoutProps = {
  title: string
  subtitle?: string
  children: ReactNode
  onRefresh?: () => void
  isRefreshing?: boolean
}

export default function AdminLayout({
  title,
  subtitle,
  children,
  onRefresh,
  isRefreshing = false,
}: AdminLayoutProps) {
  const navigate = useNavigate()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="grid min-h-screen lg:grid-cols-[260px_1fr]">
        <div className="hidden lg:block">
          <Sidebar />
        </div>

        <section className="p-4 sm:p-6 lg:p-8">
          <header className="mb-8 rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex items-start gap-3">
                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(true)}
                  className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-700 bg-slate-800 text-slate-300 transition hover:bg-slate-700 hover:text-white lg:hidden"
                  title="Menu"
                >
                  <Menu size={18} />
                </button>

                <div>
                  <h1 className="text-2xl font-bold sm:text-3xl">{title}</h1>
                  {subtitle ? (
                    <p className="mt-2 text-sm text-slate-400">{subtitle}</p>
                  ) : null}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => navigate('/admin/notifications')}
                  className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-700 bg-slate-800 text-slate-300 transition hover:bg-slate-700 hover:text-white"
                  title="Notifications"
                >
                  <Bell size={18} />
                </button>

                <button
                  type="button"
                  onClick={() => navigate('/admin/profile')}
                  className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-700 bg-slate-800 text-slate-300 transition hover:bg-slate-700 hover:text-white"
                  title="Profil"
                >
                  <CircleUserRound size={18} />
                </button>

                {onRefresh ? (
                  <button
                    type="button"
                    onClick={onRefresh}
                    disabled={isRefreshing}
                    className="flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-70"
                    title="Actualiser"
                  >
                    <RefreshCw
                      size={18}
                      className={isRefreshing ? 'animate-spin' : ''}
                    />
                    <span>{isRefreshing ? 'Actualisation...' : 'Actualiser'}</span>
                  </button>
                ) : null}
              </div>
            </div>
          </header>

          <div className="space-y-6">{children}</div>
        </section>
      </div>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          <div className="absolute left-0 top-0 h-full w-[85%] max-w-xs bg-slate-950 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 p-4">
              <div className="flex items-center gap-3">
                <img
                  src={icon}
                  alt="TimeTrack QR Icon"
                  className="h-10 w-10 rounded-xl object-cover"
                />
                <div>
                  <h2 className="text-lg font-bold text-white">TimeTrack</h2>
                  <p className="text-xs text-slate-400">Admin Panel</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-700 bg-slate-800 text-slate-300"
              >
                <X size={18} />
              </button>
            </div>

            <div onClick={() => setIsMobileMenuOpen(false)}>
              <Sidebar />
            </div>
          </div>
        </div>
      )}
    </main>
  )
}