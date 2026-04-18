import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { useToast } from '../../hooks/useToast'
import { registerAdminWithBackend } from '../../services/auth'
import logo from '../../assets/logo.png'

type OrganizationType =
  | 'entreprise'
  | 'ecole'
  | 'universite'
  | 'institution'
  | 'ong'
  | 'autre'

export default function Register() {
  const navigate = useNavigate()
  const { showToast } = useToast()

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [department, setDepartment] = useState('')
  const [phone, setPhone] = useState('')
  const [organizationName, setOrganizationName] = useState('')
  const [organizationType, setOrganizationType] =
    useState<OrganizationType>('entreprise')
  const [organizationEmail, setOrganizationEmail] = useState('')
  const [organizationPhone, setOrganizationPhone] = useState('')
  const [organizationAddress, setOrganizationAddress] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (isSubmitting) return

    try {
      setIsSubmitting(true)

      await registerAdminWithBackend({
        fullName,
        email,
        password,
        department: department || undefined,
        phone: phone || undefined,
        organizationName,
        organizationType,
        organizationEmail: organizationEmail || undefined,
        organizationPhone: organizationPhone || undefined,
        organizationAddress: organizationAddress || undefined,
      })

      showToast('Compte administrateur créé avec succès', 'success')
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
        className="relative z-10 w-full max-w-lg rounded-3xl border border-white/10 bg-white/5 p-8 text-white shadow-2xl backdrop-blur-xl"
      >
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center  text-2xl font-bold text-slate-950 shadow-lg shadow-emerald-500/30">
             <img
              src={logo}
              alt="TimeTrack QR Logo"
              className="h-auto w-full max-w-[220px] object-contain"
            />
          </div>

          <h1 className="text-3xl font-bold">Créer un compte admin</h1>
          <p className="mt-2 text-sm text-slate-300">
            Disponible uniquement tant qu’aucun administrateur n’existe
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Nom complet"
            disabled={isSubmitting}
            className="w-full rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 outline-none"
          />

          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@timetrack.com"
            disabled={isSubmitting}
            className="w-full rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 outline-none"
          />

          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mot de passe"
            disabled={isSubmitting}
            className="w-full rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 outline-none"
          />

          <input
            type="text"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            placeholder="Département"
            disabled={isSubmitting}
            className="w-full rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 outline-none"
          />

          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Téléphone"
            disabled={isSubmitting}
            className="w-full rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 outline-none"
          />

          <input
            type="text"
            required
            value={organizationName}
            onChange={(e) => setOrganizationName(e.target.value)}
            placeholder="Nom de l’organisation"
            disabled={isSubmitting}
            className="w-full rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 outline-none"
          />

          <select
            value={organizationType}
            onChange={(e) =>
              setOrganizationType(e.target.value as OrganizationType)
            }
            disabled={isSubmitting}
            className="w-full rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 outline-none"
          >
            <option value="entreprise">Entreprise</option>
            <option value="ecole">École</option>
            <option value="universite">Université</option>
            <option value="institution">Institution</option>
            <option value="ong">ONG</option>
            <option value="autre">Autre</option>
          </select>

          <input
            type="email"
            value={organizationEmail}
            onChange={(e) => setOrganizationEmail(e.target.value)}
            placeholder="Email de l’organisation"
            disabled={isSubmitting}
            className="w-full rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 outline-none"
          />

          <input
            type="text"
            value={organizationPhone}
            onChange={(e) => setOrganizationPhone(e.target.value)}
            placeholder="Téléphone de l’organisation"
            disabled={isSubmitting}
            className="w-full rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 outline-none"
          />

          <textarea
            value={organizationAddress}
            onChange={(e) => setOrganizationAddress(e.target.value)}
            placeholder="Adresse de l’organisation"
            rows={3}
            disabled={isSubmitting}
            className="w-full rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 outline-none"
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-3 rounded-xl bg-emerald-500 px-4 py-3 font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-80"
          >
            {isSubmitting ? 'Création...' : 'Créer le compte'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-300">
          Vous avez déjà un compte ?{' '}
          <Link
            to="/"
            className="font-semibold text-emerald-400 hover:text-emerald-300"
          >
            Se connecter
          </Link>
        </p>
      </motion.section>
    </main>
  )
}