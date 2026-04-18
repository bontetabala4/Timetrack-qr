export type UserRole = 'admin' | 'user'

export type AuthUser = {
  id: number
  fullName: string
  email: string
  role: UserRole
}

export type LoginPayload = {
  email: string
  password: string
}

type FakeAccount = AuthUser & {
  password: string
}

const fakeAccounts: FakeAccount[] = [
  {
    id: 1,
    fullName: 'Admin TimeTrack',
    email: 'admin@timetrack.com',
    password: 'admin123',
    role: 'admin',
  },
  {
    id: 2,
    fullName: 'Jean Dupont',
    email: 'user@timetrack.com',
    password: 'user123',
    role: 'user',
  },
]

export async function fakeLogin(payload: LoginPayload): Promise<AuthUser> {
  await new Promise((resolve) => setTimeout(resolve, 1400))

  const account = fakeAccounts.find(
    (item) =>
      item.email.toLowerCase() === payload.email.toLowerCase() &&
      item.password === payload.password,
  )

  if (!account) {
    throw new Error('Email ou mot de passe incorrect')
  }

  const { password: _password, ...user } = account
  return user
}