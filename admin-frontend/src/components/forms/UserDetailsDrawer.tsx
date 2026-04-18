import { AnimatePresence, motion } from 'motion/react'
import { Mail, Phone, Shield, X } from 'lucide-react'
import type { UserItem } from '../../data/users'

type UserDetailsDrawerProps = {
  user: UserItem | null
  onClose: () => void
}

export default function UserDetailsDrawer({
  user,
  onClose,
}: UserDetailsDrawerProps) {
  return (
    <AnimatePresence>
      {user && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[9998] bg-slate-950/60 backdrop-blur-sm"
          />

          <motion.aside
            initial={{ x: 420 }}
            animate={{ x: 0 }}
            exit={{ x: 420 }}
            transition={{ duration: 0.3 }}
            className="fixed right-0 top-0 z-[9999] h-screen w-full max-w-md border-l border-slate-800 bg-slate-900 p-6 shadow-2xl"
          >
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-white">
                  Détails utilisateur
                </h3>
                <p className="mt-1 text-sm text-slate-400">
                  Informations du compte sélectionné
                </p>
              </div>

              <button
                onClick={onClose}
                className="rounded-xl bg-slate-800 p-2 text-slate-300 transition hover:bg-slate-700 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 font-bold text-slate-950">
                    {user.name.charAt(0)}
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-white">
                      {user.name}
                    </h4>
                    <p className="text-sm text-slate-400">{user.department}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Mail size={18} className="mt-1 text-emerald-400" />
                    <div>
                      <p className="text-sm text-slate-400">Email</p>
                      <p className="text-white">{user.email}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone size={18} className="mt-1 text-emerald-400" />
                    <div>
                      <p className="text-sm text-slate-400">Téléphone</p>
                      <p className="text-white">{user.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Shield size={18} className="mt-1 text-emerald-400" />
                    <div>
                      <p className="text-sm text-slate-400">Rôle</p>
                      <p className="text-white">{user.role}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                  <p className="text-sm text-slate-400">Statut</p>
                  <p
                    className={`mt-2 font-semibold ${
                      user.status === 'Actif'
                        ? 'text-emerald-400'
                        : 'text-red-400'
                    }`}
                  >
                    {user.status}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                  <p className="text-sm text-slate-400">Dernier pointage</p>
                  <p className="mt-2 font-semibold text-white">
                    {user.lastCheckIn}
                  </p>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button className="flex-1 rounded-xl bg-emerald-500 px-4 py-3 font-semibold text-slate-950 transition hover:bg-emerald-400">
                  Modifier
                </button>
                <button className="flex-1 rounded-xl bg-slate-800 px-4 py-3 font-semibold text-white transition hover:bg-slate-700">
                  Désactiver
                </button>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}