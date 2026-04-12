import { motion } from 'motion/react'

export default function Login() {
  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:3333/api/auth/google/redirect'
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />

      <motion.section
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.55, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 text-center shadow-2xl backdrop-blur-xl"
      >
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500 text-2xl font-bold text-slate-950 shadow-lg shadow-emerald-500/30">
          TT
        </div>

        <h1 className="text-3xl font-bold text-white">TimeTrack User</h1>
        <p className="mt-2 text-sm text-slate-300">
          Connecte-toi avec Google pour accéder à ton espace
        </p>

        <button
          type="button"
          onClick={handleGoogleLogin}
          className="mt-8 w-full rounded-xl bg-white px-4 py-3 font-semibold text-slate-950 transition hover:bg-slate-100"
        >
          Continuer avec Google
        </button>
      </motion.section>
    </main>
  )
}