import type { ApiService } from '@codifytech/services/ApiService'
import type { IOrderBy } from '@codifytech/types/layoutTable'

import type { StateHandler } from 'v3-infinite-loading/lib/types'
import type { VForm } from 'vuetify/components/VForm'
import 'pinia'

declare module 'pinia' {
  export interface PiniaCustomStateProperties<S> {
    _crud?: boolean
    apiService?: ApiService
    form: VForm | undefined
    formKey: number
    data: S['defaultValue']
    items: S['defaultValue'][]
    searchParams: Record<string, any>
    isSearching: boolean
    currentPage: number
    lastPage: number
    total: number
    perPage: number
    stateHandler: StateHandler | undefined
    stateHandlerKey: number
    orderBy: IOrderBy
    crudLoading: {
      save: boolean
      item: boolean
      items: boolean
      delete: boolean
    }
  }

  export interface PiniaCustomProperties<S, G, A> {

    // Actions CRUD
    fetchAll(params?: any): Promise<void>
    fetchItem(id?: string): Promise<void>
    create(): Promise<void>
    update(id?: string): Promise<void>
    destroy(id?: string): Promise<void>
    loadMore(state: StateHandler): Promise<void>
    handleError(error: any): void
    clearErrors(): void
    reset(): void
    resetForm(): void
    search(term: string, column?: string, relation?: string): Promise<void>
    setSearchParams(params: Record<string, any>): void
    resetSearch(): void
    onOrderBy(state: StateHandler, value: IOrderBy): void

    // Getters CRUD
    isEmpty: boolean
    hasItems: boolean
    canLoadMore: boolean
    searchResultsCount: number
  }
}
