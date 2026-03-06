import type { IUser } from '@/pages/users/types'
import type { Rule } from '@/plugins/casl/ability'

export interface LoginResponse {
  authorization: IAuthorization
  user: IUser
}

export interface PayloadLogin {
  email: string
  password: string
}

export interface IAuthorization {
  type: string
  token: string
  expires_in: number
  permissions: Rule[]
  subjects: string[]
}
