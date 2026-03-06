import { useApi } from '@codifytech/hooks/useApi'
import Utils from '@codifytech/utils'

// src/services/ApiService.ts
import { objectToFormData } from '@octetstream/object-to-form-data'

export class ApiService {
  protected api
  protected resource: string

  constructor(resource: string) {
    this.api = useApi()
    this.resource = resource
  }

  protected formatPayload(data: any): { data: any, headers: any } {
    const headers = { 'Content-Type': 'application/json' }

    data = Utils.cleanEmptyFieldsPayload(data)

    // Detecta se há arquivos para enviar
    const containsFile = Utils.hasFiles(data)

    if (containsFile)
      return { data: objectToFormData(data), headers: { 'Content-Type': 'multipart/form-data' } }

    return { data, headers }
  }

  protected getURL(url: string, query?: any): string {
    query = Utils.cleanEmptyFieldsPayload(query)
    query = objectToFormData(query)

    // Converte o objeto de consulta em uma string de consulta
    const queryString = new URLSearchParams(query as any).toString()

    // Remove the trailing slash if it exists
    const sanitizedUrl = url.replace(/\/$/, '')

    return queryString ? `${sanitizedUrl}?${queryString}` : sanitizedUrl
  }

  async get<T>(params?: any, uri?: string) {
    const endpoint = this.getURL(uri === null || uri === undefined ? this.resource : `${this.resource}/${uri}`)

    const response = await this.api.get<T>(endpoint, { params })

    return response.data
  }

  async post<T>(payload: any, uri?: string) {
    let endpoint: string

    if (typeof payload === 'string') {
      endpoint = `${this.resource}/${payload}`
      payload = undefined
    }
    else {
      endpoint = uri == null ? this.resource : `${this.resource}/${uri}`
    }

    const { data, headers } = this.formatPayload(payload)
    const response = await this.api.post<T>(endpoint, data, { headers })

    return response.data
  }

  async put<T>(payload: any, uri?: string) {
    let endpoint: string

    if (typeof payload === 'string') {
      endpoint = `${this.resource}/${payload}`
      payload = undefined
    }
    else {
      endpoint = uri == null ? this.resource : `${this.resource}/${uri}`
    }

    const { data, headers } = this.formatPayload(payload)

    if (data instanceof FormData) {
      data.append('_method', 'PUT')

      const response = await this.api.post<T>(endpoint, data, { headers })

      return response.data
    }

    const response = await this.api.put<T>(endpoint, data, { headers })

    return response.data
  }

  async delete<T>(id: number | string, uri?: string) {
    const endpoint = uri ? `${uri}/${id}` : `${this.resource}/${id}`
    const response = await this.api.delete<T>(endpoint)

    return response.data
  }
}
