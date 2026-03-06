import type { ApiService } from '@codifytech/services/ApiService'

// Tipos para stores que usam o plugin CRUD
import type { CrudActions, CrudGetters } from '@/plugins/piniaCrudPlugin'

// Interface base para estados de stores CRUD
export interface CrudStoreState {
  _crud: boolean
  apiService: ApiService
  items: any[]
  item: any | null
  loading: boolean
  error: string | null
  validationErrors: Record<string, any>
  searchParams: Record<string, any>
  searchTerm: string
  isSearching: boolean
  currentPage: number
  lastPage: number
  total: number
  perPage: number
}

// Tipo helper para stores que usam CRUD
export type CrudStore<T = any> = CrudActions<T> & CrudGetters & {
  $crud: CrudActions<T> & CrudGetters
}

// Exemplo de como tipar uma store CRUD específica
export interface ExampleStoreState extends Partial<CrudStoreState> {
  _crud: true
  apiService: ApiService
  selectedItem: any | null
  filters: {
    status: string
  }
}

// Helper para criar stores CRUD tipadas
export function defineCrudStore(
  id: string,
  options: {
    state: () => any
    actions?: Record<string, (...args: any[]) => any>
    getters?: Record<string, (state: any) => any>
  },
) {
  // Esta função é apenas para tipagem
  // O verdadeiro poder vem do plugin que adiciona as funcionalidades
  return { id, ...options }
}
