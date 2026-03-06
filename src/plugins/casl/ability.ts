import type { actions, subjects } from '@/configs/abilityConfig'
import { createMongoAbility } from '@casl/ability'

type Actions = typeof actions[number]
type Subjects = typeof subjects[number]

export interface Rule { action: Actions, subject: Subjects }

export const ability = createMongoAbility<[Actions, Subjects]>()
