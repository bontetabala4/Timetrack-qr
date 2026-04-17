import { motion } from 'motion/react'
import icon from '../../assets/icon.png'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

export default function Login() {
  const handleGoogleLogin = () => {
    window.location.href = `${BACKEND_URL}/api/auth/google/redirect`
  }

  return (
    <main className="user-theme-bg relative flex min-h-screen items-center justify-center overflow-hidden px-4 transition-colors duration-300">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.14),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.12),transparent_24%)]" />

      <motion.section
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.55, ease: 'easeOut' }}
        className="user-theme-card relative z-10 w-full max-w-md rounded-3xl p-8 text-center shadow-2xl backdrop-blur-xl transition-colors duration-300"
      >
        <div className="mb-8">
          <button
            type="button"
            onClick={() => window.location.assign('/')}
            className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500 text-2xl font-bold text-slate-950 shadow-lg shadow-emerald-500/30"
            title="Accueil"
          >
            <img
                  src={icon}
                  alt="TimeTrack QR Icon"
                  className="h-10 w-10 rounded-xl object-cover"
                />
          </button>

          <h1 className="text-3xl font-bold">TimeTrack User</h1>
          <p className="user-theme-muted mt-2 text-sm">
            Connecte-toi avec ton compte Google pour accéder à ton espace utilisateur.
          </p>
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          className="flex w-full items-center justify-center gap-3 rounded-xl bg-white px-4 py-3 font-semibold text-slate-900 transition hover:bg-slate-100"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 48 48"
            className="h-5 w-5"
            aria-hidden="true"
          >
            <path
              fill="#FFC107"
              d="M43.611 20.083H42V20H24v8h11.303C33.654 32.657 29.195 36 24 36c-6.627 0-12-5.373-12-12S17.373 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.27 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
            />
            <path
              fill="#FF3D00"
              d="M6.306 14.691l6.571 4.819C14.655 16.108 19.001 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.27 4 24 4c-7.682 0-14.347 4.337-17.694 10.691z"
            />
            <path
              fill="#4CAF50"
              d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.143 35.091 26.715 36 24 36c-5.175 0-9.621-3.329-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
            />
            <path
              fill="#1976D2"
              d="M43.611 20.083H42V20H24v8h11.303a12.05 12.05 0 0 1-4.084 5.571h.003l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
            />
          </svg>
          Se connecter avec Google
        </button>

        <div className="mt-6 rounded-2xl border border-white/10 px-4 py-3 text-left">
          <p className="text-sm font-semibold">Connexion utilisateur</p>
          <p className="user-theme-muted mt-1 text-sm">
            Les agents utilisent uniquement Google pour se connecter. Après validation,
            tu seras redirigé vers la page d’accueil.
          </p>
        </div>
      </motion.section>
    </main>
  )
}