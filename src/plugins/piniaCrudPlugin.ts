import type { ApiService } from '@codifytech/services/ApiService'
import type { IOrderBy } from '@codifytech/types/layoutTable'
import type { PiniaPluginContext } from 'pinia'
import type { StateHandler } from 'v3-infinite-loading/lib/types'
import type { VForm } from 'vuetify/components/VForm'
import { useConfirmDialogStore } from '@codifytech/stores/useConfirmDialogStore'
import { useSnackbarStore } from '@codifytech/stores/useSnackbarStore'
import { useValidationDialogStore } from '@codifytech/stores/useValidationDialogStore'
import { ref, toRef } from 'vue'

interface CrudPluginOptions {
  apiService?: ApiService
  defaultPerPage?: number
  defaultValue?: any
  messages?: {
    created?: string
    updated?: string
    deleted?: string
    unexpectedError?: string
    validationErrors?: string
  }
}

export function createPiniaCrudPlugin(options: CrudPluginOptions = {}) {
  const {
    defaultPerPage = 10,
    messages = {
      created: 'Criado com sucesso',
      updated: 'Atualizado com sucesso',
      deleted: 'Removido com sucesso',
      unexpectedError: 'Erro inesperado',
      validationErrors: 'Erros de validação',
    },
  } = options

  return function crudPlugin({ store }: PiniaPluginContext) {
    // Só adiciona as funcionalidades CRUD se a store tiver uma propriedade '_crud' ou 'apiService'
    if (!('_crud' in store.$state) && !('apiService' in store.$state))
      return

    const apiService = (store.$state as any).apiService || options.apiService

    if (!apiService) {
      console.warn(
        'CrudPlugin: ApiService não encontrado na store ou nas opções do plugin',
      )

      return
    }

    // Cria as propriedades reativas
    const form = ref<VForm | undefined>(undefined)
    const formKey = ref<number>(Math.floor(Math.random() * 1000000) + Date.now())
    const data = ref({ ...((store.$state as any)?.defaultValue || {}) })
    const items = ref([])

    const orderBy = ref<IOrderBy>({
      key: store.$state.sortKeyDefault ?? 'id',
      order: 'asc',
    })

    const searchParams = ref({})
    const isSearching = ref(false)
    const currentPage = ref(0)
    const lastPage = ref(1)
    const total = ref(0)
    const perPage = ref(store.$state.defaultPerPage ?? defaultPerPage)

    const stateHandler = ref<StateHandler>()
    const stateHandlerKey = ref<number>(Math.floor(Math.random() * 1000000) + Date.now())
    const router = useRouter()

    const crudLoading = ref({
      save: false,
      item: false,
      items: false,
      delete: false,
    })

    // Adiciona as propriedades no $state para serialização SSR
    const currentState = store.$state as any

    currentState.form = form.value
    currentState.formKey = formKey.value
    currentState.data = data.value
    currentState.items = items.value
    currentState.items = items.value
    currentState.orderBy = orderBy.value
    currentState.isSearching = isSearching.value
    currentState.searchParams = searchParams.value
    currentState.currentPage = currentPage.value
    currentState.lastPage = lastPage.value
    currentState.total = total.value
    currentState.perPage = perPage.value
    currentState.crudLoading = crudLoading.value
    currentState.stateHandler = stateHandler.value
    currentState.stateHandlerKey = stateHandlerKey.value
    currentState.error = null
    currentState.validationErrors = {}

    // Cria referências reativas na store
    ;(store as any).form = toRef(store.$state, 'form')
    ;(store as any).formKey = toRef(store.$state, 'formKey')
    ;(store as any).data = toRef(store.$state, 'data')
    ;(store as any).items = toRef(store.$state, 'items')
    ;(store as any).orderBy = toRef(store.$state, 'orderBy')
    ;(store as any).isSearching = toRef(store.$state, 'isSearching')
    ;(store as any).searchParams = toRef(store.$state, 'searchParams')
    ;(store as any).currentPage = toRef(store.$state, 'currentPage')
    ;(store as any).lastPage = toRef(store.$state, 'lastPage')
    ;(store as any).total = toRef(store.$state, 'total')
    ;(store as any).perPage = toRef(store.$state, 'perPage')
    ;(store as any).crudLoading = toRef(store.$state, 'crudLoading')
    ;(store as any).stateHandler = toRef(store.$state, 'stateHandler')
    ;(store as any).stateHandlerKey = toRef(store.$state, 'stateHandlerKey')
    ;(store as any).error = toRef(store.$state, 'error')
    ;(store as any).validationErrors = toRef(store.$state, 'validationErrors')

    // Helper para obter as stores necessárias
    const getSnackbarStore = () => {
      try {
        return useSnackbarStore()
      }
      catch {
        console.warn('CrudPlugin: SnackbarStore não encontrada')

        return null
      }
    }

    const getValidationDialogStore = () => {
      try {
        return useValidationDialogStore()
      }
      catch {
        console.warn('CrudPlugin: ValidationDialogStore não encontrada')

        return null
      }
    }

    // Actions CRUD
    const crudActions = {
      /**
       * Fetches all items from the API using the provided parameters.
       *
       * Sets the loading state before initiating the request and resets it after completion.
       * On success, updates the store's items array with the fetched data.
       * If pagination information is present in the response, updates pagination-related store properties.
       * Handles errors by delegating to the `handleError` method.
       *
       * @param params - Optional query parameters to be sent with the API request.
       * @returns A promise that resolves when the fetch operation is complete.
       */
      async fetchAll(params?: any) {
        store.crudLoading.items = true

        try {
          const responseData = await apiService.get(params)

          store.items = Array.isArray(responseData) ? responseData : responseData.data || []

          if (responseData.last_page) {
            store.lastPage = responseData.last_page
            store.total = responseData.total || 0
            store.currentPage = responseData.current_page || 1
            store.perPage = responseData.per_page || defaultPerPage
          }
        }
        catch (err: any) {
          store.handleError(err)
        }
        finally {
          store.crudLoading.items = false
        }
      },

      /**
       * Fetches a single item by its ID and updates the store with the retrieved data.
       *
       * Sets the loading state for the item, clears any previous errors, and attempts to fetch the item
       * using the provided `apiService`. On success, updates the store's `item` property with the response data.
       * Handles errors by delegating to `handleError`, and ensures the loading state is reset after the operation.
       *
       * @param id - The unique identifier of the item to fetch.
       * @returns A promise that resolves when the fetch operation is complete.
       */
      async fetchItem(id: string) {
        store.crudLoading.item = true
        store.error = null

        try {
          store.data = await apiService.get({}, id)
        }
        catch (err: any) {
          store.handleError(err)
        }
        finally {
          store.crudLoading.item = false
        }
      },

      /**
       * Função de pesquisa que usa o endpoint /search/by/{column}/{value}/{relation?}
       * @param term - Termo de pesquisa
       * @param column - Coluna para pesquisar (padrão: 'name')
       * @param relation - Relação opcional para pesquisa em tabelas relacionadas
       *
       * Exemplo de uso:
       * - search('João', 'name') -> GET /search/by/name/João
       * - search('admin@teste.com', 'email') -> GET /search/by/email/admin@teste.com
       * - search('Admin', 'name', 'roles') -> GET /search/by/name/Admin/roles
       */
      async search(term: string, column: string = 'name', relation?: string) {
        store.isSearching = true
        store.currentPage = 1

        // Define os parâmetros de pesquisa para uso no loadMore
        store.searchParams = {
          search: term,
          searchColumn: column,
          searchRelation: relation,
        }

        store.crudLoading.items = true

        try {
          // Usa o endpoint de pesquisa
          let searchEndpoint = `search/by/${column}/${encodeURIComponent(term)}`
          if (relation)
            searchEndpoint += `/${relation}`

          const response = await apiService.get({
            page: 1,
            per_page: store.perPage,
          }, searchEndpoint)

          const responseData = Array.isArray(response) ? response : response.data || []

          store.items = responseData

          // Atualiza informações de paginação se disponível
          if (response.last_page) {
            store.lastPage = response.last_page
            store.total = response.total || 0
            store.currentPage = response.current_page || 1
            store.perPage = response.per_page || store.perPage
          }
        }
        catch (err: any) {
          store.handleError(err)
        }
        finally {
          store.crudLoading.items = false
          store.isSearching = false
        }
      },

      /**
       * Creates a new resource using the provided payload.
       *
       * This method sets the loading state, clears previous errors, and attempts to create a new resource
       * by sending a POST request via the `apiService`. On success, it displays a success snackbar notification.
       * If an error occurs, it handles the error and rethrows it. The loading state is reset after the operation completes.
       *
       * @param payload - The data to be sent in the creation request.
       * @returns A promise that resolves with the response data from the API.
       * @throws Rethrows any error encountered during the creation process after handling it.
       */
      async create() {
        store.crudLoading.save = true

        try {
          const responseData = await apiService.post(store.data)
          const snackbar = getSnackbarStore()

          snackbar?.showSnackbar({
            text: messages.created!,
            location: 'top center',
            color: 'success',
          })

          if (store.items?.length !== 0)
            store.items.push(responseData)

          store.data = { ...((store.$state as any).defaultValue || {}) }
          store.resetForm()
          router?.replace(`/${router.currentRoute.value.path.split('/')[1]}`)

          return responseData
        }
        catch (err: any) {
          store.handleError(err)
          throw err
        }
        finally {
          store.crudLoading.save = false
        }
      },

      /**
       * Updates an existing resource with the specified `id` using the provided `payload`.
       *
       * Sets the `crudLoading.save` flag to `true` while the update operation is in progress,
       * and resets it to `false` when finished. Clears any existing errors before attempting the update.
       *
       * On success, displays a success snackbar notification and returns the response data.
       * On failure, handles the error and rethrows it.
       *
       * @param id - The unique identifier of the resource to update.
       * @returns A promise that resolves with the response data from the API.
       * @throws Rethrows any error encountered during the update operation.
       */
      async update(id?: string) {
        store.crudLoading.save = true

        try {
          const responseData = await apiService.put(store.data, store.data.id || id)
          const snackbar = getSnackbarStore()

          snackbar?.showSnackbar({
            text: messages.updated!,
            location: 'top center',
            color: 'success',
          })

          // Atualiza o item na listagem
          const index = store.items.findIndex(item => item.id === (store.data.id || id))
          if (index !== -1)
            store.items[index] = { ...store.items[index], ...responseData }

          // Reseta o formulário e dados
          store.data = { ...((store.$state as any).defaultValue || {}) }
          store.resetForm()
          router?.replace(`/${router.currentRoute.value.path.split('/')[1]}`)

          return responseData
        }
        catch (err: any) {
          store.handleError(err)
          throw err
        }
        finally {
          store.crudLoading.save = false
        }
      },

      /**
       * Deletes an item by its ID using the API service.
       *
       * Sets the loading state for deletion, attempts to delete the item,
       * and displays a success snackbar notification upon successful deletion.
       * Handles errors by invoking `handleError` and rethrows the error.
       * Resets the loading state after the operation completes.
       *
       * @param id - The unique identifier of the item to delete.
       * @throws Will rethrow any error encountered during the deletion process.
       */
      async destroy(id: string) {
        useConfirmDialogStore().showConfirmDialog(
          'Deseja realmente excluir este item?',
          'Sim, excluir',
          'Não, cancelar',
          store.crudLoading.delete,
          async () => {
            store.crudLoading.delete = true

            try {
              await apiService.delete(id)

              const snackbar = getSnackbarStore()

              const index = store.items.findIndex(item => item.id === id)

              store.items.splice(index, 1)

              snackbar?.showSnackbar({
                text: messages.deleted!,
                location: 'top center',
                color: 'success',
              })
            }
            catch (err: any) {
              store.handleError(err)
              throw err
            }
            finally {
              store.crudLoading.delete = false
            }
          },
        )
      },

      /**
       * Loads the next page of items and appends them to the current store.
       *
       * This method supports both standard pagination and search-based pagination.
       * If search parameters are active, it uses a search endpoint; otherwise, it uses the default endpoint.
       * Updates the store's loading state, handles errors, and manages pagination state.
       *
       * @param state - The StateHandler instance used to control the loading state (e.g., `complete`, `loaded`).
       *
       * @remarks
       * - Sets `store.crudLoading.items` to `true` while loading.
       * - Clears previous errors before starting the request.
       * - Increments the current page and fetches the next set of items.
       * - If no more data is returned, marks the state as complete.
       * - Appends new items to `store.items` and updates pagination info.
       * - Handles errors and ensures loading state is reset in all cases.
       */
      async loadMore(state: StateHandler) {
        if (store.crudLoading.items || (store.currentPage || 0) >= (store.lastPage || 1)) {
          state.complete()

          return
        }

        if (store.currentPage === 0)
          store.crudLoading.items = true

        const nextPage = (store.currentPage || 0) + 1
        const hasSearchParams = store.searchParams && Object.keys(store.searchParams).length > 0
        const searchValue = store.searchParams?.search

        store.isSearching = hasSearchParams

        try {
          const response = hasSearchParams && searchValue
            ? await apiService.post({
              field: store.searchParams?.searchColumn || 'name',
              value: searchValue,
              relationship: store.searchParams?.searchRelation,
              page: nextPage,
              per_page: store.perPage,
              sort_by: store.searchParams?.searchColumn || store.orderBy.key,
              sort_order: store.orderBy.order,
            }, 'search')
            : await apiService.get({
              ...store.searchParams,
              page: nextPage,
              per_page: store.perPage,
              sort_by: store.orderBy.key,
              sort_order: store.orderBy.order,
            })

          const responseData = response.data

          if (!responseData || responseData.length === 0) {
            state.complete()

            return
          }

          store.items = [...(store.items || []), ...responseData]
          store.currentPage = nextPage
          store.lastPage = response?.last_page

          if ((store.currentPage || 1) >= (store.lastPage || 1))
            state.complete()
          else
            state.loaded()
        }
        catch (err: any) {
          store?.handleError(err)
          state?.complete()
        }
        finally {
          store.crudLoading.items = false
        }
      },

      setSearchParams(params: Record<string, any>) {
        store.searchParams = { ...store.searchParams, ...params }
      },

      handleError(err: any) {
        store.error = err.message || messages.unexpectedError!

        if (err.status === 422) {
          store.validationErrors = err.errors || {}

          const validationDialog = getValidationDialogStore()

          validationDialog?.showValidationDialog(
            messages.validationErrors!,
            err.errors,
          )
        }
        else {
          const snackbar = getSnackbarStore()

          snackbar?.showSnackbar({
            text: store.error || 'Erro desconhecido',
            location: 'top center',
            color: 'error',
            timeout: 5000,
          })
        }
      },

      reset() {
        store.items = []
        store.data = { ...((store.$state as any).defaultValue || {}) }
        store.crudLoading = {
          save: false,
          item: false,
          items: false,
          delete: false,
        }
        store.currentPage = 0
        store.lastPage = 1
        store.total = 0
        store.stateHandlerKey = Math.floor(Math.random() * 1000000) + Date.now()
        store.resetSearch()
      },
      resetSearch() {
        store.searchParams = {}
        store.isSearching = false
      },
      resetForm() {
        store?.form?.reset()
      },
      async onOrderBy(state: StateHandler, value: IOrderBy[]) {
        store.orderBy = value.length > 0
          ? { key: value[0].key, order: value[0].order }
          : { key: store.sortKeyDefault, order: 'asc' }

        store.items = []
        store.currentPage = 0
        store.crudLoading.items = false

        await store.loadMore(state)
      },
    }

    // Getters CRUD
    const crudGetters = {
      get isEmpty() {
        return !store.items || store.items.length === 0
      },

      get hasItems() {
        return Boolean(store.items && store.items.length > 0)
      },

      get canLoadMore() {
        return (store.currentPage || 1) < (store.lastPage || 1)
      },
    }

    // Adiciona as actions na store
    Object.assign(store, crudActions)

    // Adiciona os getters na store
    Object.assign(store, crudGetters)

    return store
  }
}
