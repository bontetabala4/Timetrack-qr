import { Link, isRouteErrorResponse, useRouteError } from 'react-router-dom'

export default function ErrorPage() {
  const error = useRouteError()

  let title = 'Une erreur est survenue'
  let message = "La page demandée n'existe pas ou une erreur s'est produite."

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      title = '404 - Page introuvable'
      message = "La page que vous cherchez n'existe pas."
    } else {
      title = `${error.status} - Erreur`
      message = error.statusText || message
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-white">
      <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-white/5 p-8 text-center shadow-2xl backdrop-blur-xl">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500 text-2xl font-bold text-white">
          !
        </div>

        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="mt-3 text-sm text-slate-300">{message}</p>

        <div className="mt-6 flex justify-center gap-3">
          <Link
            to="/admin/dashboard"
            className="rounded-xl bg-emerald-500 px-4 py-3 font-semibold text-slate-950 transition hover:bg-emerald-400"
          >
            Aller au dashboard
          </Link>

          <Link
            to="/"
            className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3 font-semibold text-white transition hover:bg-slate-800"
          >
            Retour connexion
          </Link>
        </div>
      </div>
    </main>
  )
}