import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'auth.register': { paramsTuple?: []; params?: {} }
    'auth.login': { paramsTuple?: []; params?: {} }
    'auth.forgot_password': { paramsTuple?: []; params?: {} }
    'auth.reset_password': { paramsTuple?: []; params?: {} }
    'auth.me': { paramsTuple?: []; params?: {} }
    'auth.logout': { paramsTuple?: []; params?: {} }
    'google_auth.redirect': { paramsTuple?: []; params?: {} }
    'google_auth.callback': { paramsTuple?: []; params?: {} }
    'attendances.scan': { paramsTuple?: []; params?: {} }
    'attendances.my_history': { paramsTuple?: []; params?: {} }
    'attendances.my_today': { paramsTuple?: []; params?: {} }
    'users.dashboard': { paramsTuple?: []; params?: {} }
    'users.notifications': { paramsTuple?: []; params?: {} }
    'users.index': { paramsTuple?: []; params?: {} }
    'users.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'users.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'users.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'users.store': { paramsTuple?: []; params?: {} }
    'users.reports': { paramsTuple?: []; params?: {} }
    'users.dashboard_charts': { paramsTuple?: []; params?: {} }
    'users.update_me': { paramsTuple?: []; params?: {} }
    'qr_codes.current': { paramsTuple?: []; params?: {} }
    'qr_codes.generate': { paramsTuple?: []; params?: {} }
    'settings.change_password': { paramsTuple?: []; params?: {} }
    'settings.upload_avatar': { paramsTuple?: []; params?: {} }
  }
  GET: {
    'auth.me': { paramsTuple?: []; params?: {} }
    'google_auth.redirect': { paramsTuple?: []; params?: {} }
    'google_auth.callback': { paramsTuple?: []; params?: {} }
    'attendances.my_history': { paramsTuple?: []; params?: {} }
    'attendances.my_today': { paramsTuple?: []; params?: {} }
    'users.dashboard': { paramsTuple?: []; params?: {} }
    'users.notifications': { paramsTuple?: []; params?: {} }
    'users.index': { paramsTuple?: []; params?: {} }
    'users.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'users.reports': { paramsTuple?: []; params?: {} }
    'users.dashboard_charts': { paramsTuple?: []; params?: {} }
    'qr_codes.current': { paramsTuple?: []; params?: {} }
  }
  HEAD: {
    'auth.me': { paramsTuple?: []; params?: {} }
    'google_auth.redirect': { paramsTuple?: []; params?: {} }
    'google_auth.callback': { paramsTuple?: []; params?: {} }
    'attendances.my_history': { paramsTuple?: []; params?: {} }
    'attendances.my_today': { paramsTuple?: []; params?: {} }
    'users.dashboard': { paramsTuple?: []; params?: {} }
    'users.notifications': { paramsTuple?: []; params?: {} }
    'users.index': { paramsTuple?: []; params?: {} }
    'users.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'users.reports': { paramsTuple?: []; params?: {} }
    'users.dashboard_charts': { paramsTuple?: []; params?: {} }
    'qr_codes.current': { paramsTuple?: []; params?: {} }
  }
  POST: {
    'auth.register': { paramsTuple?: []; params?: {} }
    'auth.login': { paramsTuple?: []; params?: {} }
    'auth.forgot_password': { paramsTuple?: []; params?: {} }
    'auth.reset_password': { paramsTuple?: []; params?: {} }
    'auth.logout': { paramsTuple?: []; params?: {} }
    'attendances.scan': { paramsTuple?: []; params?: {} }
    'users.store': { paramsTuple?: []; params?: {} }
    'qr_codes.generate': { paramsTuple?: []; params?: {} }
    'settings.change_password': { paramsTuple?: []; params?: {} }
    'settings.upload_avatar': { paramsTuple?: []; params?: {} }
  }
  PUT: {
    'users.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'users.update_me': { paramsTuple?: []; params?: {} }
  }
  DELETE: {
    'users.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}