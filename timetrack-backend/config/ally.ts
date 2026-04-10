import env from '#start/env'
import { defineConfig, services } from '@adonisjs/ally'

export default defineConfig({
  google: services.google({
    clientId: env.get('GOOGLE_CLIENT_ID'),
    clientSecret: env.get('GOOGLE_CLIENT_SECRET')!,
    callbackUrl: env.get('GOOGLE_CALLBACK_URL')!,
  }),
})