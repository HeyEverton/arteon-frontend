import type { IUser } from '@/pages/users/types'

export interface IPermission {
  id?: string
  name: string
  crud: string
  actions: IAction[]
}

export interface IActionsAdded {
  id: string
  action: string
}

export interface IAction {
  id?: string
  title: string
  action: string
}

export interface IRole {
  id?: string
  name: string
  permissions: IPermission[] | string[]
}

export interface IRoleResponse {
  data: IRole[]
  total: number
}

export interface IPermissionResponse {
  data: IPermission[]
  page: number
  total: number
}

export interface IUsuarioResponse {
  data: IUser[]
  page: number
  total: number
}
