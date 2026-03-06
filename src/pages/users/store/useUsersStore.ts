import type { IUser } from './../types'
import type { IRole } from '@/pages/acesso/types'
import UsersService from '@/pages/users/services/UsersService'

export const useUsersStore = defineStore('users', {
  state: () => ({
    // Marca que esta store deve usar o plugin CRUD
    _crud: true,

    // Injeta o service da API
    apiService: UsersService,

    defaultPerPage: 15,
    defaultSortKey: 'name',

    // Injeta a Interface
    defaultValue: {
      id: '',
      foto: '',
      nome: '',
      email: '',
      ativo: 1,
      roles: [] as IRole[],
    } as Partial<IUser>,

    roles: [] as IRole[],
    loadingRoles: false,
  }),

  actions: {
    async fetchCargos() {
      this.loadingRoles = true
      this.apiService
        .fetchRolesList<{
        data: IRole[]
      }>()
        .then(({ data }) => {
          this.roles = data
          this.loadingRoles = false
        })
        .catch(() => {
          this.roles = []
          this.loadingRoles = false
        })
    },
  },
})
