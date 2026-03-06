import type { App } from 'vue'

import { createMongoAbility } from '@casl/ability'
import { abilitiesPlugin } from '@casl/vue'
import { useAuth } from '@codifytech/hooks/useAuth'

export default function (app: App) {
  const userAbilityRules = useAuth().getAbilities()
  const initialAbility = createMongoAbility(userAbilityRules.permissions ?? [])

  app.use(abilitiesPlugin, initialAbility, {
    useGlobalProperties: true,
  })
}
