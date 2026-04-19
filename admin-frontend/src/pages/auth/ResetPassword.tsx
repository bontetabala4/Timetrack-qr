import { useState } from 'react'
import { motion } from 'motion/react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useToast } from '../../hooks/useToast'

export default function ResetPassword() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { showToast } = useToast()

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const token = searchParams.get('token')

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (isSubmitting || !token) return

    if (password !== confirmPassword) {
      showToast('Les mots de passe ne correspondent pas', 'error')
      return
    }

    try {
      setIsSubmitting(true)

      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          token,
          password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data?.message || 'Réinitialisation impossible')
      }

      showToast('Mot de passe réinitialisé avec succès', 'success')
      navigate('/')
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Une erreur est survenue'

      showToast(message, 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4">
      <motion.section
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.55, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl"
      >
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500 text-2xl font-bold text-slate-950">
            TT
          </div>

          <h1 className="text-3xl font-bold text-white">Nouveau mot de passe</h1>
          <p className="mt-2 text-sm text-slate-300">
            Choisis un nouveau mot de passe pour ton compte admin
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Nouveau mot de passe"
            disabled={isSubmitting}
            className="w-full rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-emerald-500"
          />

          <input
            type="password"
            required
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            placeholder="Confirmer le mot de passe"
            disabled={isSubmitting}
            className="w-full rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-emerald-500"
          />

          <button
            type="submit"
            disabled={isSubmitting || !token}
            className="flex w-full items-center justify-center gap-3 rounded-xl bg-emerald-500 px-4 py-3 font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-80"
          >
            {isSubmitting ? (
              <>
                <span className="flex h-5 w-5 animate-spin items-center justify-center rounded-full border-2 border-slate-950/30 border-t-slate-950">
                  <span className="text-[10px] font-bold">TT</span>
                </span>
                Chargement...
              </>
            ) : (
              'Réinitialiser le mot de passe'
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-300">
          <Link to="/" className="font-semibold text-emerald-400 hover:text-emerald-300">
            Retour à la connexion
          </Link>
        </p>
      </motion.section>
    </main>
  )
}