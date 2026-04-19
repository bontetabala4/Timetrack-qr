import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'motion/react'
import { useToast } from '../../hooks/useToast'
import { useAuth } from '../../hooks/useAuth'

type MeResponse = {
  user: {
    id: number
    fullName: string
    email: string
    role: 'admin' | 'user'
  }
}

export default function AuthCallback() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { showToast } = useToast()
  const { setAuthenticatedUser } = useAuth()

  useEffect(() => {
    const bootstrapAuth = async () => {
      const token = searchParams.get('token')
      const error = searchParams.get('error')

      if (error) {
        showToast("Connexion Google échouée", 'error')
        navigate('/')
        return
      }

      if (!token) {
        showToast('Token manquant', 'error')
        navigate('/')
        return
      }

      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/me`, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error('Impossible de récupérer le profil')
        }

        const data = (await response.json()) as MeResponse

        setAuthenticatedUser(data.user, token)
        showToast('Connexion Google réussie', 'success')

        if (data.user.role === 'admin') {
          navigate('/admin/dashboard')
          return
        }

        navigate('/scan')
      } catch {
        showToast('Session Google invalide', 'error')
        navigate('/')
      }
    }

    bootstrapAuth()
  }, [navigate, searchParams, setAuthenticatedUser, showToast])

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-white">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 text-center shadow-2xl backdrop-blur-xl"
      >
        <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-emerald-500/30 border-t-emerald-500" />
        <h1 className="text-2xl font-bold">Connexion en cours...</h1>
        <p className="mt-2 text-sm text-slate-300">
          Nous finalisons votre session Google.
        </p>
      </motion.div>
    </main>
  )
}