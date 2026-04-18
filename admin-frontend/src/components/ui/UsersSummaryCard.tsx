import { motion } from 'motion/react'
import type { LucideIcon } from 'lucide-react'

type UsersSummaryCardProps = {
  title: string
  value: string | number
  icon: LucideIcon
  delay?: number
}

export default function UsersSummaryCard({
  title,
  value,
  icon: Icon,
  delay = 0,
}: UsersSummaryCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
      whileHover={{ y: -4 }}
      className="rounded-2xl border border-slate-800 bg-slate-900 p-5"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-400">{title}</p>
          <h3 className="mt-3 text-3xl font-bold text-white">{value}</h3>
        </div>

        <div className="rounded-xl bg-slate-800 p-3 text-emerald-400">
          <Icon size={22} />
        </div>
      </div>
    </motion.article>
  )
}