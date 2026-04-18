import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import logo from '../../assets/logo.png'
import { useAuth } from '../../hooks/useAuth'
import { useToast } from '../../hooks/useToast'

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const { showToast } = useToast()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (isSubmitting) return

    try {
      setIsSubmitting(true)

      const user = await login({ email, password })

      showToast('Connexion réussie', 'success')

      if (user.role === 'admin') {
        navigate('/admin/dashboard')
        return
      }

      showToast("Cet espace est réservé aux administrateurs", 'error')
      navigate('/')
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Erreur de connexion'

      showToast(message, 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 py-10">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />

      <motion.div
        animate={{ x: [0, 40, 0], y: [0, -30, 0], scale: [1, 1.08, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute left-[-120px] top-[-120px] h-80 w-80 rounded-full bg-emerald-500/20 blur-3xl"
      />

      <motion.div
        animate={{ x: [0, -50, 0], y: [0, 40, 0], scale: [1, 1.12, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-[-140px] right-[-100px] h-96 w-96 rounded-full bg-cyan-500/20 blur-3xl"
      />

      <motion.section
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.55, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-6 text-white shadow-2xl backdrop-blur-xl sm:p-8"
      >
        <div className="mb-8 text-center">
          <motion.div
            initial={{ scale: 0.8, rotate: -8, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            transition={{ duration: 0.45, delay: 0.15 }}
            className="mx-auto mb-4 flex items-center justify-center"
          >
            <img
              src={logo}
              alt="TimeTrack QR Logo"
              className="h-auto w-full max-w-[220px] object-contain"
            />
          </motion.div>

          <h1 className="text-3xl font-bold">Connexion admin</h1>
          <p className="mt-2 text-sm text-slate-300">
            Connectez-vous pour gérer les agents, rapports, QR codes et notifications.
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="admin@timetrack.com"
              disabled={isSubmitting}
              className="w-full rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200">
              Mot de passe
            </label>

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
                disabled={isSubmitting}
                className="w-full rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 pr-12 text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-60"
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                disabled={isSubmitting}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-white disabled:cursor-not-allowed"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <Link
              to="/forgot-password"
              className="text-slate-300 transition hover:text-emerald-400"
            >
              Mot de passe oublié ?
            </Link>

            <Link
              to="/register"
              className="font-semibold text-emerald-400 transition hover:text-emerald-300"
            >
              Créer un compte
            </Link>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-3 rounded-xl bg-emerald-500 px-4 py-3 font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-80"
          >
            {isSubmitting ? (
              <>
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-950/30 border-t-slate-950" />
                Chargement...
              </>
            ) : (
              'Se connecter'
            )}
          </button>
        </form>
      </motion.section>
    </main>
  )
}