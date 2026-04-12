import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'motion/react'
import { useToast } from '../../hooks/useToast'
import { useAuth } from '../../hooks/useAuth'
import { fetchCurrentUser } from '../../services/auth'
import LoadingLogo from '../../components/ui/LoadingLogo'

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
        showToast('Connexion Google échouée', 'error')
        navigate('/')
        return
      }

      if (!token) {
        showToast('Token manquant', 'error')
        navigate('/')
        return
      }

      try {
        const { user } = await fetchCurrentUser(token)
        setAuthenticatedUser(user, token)
        showToast('Connexion Google réussie', 'success')
        navigate('/scan')
      } catch {
        showToast('Session Google invalide', 'error')
        navigate('/')
      }
    }

    void bootstrapAuth()
  }, [navigate, searchParams, setAuthenticatedUser, showToast])

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-white">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 text-center shadow-2xl backdrop-blur-xl"
      >
        <LoadingLogo label="Connexion en cours..." />
      </motion.div>
    </main>
  )
}