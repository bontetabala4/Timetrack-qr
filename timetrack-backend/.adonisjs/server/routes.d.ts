import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'auth.register': { paramsTuple?: []; params?: {} }
    'auth.login': { paramsTuple?: []; params?: {} }
    'auth.me': { paramsTuple?: []; params?: {} }
    'auth.logout': { paramsTuple?: []; params?: {} }
    'google_auth.redirect': { paramsTuple?: []; params?: {} }
    'google_auth.callback': { paramsTuple?: []; params?: {} }
    'attendances.scan': { paramsTuple?: []; params?: {} }
    'attendances.my_history': { paramsTuple?: []; params?: {} }
    'attendances.my_today': { paramsTuple?: []; params?: {} }
    'users.update_me': { paramsTuple?: []; params?: {} }
  }
  GET: {
    'auth.me': { paramsTuple?: []; params?: {} }
    'google_auth.redirect': { paramsTuple?: []; params?: {} }
    'google_auth.callback': { paramsTuple?: []; params?: {} }
    'attendances.my_history': { paramsTuple?: []; params?: {} }
    'attendances.my_today': { paramsTuple?: []; params?: {} }
  }
  HEAD: {
    'auth.me': { paramsTuple?: []; params?: {} }
    'google_auth.redirect': { paramsTuple?: []; params?: {} }
    'google_auth.callback': { paramsTuple?: []; params?: {} }
    'attendances.my_history': { paramsTuple?: []; params?: {} }
    'attendances.my_today': { paramsTuple?: []; params?: {} }
  }
  POST: {
    'auth.register': { paramsTuple?: []; params?: {} }
    'auth.login': { paramsTuple?: []; params?: {} }
    'auth.logout': { paramsTuple?: []; params?: {} }
    'attendances.scan': { paramsTuple?: []; params?: {} }
  }
  PUT: {
    'users.update_me': { paramsTuple?: []; params?: {} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}