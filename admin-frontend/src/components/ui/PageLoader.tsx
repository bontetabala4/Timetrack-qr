import { motion } from 'motion/react'

export default function PageLoader() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm"
    >
      <div className="flex flex-col items-center gap-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="h-14 w-14 rounded-full border-4 border-emerald-500/20 border-t-emerald-500"
        />
        <p className="text-sm font-medium tracking-wide text-white">
          Chargement de la page...
        </p>
      </div>
    </motion.div>
  )
}