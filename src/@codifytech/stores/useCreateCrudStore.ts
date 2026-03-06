import type { ApiService } from '@codifytech/services/ApiService'
import type { ResponseItems } from '@codifytech/types/globalTypes'
import type { StateTree } from 'pinia'
import type { StateHandler } from 'v3-infinite-loading/lib/types'
import type { VForm } from 'vuetify/components/VForm'
import { useSnackbarStore } from '@codifytech/stores/useSnackbarStore'
import { useValidationDialogStore } from '@codifytech/stores/useValidationDialogStore'
import { defineStore } from 'pinia'

interface CrudState<T> {
  form: VForm
  items: T[]
  item: T | null
  loading: boolean
  error: string | null

  searchParams: Record<string, any>
  searchTerm: string
  isSearching: boolean

  currentPage: number
  lastPage: number
  total: number
  perPage: number
}

interface CrudStoreOptions<T> {
  state: () => T
  actions: Record<string, (...args: any) => any>
  getters: Record<string, (state: CrudState<T>) => any>
}

export interface CrudActions {
  loadMore: (this: any, state: StateHandler) => () => Promise<void>
  fetchItems: (this: any, params?: any) => () => Promise<void>
  fetchItem: (this: any, id: string) => () => Promise<any>
  create: (this: any, payload: any) => () => Promise<any>
  update: (this: any, id: string, payload: any) => () => Promise<any>
  delete: (this: any, id: string) => () => Promise<void>
  resetForm: () => () => void
}

export interface CrudGetters<T> {
  hasError: (state: T) => boolean
  hasValidationErrors: (state: T) => boolean
}

export function createCrudStore<T extends StateTree>(
  storeId: string,
  service: ApiService,
  options: CrudStoreOptions<T>,
) {
  const snackbar = useSnackbarStore()
  const validationDialog = useValidationDialogStore()

  return defineStore(storeId, {
    state: () => ({
      form: {} as VForm,
      items: [] as T[],
      item: null as T | null,
      loading: false,
      error: null as string | null,

      searchParams: {},
      searchTerm: '',
      isSearching: false,

      currentPage: 1,
      lastPage: 1,
      total: 0,
      perPage: 10, // Default items per page
      ...(options?.state ? options.state() : {}),
    }),
    actions: {
      async fetchAll(this: any, params?: any) {
        this.loading = true
        this.error = null
        try {
          const data = await service.get<T[]>(params)

          this.items = data
        }
        catch (e: any) {
          this.handleError(e)
        }
        finally {
          this.loading = false
        }
      },

      async fetchItem(this: any, id: string) {
        this.loading = true
        this.error = null
        try {
          const data = await service.get<T>({}, id)

          this.item = data
        }
        catch (e: any) {
          this.handleError(e)
        }
        finally {
          this.loading = false
        }
      },

      async create(this: any, payload: any) {
        this.loading = true
        this.clearErrors()
        try {
          const data = await service.post<T>(payload)

          snackbar.showSnackbar({
            text: 'Criado com sucesso',
            location: 'top center',
            color: 'success',
          })

          return data
        }
        catch (e: any) {
          this.handleError(e)
          throw e
        }
        finally {
          this.loading = false
        }
      },

      async update(this: any, id: string, payload: any) {
        this.loading = true
        this.clearErrors()
        try {
          const data = await service.put<T>(payload, id)

          snackbar.showSnackbar({
            text: 'Atualizado com sucesso',
            location: 'top center',
            color: 'success',
          })

          return data
        }
        catch (e: any) {
          this.handleError(e)
          throw e
        }
        finally {
          this.loading = false
        }
      },

      async delete(this: any, id: string) {
        this.loading = true
        this.error = null
        try {
          await service.delete<T>(id)
          snackbar.showSnackbar({
            text: 'Removido com sucesso',
            location: 'top center',
            color: 'success',
          })
        }
        catch (e: any) {
          this.handleError(e)
          throw e
        }
        finally {
          this.loading = false
        }
      },

      async loadMore(this: any, state: StateHandler) {
        this.loading = true
        this.clearErrors()
        try {
          const nextPage = this.currentPage + 1

          const response = await service.get<ResponseItems<T>>({
            ...this.searchParams,
            page: nextPage,
            per_page: this.perPage,
          })

          const data = response.data

          if (!data || data.length === 0) {
            state.complete()

            return
          }

          this.items = [...this.items, ...data]
          this.currentPage = nextPage
          this.lastPage = response?.last_page ?? this.lastPage

          // Se atingiu a última página, finaliza
          if (this.currentPage >= this.lastPage)
            state.complete()
          else
            state.loaded()
        }
        catch (e: any) {
          this.handleError(e)
          state.complete()
        }
        finally {
          this.loading = false
        }
      },

      handleError(this: any, e: any) {
        this.error = e.message || 'Erro inesperado'

        if (e.status === 422) {
          // 422 Laravel → mostrar no ValidationDialog
          validationDialog.showValidationDialog('Erros de validação', e.errors)
        }
        else {
          // Outros → Snackbar genérico
          snackbar.showSnackbar({
            text: this.error,
            location: 'top center',
            color: 'error',
            timeout: 5000,
          })
        }
      },

      clearErrors(this: any) {
        this.error = null
        this.validationErrors = {}
      },

      reset() {
      },

      resetForm() {
      },

      ...(options?.actions || {}),
    },
    getters: {
      ...(options?.getters || {}),
    },
  })
}
