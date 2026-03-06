export interface QueryString {
  sort_by?: string
  sort_order?: 'asc' | 'desc'
  page?: number
  per_page?: number
}
export interface SortOptions {
  sort_by?: string
  sort_order?: 'asc' | 'desc'
}

export interface StateHandler {
  side: 'end' | 'start' | 'both'
  done: (status: 'error' | 'loading' | 'empty' | 'ok') => void
}

export interface ITerm {
  title: string
  value: string
  relationship?: string
  mask?: string
  type?: 'TEXT' | 'ENUM'
  options?: string | any[]
}

export interface ISearch {
  field?: string
  search?: string
  relationship?: string
}

export interface ActionItem {
  method?: (...args: any) => void
  icon?: string
  color?: string
  text?: string
}

export interface Actions {
  save?: ActionItem
  update?: ActionItem
  reset?: ActionItem
  [key: string]: ActionItem | undefined
}

export interface ResponseItems<T> {
  data: T[]
  total: number
  page: number
  last_page: number
}

export type StoreOf<S extends () => any> = ReturnType<S>
