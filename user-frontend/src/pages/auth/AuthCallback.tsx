import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useToast } from '../../hooks/useToast'
import { fetchMyProfile } from '../../services/profile'

export default function AuthCallback() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { setAuthenticatedUser } = useAuth()
  const { showToast } = useToast()

  useEffect(() => {
    const handleAuthCallback = async () => {
      const token = searchParams.get('token')
      const role = searchParams.get('role')

      if (!token) {
        showToast('Token de connexion manquant', 'error')
        navigate('/')
        return
      }

      try {
        const data = await fetchMyProfile(token)
        setAuthenticatedUser(data.user, token)

        if (role === 'user') {
          navigate('/home')
          return
        }

        navigate('/')
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Erreur de connexion'
        showToast(message, 'error')
        navigate('/')
      }
    }

    void handleAuthCallback()
  }, [navigate, searchParams, setAuthenticatedUser, showToast])

  return (
    <main className="user-theme-bg flex min-h-screen items-center justify-center px-4 transition-colors duration-300">
      <div className="user-theme-card w-full max-w-md rounded-3xl p-8 text-center shadow-2xl backdrop-blur-xl transition-colors duration-300">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500 text-2xl font-bold text-slate-950">
          TT
        </div>

        <h1 className="text-2xl font-bold">Connexion en cours...</h1>
        <p className="user-theme-muted mt-2 text-sm">
          Vérification de ton compte Google et préparation de ton espace utilisateur.
        </p>

        <div className="mt-6 flex items-center justify-center gap-3">
          <span className="flex h-6 w-6 animate-spin items-center justify-center rounded-full border-2 border-current/20 border-t-current">
            <span className="text-[10px] font-bold">TT</span>
          </span>
          <span className="user-theme-muted text-sm">Patiente un instant</span>
        </div>
      </div>
    </main>
  )
}