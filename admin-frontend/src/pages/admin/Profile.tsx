import { useEffect, useState } from 'react'
import AdminLayout from '../../components/layout/AdminLayout'
import { useAuth } from '../../hooks/useAuth'
import { useToast } from '../../hooks/useToast'
import { updateAdminProfile } from '../../services/profile'

export default function Profile() {
  const { user, token, setAuthenticatedUser } = useAuth()
  const { showToast } = useToast()

  const [isEditing, setIsEditing] = useState(false)
  const [phone, setPhone] = useState('')
  const [department, setDepartment] = useState('')
  const [address, setAddress] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    setPhone(user?.phone || '')
    setDepartment(user?.department || '')
    setAddress(user?.address || '')
  }, [user])

  const handleSave = async () => {
    if (!token || !user) return

    try {
      setIsSaving(true)

      const data = await updateAdminProfile(token, {
        phone,
        department,
        address,
      })

      setAuthenticatedUser(data.user, token)
      showToast('Profil mis à jour avec succès', 'success')
      setIsEditing(false)
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Erreur lors de la mise à jour'
      showToast(message, 'error')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <AdminLayout
      title="Profil administrateur"
      subtitle="Informations du compte connecté"
    >
      <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">Mon profil</h2>
            <p className="mt-1 text-sm text-slate-400">
              Consulte et modifie certaines informations du compte.
            </p>
          </div>

          <button
            onClick={() => setIsEditing((value) => !value)}
            className="rounded-xl bg-emerald-500 px-4 py-3 font-semibold text-slate-950 transition hover:bg-emerald-400"
          >
            {isEditing ? 'Annuler' : 'Modifier'}
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl bg-slate-800/60 p-4">
            <p className="text-sm text-slate-400">Nom complet</p>
            <p className="mt-2 font-semibold text-white">
              {user?.fullName || 'Non renseigné'}
            </p>
          </div>

          <div className="rounded-2xl bg-slate-800/60 p-4">
            <p className="text-sm text-slate-400">Email</p>
            <p className="mt-2 font-semibold text-white">
              {user?.email || 'Non renseigné'}
            </p>
          </div>

          <div className="rounded-2xl bg-slate-800/60 p-4">
            <p className="text-sm text-slate-400">Rôle</p>
            <p className="mt-2 font-semibold text-white">
              {user?.role || 'Non renseigné'}
            </p>
          </div>

          <div className="rounded-2xl bg-slate-800/60 p-4">
            <p className="text-sm text-slate-400">Matricule</p>
            <p className="mt-2 font-semibold text-white">
              {user?.employeeId || 'Non renseigné'}
            </p>
          </div>

          <div className="rounded-2xl bg-slate-800/60 p-4">
            <p className="text-sm text-slate-400">Téléphone</p>
            {isEditing ? (
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none"
                placeholder="Téléphone"
              />
            ) : (
              <p className="mt-2 font-semibold text-white">
                {phone || 'Non renseigné'}
              </p>
            )}
          </div>

          <div className="rounded-2xl bg-slate-800/60 p-4">
            <p className="text-sm text-slate-400">Département</p>
            {isEditing ? (
              <input
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none"
                placeholder="Département"
              />
            ) : (
              <p className="mt-2 font-semibold text-white">
                {department || 'Non renseigné'}
              </p>
            )}
          </div>

          <div className="rounded-2xl bg-slate-800/60 p-4 md:col-span-2">
            <p className="text-sm text-slate-400">Adresse</p>
            {isEditing ? (
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={4}
                className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none"
                placeholder="Adresse"
              />
            ) : (
              <p className="mt-2 font-semibold text-white">
                {address || 'Non renseignée'}
              </p>
            )}
          </div>
        </div>

        {isEditing && (
          <button
            onClick={() => void handleSave()}
            disabled={isSaving}
            className="mt-6 flex items-center justify-center gap-3 rounded-xl bg-emerald-500 px-4 py-3 font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSaving ? (
              <>
                <span className="flex h-5 w-5 animate-spin items-center justify-center rounded-full border-2 border-slate-950/30 border-t-slate-950">
                  <span className="text-[10px] font-bold">TT</span>
                </span>
                Enregistrement...
              </>
            ) : (
              'Enregistrer'
            )}
          </button>
        )}
      </section>
    </AdminLayout>
  )
}