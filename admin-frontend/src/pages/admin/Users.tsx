import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import AdminLayout from '../../components/layout/AdminLayout'
import SearchInput from '../../components/ui/SearchInput'
import { useAuth } from '../../hooks/useAuth'
import { useToast } from '../../hooks/useToast'
import {
  fetchAdminUsers,
  updateAdminUser,
  type AdminUser,
  createAdminUser,
  deleteAdminUser,
} from '../../services/users'

export default function Users() {
  const { token } = useAuth()
  const { showToast } = useToast()

  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('Tous')
  const [statusFilter, setStatusFilter] = useState('Tous')
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [deletingUserId, setDeletingUserId] = useState<number | null>(null)

  const [newFullName, setNewFullName] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [newPhone, setNewPhone] = useState('')
  const [newAddress, setNewAddress] = useState('')
  const [newDepartment, setNewDepartment] = useState('')
  const [newEmployeeId, setNewEmployeeId] = useState('')
  const [newRole, setNewRole] = useState<'admin' | 'user'>('user')
  const [newStatus, setNewStatus] = useState<'active' | 'suspended'>('active')

  const loadUsers = async () => {
    if (!token) return

    try {
      setLoading(true)

      const data = await fetchAdminUsers(token, {
        search,
        role: roleFilter === 'Tous' ? '' : roleFilter,
        status: statusFilter === 'Tous' ? '' : statusFilter,
      })

      setUsers(data.data)
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Erreur de chargement'
      showToast(message, 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadUsers()
  }, [token, search, roleFilter, statusFilter])

  const handleSave = async () => {
    if (!token || !selectedUser) return

    try {
      setIsSaving(true)

      const data = await updateAdminUser(token, selectedUser.id, {
        phone: selectedUser.phone,
        address: selectedUser.address,
        department: selectedUser.department,
        employeeId: selectedUser.employeeId,
        role: selectedUser.role,
        status: selectedUser.status,
      })

      setUsers((current) =>
        current.map((item) => (item.id === data.user.id ? data.user : item))
      )

      setSelectedUser(data.user)
      showToast('Agent mis à jour avec succès', 'success')
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Erreur lors de la sauvegarde'
      showToast(message, 'error')
    } finally {
      setIsSaving(false)
    }
  }

  const handleCreateUser = async () => {
    if (!token) return

    try {
      setIsCreating(true)

      const data = await createAdminUser(token, {
        fullName: newFullName,
        email: newEmail,
        phone: newPhone || undefined,
        address: newAddress || undefined,
        department: newDepartment || undefined,
        employeeId: newEmployeeId,
        role: newRole,
        status: newStatus,
      })

      setUsers((current) => [data.user, ...current])
      setIsCreateOpen(false)

      setNewFullName('')
      setNewEmail('')
      setNewPhone('')
      setNewAddress('')
      setNewDepartment('')
      setNewEmployeeId('')
      setNewRole('user')
      setNewStatus('active')

      showToast('Agent créé avec succès', 'success')
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Erreur lors de la création'
      showToast(message, 'error')
    } finally {
      setIsCreating(false)
    }
  }

  const handleDeleteUser = async (userId: number, fullName: string) => {
    if (!token) return

    const confirmed = window.confirm(
      `Voulez-vous vraiment supprimer le compte de ${fullName} ?`
    )

    if (!confirmed) return

    try {
      setDeletingUserId(userId)

      const data = await deleteAdminUser(token, userId)

      setUsers((current) => current.filter((item) => item.id !== userId))

      if (selectedUser?.id === userId) {
        setSelectedUser(null)
      }

      showToast(data.message || 'Agent supprimé avec succès', 'success')
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Erreur lors de la suppression'
      showToast(message, 'error')
    } finally {
      setDeletingUserId(null)
    }
  }

  const badgeClass = (status: string) =>
    status === 'active'
      ? 'bg-emerald-500/15 text-emerald-400'
      : 'bg-red-500/15 text-red-400'

  return (
    <AdminLayout
      title="Gestion des agents"
      subtitle="Consulte et modifie les agents de votre organisation"
    >
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-semibold text-white">Agents</h2>

        <button
          onClick={() => setIsCreateOpen((value) => !value)}
          className="rounded-xl bg-emerald-500 px-4 py-3 font-semibold text-slate-950 transition hover:bg-emerald-400"
        >
          {isCreateOpen ? 'Fermer le formulaire' : 'Ajouter un agent'}
        </button>
      </div>

      {isCreateOpen && (
        <section className="mb-6 rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <h3 className="mb-4 text-lg font-semibold text-white">Créer un agent</h3>

          <div className="grid gap-4 md:grid-cols-2">
            <input
              value={newFullName}
              onChange={(e) => setNewFullName(e.target.value)}
              placeholder="Nom complet"
              className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none"
            />
            <input
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="Email"
              type="email"
              className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none"
            />
            <input
              value={newPhone}
              onChange={(e) => setNewPhone(e.target.value)}
              placeholder="Téléphone"
              className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none"
            />
            <input
              value={newDepartment}
              onChange={(e) => setNewDepartment(e.target.value)}
              placeholder="Département"
              className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none"
            />
            <input
              value={newEmployeeId}
              onChange={(e) => setNewEmployeeId(e.target.value)}
              placeholder="Matricule"
              className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none"
            />
            <select
              value={newRole}
              onChange={(e) => setNewRole(e.target.value as 'admin' | 'user')}
              className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none"
            >
              <option value="user">agent</option>
              <option value="admin">admin</option>
            </select>
            <select
              value={newStatus}
              onChange={(e) =>
                setNewStatus(e.target.value as 'active' | 'suspended')
              }
              className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none"
            >
              <option value="active">active</option>
              <option value="suspended">suspended</option>
            </select>
            <textarea
              value={newAddress}
              onChange={(e) => setNewAddress(e.target.value)}
              placeholder="Adresse"
              rows={4}
              className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none md:col-span-2"
            />
          </div>

          <button
            onClick={() => void handleCreateUser()}
            disabled={isCreating}
            className="mt-5 flex items-center justify-center gap-3 rounded-xl bg-emerald-500 px-4 py-3 font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isCreating ? 'Création...' : 'Créer un agent'}
          </button>
        </section>
      )}

      <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
        <div className="mb-5 grid grid-cols-1 gap-4 xl:grid-cols-[1.4fr_220px_220px]">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Rechercher par nom, email ou matricule..."
          />

          <select
            value={roleFilter}
            onChange={(event) => setRoleFilter(event.target.value)}
            className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none"
          >
            <option>Tous</option>
            <option>admin</option>
            <option>user</option>
          </select>

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none"
          >
            <option>Tous</option>
            <option>active</option>
            <option>suspended</option>
          </select>
        </div>

        {loading ? (
          <div className="text-slate-300">Chargement des agents...</div>
        ) : (
          <>
            <div className="space-y-4 lg:hidden">
              {users.map((user, index) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.03 }}
                  className="rounded-2xl border border-slate-800 bg-slate-800/40 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-white">{user.fullName}</p>
                      <p className="mt-1 text-sm text-slate-400">{user.email}</p>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${badgeClass(user.status)}`}
                    >
                      {user.status}
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-slate-500">Rôle</p>
                      <p className="text-slate-200">
                        {user.role === 'user' ? 'agent' : user.role}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-500">Département</p>
                      <p className="text-slate-200">{user.department || '-'}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Matricule</p>
                      <p className="text-slate-200">{user.employeeId || '-'}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Téléphone</p>
                      <p className="text-slate-200">{user.phone || '-'}</p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                    <button
                      onClick={() => setSelectedUser(user)}
                      className="rounded-lg bg-slate-700 px-3 py-2 text-sm text-white transition hover:bg-slate-600"
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => void handleDeleteUser(user.id, user.fullName)}
                      disabled={deletingUserId === user.id}
                      className="rounded-lg bg-red-500/15 px-3 py-2 text-sm text-red-400 transition hover:bg-red-500/25 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {deletingUserId === user.id ? 'Suppression...' : 'Supprimer'}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full min-w-[760px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-slate-800 text-sm text-slate-400">
                    <th className="pb-3 font-medium">Nom</th>
                    <th className="pb-3 font-medium">Email</th>
                    <th className="pb-3 font-medium">Rôle</th>
                    <th className="pb-3 font-medium">Département</th>
                    <th className="pb-3 font-medium">Matricule</th>
                    <th className="pb-3 font-medium">Statut</th>
                    <th className="pb-3 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.25, delay: index * 0.03 }}
                      className="border-b border-slate-800/70"
                    >
                      <td className="py-4 text-white">{user.fullName}</td>
                      <td className="py-4 text-slate-300">{user.email}</td>
                      <td className="py-4 text-slate-300">
                        {user.role === 'user' ? 'agent' : user.role}
                      </td>
                      <td className="py-4 text-slate-300">{user.department || '-'}</td>
                      <td className="py-4 text-slate-300">{user.employeeId || '-'}</td>
                      <td className="py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${badgeClass(user.status)}`}
                        >
                          {user.status}
                        </span>
                      </td>
                      <td className="py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedUser(user)}
                            className="rounded-lg bg-slate-800 px-3 py-2 text-sm text-slate-300 transition hover:bg-slate-700 hover:text-white"
                          >
                            Modifier
                          </button>
                          <button
                            onClick={() => void handleDeleteUser(user.id, user.fullName)}
                            disabled={deletingUserId === user.id}
                            className="rounded-lg bg-red-500/15 px-3 py-2 text-sm text-red-400 transition hover:bg-red-500/25 disabled:cursor-not-allowed disabled:opacity-70"
                          >
                            {deletingUserId === user.id ? 'Suppression...' : 'Supprimer'}
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </section>

      {selectedUser && (
        <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-xl font-semibold text-white">
              Modifier l’agent {selectedUser.fullName}
            </h3>

            <button
              onClick={() => setSelectedUser(null)}
              className="rounded-lg bg-slate-800 px-3 py-2 text-sm text-white transition hover:bg-slate-700"
            >
              Fermer
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <input
              value={selectedUser.phone || ''}
              onChange={(e) =>
                setSelectedUser({ ...selectedUser, phone: e.target.value })
              }
              placeholder="Téléphone"
              className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none"
            />

            <input
              value={selectedUser.department || ''}
              onChange={(e) =>
                setSelectedUser({ ...selectedUser, department: e.target.value })
              }
              placeholder="Département"
              className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none"
            />

            <input
              value={selectedUser.employeeId || ''}
              onChange={(e) =>
                setSelectedUser({ ...selectedUser, employeeId: e.target.value })
              }
              placeholder="Matricule"
              className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none"
            />

            <select
              value={selectedUser.role}
              onChange={(e) =>
                setSelectedUser({
                  ...selectedUser,
                  role: e.target.value as 'admin' | 'user',
                })
              }
              className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none"
            >
              <option value="admin">admin</option>
              <option value="user">agent</option>
            </select>

            <select
              value={selectedUser.status}
              onChange={(e) =>
                setSelectedUser({
                  ...selectedUser,
                  status: e.target.value as 'active' | 'suspended',
                })
              }
              className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none"
            >
              <option value="active">active</option>
              <option value="suspended">suspended</option>
            </select>

            <textarea
              value={selectedUser.address || ''}
              onChange={(e) =>
                setSelectedUser({ ...selectedUser, address: e.target.value })
              }
              placeholder="Adresse"
              rows={4}
              className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none md:col-span-2"
            />
          </div>

          <button
            onClick={() => void handleSave()}
            disabled={isSaving}
            className="mt-5 flex items-center justify-center gap-3 rounded-xl bg-emerald-500 px-4 py-3 font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSaving ? 'Chargement...' : 'Enregistrer'}
          </button>
        </section>
      )}
    </AdminLayout>
  )
}