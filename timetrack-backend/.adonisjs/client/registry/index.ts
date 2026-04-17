/* eslint-disable prettier/prettier */
import type { AdonisEndpoint } from '@tuyau/core/types'
import type { Registry } from './schema.d.ts'
import type { ApiDefinition } from './tree.d.ts'

const placeholder: any = {}

const routes = {
  'auth.register': {
    methods: ["POST"],
    pattern: '/api/auth/register',
    tokens: [{"old":"/api/auth/register","type":0,"val":"api","end":""},{"old":"/api/auth/register","type":0,"val":"auth","end":""},{"old":"/api/auth/register","type":0,"val":"register","end":""}],
    types: placeholder as Registry['auth.register']['types'],
  },
  'auth.login': {
    methods: ["POST"],
    pattern: '/api/auth/login',
    tokens: [{"old":"/api/auth/login","type":0,"val":"api","end":""},{"old":"/api/auth/login","type":0,"val":"auth","end":""},{"old":"/api/auth/login","type":0,"val":"login","end":""}],
    types: placeholder as Registry['auth.login']['types'],
  },
  'auth.forgot_password': {
    methods: ["POST"],
    pattern: '/api/auth/forgot-password',
    tokens: [{"old":"/api/auth/forgot-password","type":0,"val":"api","end":""},{"old":"/api/auth/forgot-password","type":0,"val":"auth","end":""},{"old":"/api/auth/forgot-password","type":0,"val":"forgot-password","end":""}],
    types: placeholder as Registry['auth.forgot_password']['types'],
  },
  'auth.reset_password': {
    methods: ["POST"],
    pattern: '/api/auth/reset-password',
    tokens: [{"old":"/api/auth/reset-password","type":0,"val":"api","end":""},{"old":"/api/auth/reset-password","type":0,"val":"auth","end":""},{"old":"/api/auth/reset-password","type":0,"val":"reset-password","end":""}],
    types: placeholder as Registry['auth.reset_password']['types'],
  },
  'auth.me': {
    methods: ["GET","HEAD"],
    pattern: '/api/auth/me',
    tokens: [{"old":"/api/auth/me","type":0,"val":"api","end":""},{"old":"/api/auth/me","type":0,"val":"auth","end":""},{"old":"/api/auth/me","type":0,"val":"me","end":""}],
    types: placeholder as Registry['auth.me']['types'],
  },
  'auth.logout': {
    methods: ["POST"],
    pattern: '/api/auth/logout',
    tokens: [{"old":"/api/auth/logout","type":0,"val":"api","end":""},{"old":"/api/auth/logout","type":0,"val":"auth","end":""},{"old":"/api/auth/logout","type":0,"val":"logout","end":""}],
    types: placeholder as Registry['auth.logout']['types'],
  },
  'google_auth.redirect': {
    methods: ["GET","HEAD"],
    pattern: '/api/auth/google/redirect',
    tokens: [{"old":"/api/auth/google/redirect","type":0,"val":"api","end":""},{"old":"/api/auth/google/redirect","type":0,"val":"auth","end":""},{"old":"/api/auth/google/redirect","type":0,"val":"google","end":""},{"old":"/api/auth/google/redirect","type":0,"val":"redirect","end":""}],
    types: placeholder as Registry['google_auth.redirect']['types'],
  },
  'google_auth.callback': {
    methods: ["GET","HEAD"],
    pattern: '/api/auth/google/callback',
    tokens: [{"old":"/api/auth/google/callback","type":0,"val":"api","end":""},{"old":"/api/auth/google/callback","type":0,"val":"auth","end":""},{"old":"/api/auth/google/callback","type":0,"val":"google","end":""},{"old":"/api/auth/google/callback","type":0,"val":"callback","end":""}],
    types: placeholder as Registry['google_auth.callback']['types'],
  },
  'attendances.scan': {
    methods: ["POST"],
    pattern: '/api/attendances/scan',
    tokens: [{"old":"/api/attendances/scan","type":0,"val":"api","end":""},{"old":"/api/attendances/scan","type":0,"val":"attendances","end":""},{"old":"/api/attendances/scan","type":0,"val":"scan","end":""}],
    types: placeholder as Registry['attendances.scan']['types'],
  },
  'attendances.my_history': {
    methods: ["GET","HEAD"],
    pattern: '/api/attendances/me/history',
    tokens: [{"old":"/api/attendances/me/history","type":0,"val":"api","end":""},{"old":"/api/attendances/me/history","type":0,"val":"attendances","end":""},{"old":"/api/attendances/me/history","type":0,"val":"me","end":""},{"old":"/api/attendances/me/history","type":0,"val":"history","end":""}],
    types: placeholder as Registry['attendances.my_history']['types'],
  },
  'attendances.my_today': {
    methods: ["GET","HEAD"],
    pattern: '/api/attendances/me/today',
    tokens: [{"old":"/api/attendances/me/today","type":0,"val":"api","end":""},{"old":"/api/attendances/me/today","type":0,"val":"attendances","end":""},{"old":"/api/attendances/me/today","type":0,"val":"me","end":""},{"old":"/api/attendances/me/today","type":0,"val":"today","end":""}],
    types: placeholder as Registry['attendances.my_today']['types'],
  },
  'users.dashboard': {
    methods: ["GET","HEAD"],
    pattern: '/api/admin/dashboard',
    tokens: [{"old":"/api/admin/dashboard","type":0,"val":"api","end":""},{"old":"/api/admin/dashboard","type":0,"val":"admin","end":""},{"old":"/api/admin/dashboard","type":0,"val":"dashboard","end":""}],
    types: placeholder as Registry['users.dashboard']['types'],
  },
  'users.notifications': {
    methods: ["GET","HEAD"],
    pattern: '/api/admin/notifications',
    tokens: [{"old":"/api/admin/notifications","type":0,"val":"api","end":""},{"old":"/api/admin/notifications","type":0,"val":"admin","end":""},{"old":"/api/admin/notifications","type":0,"val":"notifications","end":""}],
    types: placeholder as Registry['users.notifications']['types'],
  },
  'users.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/admin/users',
    tokens: [{"old":"/api/admin/users","type":0,"val":"api","end":""},{"old":"/api/admin/users","type":0,"val":"admin","end":""},{"old":"/api/admin/users","type":0,"val":"users","end":""}],
    types: placeholder as Registry['users.index']['types'],
  },
  'users.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/admin/users/:id',
    tokens: [{"old":"/api/admin/users/:id","type":0,"val":"api","end":""},{"old":"/api/admin/users/:id","type":0,"val":"admin","end":""},{"old":"/api/admin/users/:id","type":0,"val":"users","end":""},{"old":"/api/admin/users/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['users.show']['types'],
  },
  'users.update': {
    methods: ["PUT"],
    pattern: '/api/admin/users/:id',
    tokens: [{"old":"/api/admin/users/:id","type":0,"val":"api","end":""},{"old":"/api/admin/users/:id","type":0,"val":"admin","end":""},{"old":"/api/admin/users/:id","type":0,"val":"users","end":""},{"old":"/api/admin/users/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['users.update']['types'],
  },
  'users.destroy': {
    methods: ["DELETE"],
    pattern: '/api/admin/users/:id',
    tokens: [{"old":"/api/admin/users/:id","type":0,"val":"api","end":""},{"old":"/api/admin/users/:id","type":0,"val":"admin","end":""},{"old":"/api/admin/users/:id","type":0,"val":"users","end":""},{"old":"/api/admin/users/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['users.destroy']['types'],
  },
  'users.store': {
    methods: ["POST"],
    pattern: '/api/admin/users',
    tokens: [{"old":"/api/admin/users","type":0,"val":"api","end":""},{"old":"/api/admin/users","type":0,"val":"admin","end":""},{"old":"/api/admin/users","type":0,"val":"users","end":""}],
    types: placeholder as Registry['users.store']['types'],
  },
  'users.reports': {
    methods: ["GET","HEAD"],
    pattern: '/api/admin/reports',
    tokens: [{"old":"/api/admin/reports","type":0,"val":"api","end":""},{"old":"/api/admin/reports","type":0,"val":"admin","end":""},{"old":"/api/admin/reports","type":0,"val":"reports","end":""}],
    types: placeholder as Registry['users.reports']['types'],
  },
  'users.dashboard_charts': {
    methods: ["GET","HEAD"],
    pattern: '/api/admin/dashboard/charts',
    tokens: [{"old":"/api/admin/dashboard/charts","type":0,"val":"api","end":""},{"old":"/api/admin/dashboard/charts","type":0,"val":"admin","end":""},{"old":"/api/admin/dashboard/charts","type":0,"val":"dashboard","end":""},{"old":"/api/admin/dashboard/charts","type":0,"val":"charts","end":""}],
    types: placeholder as Registry['users.dashboard_charts']['types'],
  },
  'users.update_me': {
    methods: ["PUT"],
    pattern: '/api/users/me',
    tokens: [{"old":"/api/users/me","type":0,"val":"api","end":""},{"old":"/api/users/me","type":0,"val":"users","end":""},{"old":"/api/users/me","type":0,"val":"me","end":""}],
    types: placeholder as Registry['users.update_me']['types'],
  },
  'qr_codes.current': {
    methods: ["GET","HEAD"],
    pattern: '/api/qrcodes/current',
    tokens: [{"old":"/api/qrcodes/current","type":0,"val":"api","end":""},{"old":"/api/qrcodes/current","type":0,"val":"qrcodes","end":""},{"old":"/api/qrcodes/current","type":0,"val":"current","end":""}],
    types: placeholder as Registry['qr_codes.current']['types'],
  },
  'qr_codes.generate': {
    methods: ["POST"],
    pattern: '/api/qrcodes/generate',
    tokens: [{"old":"/api/qrcodes/generate","type":0,"val":"api","end":""},{"old":"/api/qrcodes/generate","type":0,"val":"qrcodes","end":""},{"old":"/api/qrcodes/generate","type":0,"val":"generate","end":""}],
    types: placeholder as Registry['qr_codes.generate']['types'],
  },
  'settings.change_password': {
    methods: ["POST"],
    pattern: '/api/settings/change-password',
    tokens: [{"old":"/api/settings/change-password","type":0,"val":"api","end":""},{"old":"/api/settings/change-password","type":0,"val":"settings","end":""},{"old":"/api/settings/change-password","type":0,"val":"change-password","end":""}],
    types: placeholder as Registry['settings.change_password']['types'],
  },
  'settings.upload_avatar': {
    methods: ["POST"],
    pattern: '/api/settings/avatar',
    tokens: [{"old":"/api/settings/avatar","type":0,"val":"api","end":""},{"old":"/api/settings/avatar","type":0,"val":"settings","end":""},{"old":"/api/settings/avatar","type":0,"val":"avatar","end":""}],
    types: placeholder as Registry['settings.upload_avatar']['types'],
  },
} as const satisfies Record<string, AdonisEndpoint>

export { routes }

export const registry = {
  routes,
  $tree: {} as ApiDefinition,
}

declare module '@tuyau/core/types' {
  export interface UserRegistry {
    routes: typeof routes
    $tree: ApiDefinition
  }
}
