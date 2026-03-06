interface IRole {
  title: string
  value: string
}

export interface IUser {
  id: string
  name: string
  email: string
  password?: string
  password_confirmation: string
  email_verified_at: string
  foto: string
  role: null | string | IRole
  termos: number
  ativo: number
}

export interface IItemsResponse {
  data: IUser[]
  total: number
  page: number
}
