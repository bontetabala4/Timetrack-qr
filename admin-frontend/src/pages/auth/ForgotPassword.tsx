import { useState } from 'react'
import { motion } from 'motion/react'
import { Link } from 'react-router-dom'
import { useToast } from '../../hooks/useToast'

export default function ForgotPassword() {
  const { showToast } = useToast()
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (isSubmitting) return

    try {
      setIsSubmitting(true)

      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data?.message || "Impossible d'envoyer le lien")
      }

      showToast('Si ce compte existe, un lien a été envoyé', 'success')
      setEmail('')
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

          <h1 className="text-3xl font-bold text-white">Mot de passe oublié</h1>
          <p className="mt-2 text-sm text-slate-300">
            Entre ton email admin pour recevoir un lien de réinitialisation
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="admin@timetrack.com"
            disabled={isSubmitting}
            className="w-full rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-emerald-500"
          />

          <button
            type="submit"
            disabled={isSubmitting}
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
              'Envoyer le lien'
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