import { motion } from 'motion/react'
import type { LucideIcon } from 'lucide-react'

type StatCardProps = {
  title: string
  value: string
  icon: LucideIcon
  delay?: number
}

export default function StatCard({
  title,
  value,
  icon: Icon,
  delay = 0,
}: StatCardProps) {
  return (
    <motion.article
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45, delay }}
      whileHover={{ y: -6, scale: 1.02 }}
      className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-lg"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-400">{title}</p>
          <h3 className="mt-3 text-3xl font-bold text-white">{value}</h3>
        </div>

        <motion.div
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          className="rounded-xl bg-slate-800 p-3 text-emerald-400"
        >
          <Icon size={22} />
        </motion.div>
      </div>
    </motion.article>
  )
}