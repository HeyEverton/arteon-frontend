import { slug } from '@codifytech/helpers/StringHelper'

import.meta.env.VITE_APP_NAME = 'CodifyTech'

export const config = {
  appName: import.meta.env.VITE_APP_NAME,
  appVersion: '1.0.0',
  apiBaseUrl: import.meta.env.VITE_API_URL,

  cookies: {
    accessToken: `accessToken${slug(import.meta.env.VITE_APP_NAME)}`,
    userData: `userData${slug(import.meta.env.VITE_APP_NAME)}`,
    userAbilities: `userAbilityRules${slug(import.meta.env.VITE_APP_NAME)}`,
    userSubjects: `userSubjects${slug(import.meta.env.VITE_APP_NAME)}`,
  },
}
