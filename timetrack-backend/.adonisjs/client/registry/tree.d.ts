/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  auth: {
    register: typeof routes['auth.register']
    login: typeof routes['auth.login']
    me: typeof routes['auth.me']
    logout: typeof routes['auth.logout']
  }
  googleAuth: {
    redirect: typeof routes['google_auth.redirect']
    callback: typeof routes['google_auth.callback']
  }
  attendances: {
    scan: typeof routes['attendances.scan']
    myHistory: typeof routes['attendances.my_history']
    myToday: typeof routes['attendances.my_today']
  }
  users: {
    updateMe: typeof routes['users.update_me']
  }
}
