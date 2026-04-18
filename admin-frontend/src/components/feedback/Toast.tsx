import { motion } from 'motion/react'
import { CheckCircle2, Info, TriangleAlert, X } from 'lucide-react'

type ToastProps = {
  message: string
  type: 'success' | 'error' | 'info'
  onClose: () => void
}

export default function Toast({ message, type, onClose }: ToastProps) {
  const styles = {
    success: {
      icon: CheckCircle2,
      className: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
    },
    error: {
      icon: TriangleAlert,
      className: 'border-red-500/30 bg-red-500/10 text-red-300',
    },
    info: {
      icon: Info,
      className: 'border-cyan-500/30 bg-cyan-500/10 text-cyan-300',
    },
  }

  const config = styles[type]
  const Icon = config.icon

  return (
    <motion.div
      initial={{ opacity: 0, x: 40, scale: 0.96 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 30 }}
      className={`pointer-events-auto rounded-2xl border px-4 py-4 shadow-xl backdrop-blur-xl ${config.className}`}
    >
      <div className="flex items-start gap-3">
        <Icon size={20} className="mt-0.5" />

        <div className="flex-1">
          <p className="text-sm font-medium">{message}</p>
        </div>

        <button
          onClick={onClose}
          className="rounded-lg p-1 text-white/70 transition hover:bg-white/10 hover:text-white"
        >
          <X size={16} />
        </button>
      </div>
    </motion.div>
  )
}