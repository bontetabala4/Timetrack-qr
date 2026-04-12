import { motion } from 'motion/react'
import {
  BadgeCheck,
  Building2,
  IdCard,
  Mail,
  MapPin,
  Phone,
  Settings,
  ShieldCheck,
  Pencil,
  Save,
  X,
  RefreshCw,
  Image as ImageIcon,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import UserLayout from '../../components/layout/UserLayout'
import { useAuth } from '../../hooks/useAuth'
import { useToast } from '../../hooks/useToast'
import { updateMyProfile } from '../../services/auth'

export default function Profile() {
  const { user, token, setAuthenticatedUser } = useAuth()
  const { showToast } = useToast()

  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')

  useEffect(() => {
    setPhone(user?.phone || '')
    setAddress(user?.address || '')
  }, [user])

  const fullName = user?.fullName || 'Utilisateur'
  const email = user?.email || 'Non renseigné'
  const role = user?.role === 'admin' ? 'Administrateur' : 'Utilisateur'
  const status = user?.status === 'active' ? 'Actif' : user?.status || 'Actif'
  const department = user?.department || 'Non renseigné'
  const employeeId =
    user?.employeeId || `TT-USER-${String(user?.id || 0).padStart(3, '0')}`
  const avatarUrl = user?.avatarUrl || null

  const handleSave = async () => {
    if (!token || !user) return

    try {
      setIsSaving(true)

      const data = await updateMyProfile(token, {
        phone,
        address,
      })

      setAuthenticatedUser(data.user, token)
      setIsEditing(false)
      showToast('Profil mis à jour avec succès', 'success')
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Erreur lors de la sauvegarde'
      showToast(message, 'error')
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setPhone(user?.phone || '')
    setAddress(user?.address || '')
    setIsEditing(false)
  }

  const handleRefresh = () => {
    window.location.reload()
  }

  const handleGoogleAccount = () => {
    window.open('https://myaccount.google.com/', '_blank', 'noopener,noreferrer')
  }

  const handleSupport = () => {
    window.location.href = 'mailto:support@timetrack.local?subject=Support%20TimeTrack'
  }

  const handleContact = () => {
    window.location.href = 'tel:+243900000000'
  }

  const handlePhotoClick = () => {
    showToast('La modification de photo sera ajoutée côté admin/backend', 'info')
  }

  return (
    <UserLayout>
      <motion.header
        initial={{ opacity: 0, y: -18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="mb-6"
      >
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500 text-2xl font-bold text-slate-950 shadow-lg shadow-emerald-500/25">
            {fullName.charAt(0)}
          </div>

          <div className="flex-1">
            <h1 className="text-2xl font-bold sm:text-3xl">Mon profil</h1>
            <p className="mt-1 text-sm text-slate-300">
              Informations personnelles et professionnelles
            </p>
          </div>

          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-500"
            >
              <Pencil size={16} />
              Modifier
            </button>
          ) : (
            <button
              onClick={handleCancel}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-800 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
            >
              <X size={16} />
              Annuler
            </button>
          )}
        </div>
      </motion.header>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.05 }}
          className="rounded-[1.75rem] border border-white/10 bg-white/10 p-5 backdrop-blur-2xl"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={handlePhotoClick}
              className="group relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-3xl bg-slate-900/70 text-3xl font-bold text-white"
            >
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={fullName}
                  className="h-full w-full object-cover"
                />
              ) : (
                fullName.charAt(0)
              )}

              <div className="absolute inset-0 hidden items-center justify-center bg-black/45 text-white group-hover:flex">
                <ImageIcon size={20} />
              </div>
            </button>

            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white">{fullName}</h2>
              <p className="mt-1 text-sm text-slate-300">{role}</p>

              <span className="mt-3 inline-flex rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-400">
                {status}
              </span>

              <p className="mt-3 text-xs text-slate-400">
                Clique sur la photo pour l’emplacement de photo de profil
              </p>
            </div>
          </div>
        </motion.section>

        <motion.article
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="rounded-[1.5rem] border border-white/10 bg-white/10 p-5 backdrop-blur-2xl"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="flex items-start gap-3">
              <Mail size={18} className="mt-1 text-blue-400" />
              <div>
                <p className="text-xs text-slate-400">Adresse e-mail</p>
                <p className="mt-1 break-all text-white">{email}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <ShieldCheck size={18} className="mt-1 text-blue-400" />
              <div>
                <p className="text-xs text-slate-400">Rôle</p>
                <p className="mt-1 text-white">{role}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Building2 size={18} className="mt-1 text-blue-400" />
              <div>
                <p className="text-xs text-slate-400">Département</p>
                <p className="mt-1 text-white">{department}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <IdCard size={18} className="mt-1 text-blue-400" />
              <div>
                <p className="text-xs text-slate-400">Matricule</p>
                <p className="mt-1 text-white">{employeeId}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone size={18} className="mt-1 text-blue-400" />
              <div className="w-full">
                <p className="text-xs text-slate-400">Téléphone</p>

                {isEditing ? (
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+243..."
                    className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-emerald-500"
                  />
                ) : (
                  <p className="mt-1 text-white">{phone || 'Non renseigné'}</p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-3 sm:col-span-2">
              <MapPin size={18} className="mt-1 text-blue-400" />
              <div className="w-full">
                <p className="text-xs text-slate-400">Adresse</p>

                {isEditing ? (
                  <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Votre adresse..."
                    rows={3}
                    className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-emerald-500"
                  />
                ) : (
                  <p className="mt-1 text-white">{address || 'Non renseignée'}</p>
                )}
              </div>
            </div>
          </div>

          {isEditing && (
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="mt-6 flex w-full items-center justify-center gap-3 rounded-xl bg-emerald-500 px-4 py-3 font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSaving ? (
                <>
                  <span className="flex h-5 w-5 animate-spin items-center justify-center rounded-full border-2 border-slate-950/30 border-t-slate-950">
                    <span className="text-[10px] font-bold">TT</span>
                  </span>
                  Chargement...
                </>
              ) : (
                <>
                  <Save size={16} />
                  Enregistrer
                </>
              )}
            </button>
          )}
        </motion.article>

        <motion.article
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.16 }}
          className="rounded-[1.5rem] border border-white/10 bg-white/10 p-5 backdrop-blur-2xl xl:col-span-2"
        >
          <h3 className="text-lg font-semibold text-white">Actions rapides</h3>

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <button
              onClick={handleRefresh}
              className="flex items-center justify-center gap-2 rounded-2xl bg-slate-900/60 px-4 py-4 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              <RefreshCw size={18} />
              Actualiser
            </button>

            <button
              onClick={handleGoogleAccount}
              className="flex items-center justify-center gap-2 rounded-2xl bg-slate-900/60 px-4 py-4 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              <BadgeCheck size={18} />
              Compte Google
            </button>

            <button
              onClick={handleSupport}
              className="flex items-center justify-center gap-2 rounded-2xl bg-slate-900/60 px-4 py-4 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              <Mail size={18} />
              Support
            </button>

            <button
              onClick={handleContact}
              className="flex items-center justify-center gap-2 rounded-2xl bg-slate-900/60 px-4 py-4 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              <Phone size={18} />
              Contact
            </button>
          </div>
        </motion.article>
      </div>
    </UserLayout>
  )
}