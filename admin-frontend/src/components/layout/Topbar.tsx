import { motion } from 'motion/react'
import { Bell, Search } from 'lucide-react'

type TopbarProps = {
  title: string
  subtitle: string
}

export default function Topbar({ title, subtitle }: TopbarProps) {
  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45, delay: 0.15 }}
      className="flex items-center justify-between gap-4 border-b border-slate-800 bg-slate-900 px-6 py-5"
    >
      <div>
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        <p className="text-sm text-slate-400">{subtitle}</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden items-center gap-3 rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 md:flex">
          <Search size={18} className="text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher..."
            className="bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
          />
        </div>

        <button className="relative rounded-xl border border-slate-700 bg-slate-800 p-3 text-slate-300 transition hover:text-white">
          <Bell size={18} />
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
            2
          </span>
        </button>

        <div className="flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-800 px-3 py-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-700 text-sm font-bold text-white">
            A
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-white">Admin</p>
            <p className="text-xs text-slate-400">Superviseur</p>
          </div>
        </div>
      </div>
    </motion.header>
  )
}