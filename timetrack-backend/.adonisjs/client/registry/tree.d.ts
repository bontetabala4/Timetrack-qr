/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  auth: {
    register: typeof routes['auth.register']
    login: typeof routes['auth.login']
    forgotPassword: typeof routes['auth.forgot_password']
    resetPassword: typeof routes['auth.reset_password']
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
    dashboard: typeof routes['users.dashboard']
    notifications: typeof routes['users.notifications']
    index: typeof routes['users.index']
    show: typeof routes['users.show']
    update: typeof routes['users.update']
    destroy: typeof routes['users.destroy']
    store: typeof routes['users.store']
    reports: typeof routes['users.reports']
    dashboardCharts: typeof routes['users.dashboard_charts']
    updateMe: typeof routes['users.update_me']
  }
  qrCodes: {
    current: typeof routes['qr_codes.current']
    generate: typeof routes['qr_codes.generate']
  }
  settings: {
    changePassword: typeof routes['settings.change_password']
    uploadAvatar: typeof routes['settings.upload_avatar']
  }
}
