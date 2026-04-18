export type UserStatus = 'Actif' | 'Suspendu'
export type UserRole = 'Employé' | 'Manager' | 'RH' | 'Admin'

export type UserItem = {
  id: number
  name: string
  email: string
  role: UserRole
  status: UserStatus
  department: string
  lastCheckIn: string
  phone: string
}

export const usersData: UserItem[] = [
  {
    id: 1,
    name: 'Jean Dupont',
    email: 'jean@timetrack.com',
    role: 'Employé',
    status: 'Actif',
    department: 'Informatique',
    lastCheckIn: '08:02',
    phone: '+243 900 000 001',
  },
  {
    id: 2,
    name: 'Marie Lambert',
    email: 'marie@timetrack.com',
    role: 'Manager',
    status: 'Actif',
    department: 'Ressources Humaines',
    lastCheckIn: '08:10',
    phone: '+243 900 000 002',
  },
  {
    id: 3,
    name: 'Paul Martin',
    email: 'paul@timetrack.com',
    role: 'Employé',
    status: 'Suspendu',
    department: 'Finance',
    lastCheckIn: '08:47',
    phone: '+243 900 000 003',
  },
  {
    id: 4,
    name: 'Sophie Durand',
    email: 'sophie@timetrack.com',
    role: 'RH',
    status: 'Actif',
    department: 'Ressources Humaines',
    lastCheckIn: '09:01',
    phone: '+243 900 000 004',
  },
  {
    id: 5,
    name: 'David Kabasele',
    email: 'david@timetrack.com',
    role: 'Admin',
    status: 'Actif',
    department: 'Direction',
    lastCheckIn: '07:58',
    phone: '+243 900 000 005',
  },
  {
    id: 6,
    name: 'Sarah Ngoma',
    email: 'sarah@timetrack.com',
    role: 'Employé',
    status: 'Actif',
    department: 'Logistique',
    lastCheckIn: '08:15',
    phone: '+243 900 000 006',
  },
]