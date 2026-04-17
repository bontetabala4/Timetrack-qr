import { useEffect, useState } from 'react'
import UserLayout from '../../components/layout/UserLayout'
import { useAuth } from '../../hooks/useAuth'
import { useToast } from '../../hooks/useToast'
import { fetchMyProfile, updateMyProfile } from '../../services/profile'

type UserProfile = {
  id: number
  fullName: string
  email: string
  role: 'admin' | 'user'
  status?: string
  department?: string | null
  phone?: string | null
  address?: string | null
  employeeId?: string | null
  avatarUrl?: string | null
  authProvider?: string
  organizationId?: number | null
} | null

export default function Profile() {
  const { token } = useAuth()
  const { showToast } = useToast()

  const [profile, setProfile] = useState<UserProfile>(null)
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const loadProfile = async () => {
    if (!token) return

    try {
      setLoading(true)
      const data = await fetchMyProfile(token)
      setProfile(data.user)
      setPhone(data.user.phone || '')
      setAddress(data.user.address || '')
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Erreur de chargement du profil'
      showToast(message, 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadProfile()
  }, [token])

  const handleSave = async () => {
    if (!token) return

    try {
      setIsSaving(true)

      const data = await updateMyProfile(token, {
        phone,
        address,
      })

      setProfile(data.user)
      setPhone(data.user.phone || '')
      setAddress(data.user.address || '')
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

  return (
    <UserLayout>
      <section className="space-y-6">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Mon profil</h1>
              <p className="mt-2 text-sm text-slate-300">
                Consulte et modifie tes informations personnelles.
              </p>
            </div>

            {!loading && (
              <button
                onClick={() => setIsEditing((value) => !value)}
                className="rounded-xl bg-emerald-500 px-4 py-3 font-semibold text-slate-950 transition hover:bg-emerald-400"
              >
                {isEditing ? 'Annuler' : 'Modifier'}
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-slate-300 shadow-2xl backdrop-blur-xl">
            Chargement du profil...
          </div>
        ) : (
          <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl bg-slate-900/50 p-4">
                <p className="text-sm text-slate-400">Nom complet</p>
                <p className="mt-2 font-semibold text-white">
                  {profile?.fullName || 'Non renseigné'}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-900/50 p-4">
                <p className="text-sm text-slate-400">Email</p>
                <p className="mt-2 font-semibold text-white">
                  {profile?.email || 'Non renseigné'}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-900/50 p-4">
                <p className="text-sm text-slate-400">Matricule</p>
                <p className="mt-2 font-semibold text-white">
                  {profile?.employeeId || 'Non renseigné'}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-900/50 p-4">
                <p className="text-sm text-slate-400">Département</p>
                <p className="mt-2 font-semibold text-white">
                  {profile?.department || 'Non renseigné'}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-900/50 p-4">
                <p className="text-sm text-slate-400">Téléphone</p>
                {isEditing ? (
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none"
                    placeholder="Téléphone"
                  />
                ) : (
                  <p className="mt-2 font-semibold text-white">
                    {phone || 'Non renseigné'}
                  </p>
                )}
              </div>

              <div className="rounded-2xl bg-slate-900/50 p-4">
                <p className="text-sm text-slate-400">Statut</p>
                <p className="mt-2 font-semibold text-white">
                  {profile?.status || 'Non renseigné'}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-900/50 p-4 md:col-span-2">
                <p className="text-sm text-slate-400">Adresse</p>
                {isEditing ? (
                  <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    rows={4}
                    className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none"
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
        )}
      </section>
    </UserLayout>
  )
}