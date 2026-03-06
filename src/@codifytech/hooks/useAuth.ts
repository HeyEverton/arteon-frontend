import type { IAbilities } from '@/pages/auth/login/types'
import type { IUser } from '@/pages/users/types'
import type { Rule } from '@/plugins/casl/ability'
import { config } from '@codifytech/config/app'
import moment from 'moment/moment'

export const useAuth = () => {
  const isLoggedIn = () => {
    // Logic to check if the user is authenticated
    return !!useCookie<IUser>(config.cookies.accessToken).value
  }

  const user = () => {
    return useCookie<IUser>(config.cookies.userData).value as IUser
  }

  const getAbilities = () => {
    return {
      permissions: useLocalStorage<Rule[]>(config.cookies.userAbilities, []).value,
      subjects: useLocalStorage<string[]>(config.cookies.userSubjects, []).value,
    }
  }

  const setUser = (userData: IUser) => {
    useCookie<IUser>(config.cookies.userData).value = userData
  }

  const setAccessToken = (token: string) => {
    useCookie<string>(config.cookies.accessToken).value = token
  }

  const setAbilitiesRules = (abilities: IAbilities) => {
    useLocalStorage<Rule[]>(config.cookies.userAbilities, []).value = abilities.permissions || []
    useLocalStorage<string[]>(config.cookies.userSubjects, []).value = abilities.subjects || []
  }

  const emailVerification = () => {
    useCookie<IUser>(config.cookies.userData).value = {
      ...useCookie<IUser>(config.cookies.userData).value,
      email_verified_at: moment().toDate().toString(),
    }
  }

  const logout = () => {
    useCookie(config.cookies.userData).value = null
    useCookie(config.cookies.accessToken).value = null
    useLocalStorage(config.cookies.userAbilities, []).value = []
    useLocalStorage(config.cookies.userSubjects, []).value = []
  }

  return {
    isLoggedIn,
    user,
    getAbilities,
    setUser,
    setAccessToken,
    setAbilitiesRules,
    emailVerification,
    logout,
  }
}
