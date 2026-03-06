import { config } from '@codifytech/config/app'
import { useAuth } from '@codifytech/hooks/useAuth'

// src/composables/useApi.ts
import axios from 'axios'

export const useApi = () => {
  const instance = axios.create({
    baseURL: `${config.apiBaseUrl}/api`,
    timeout: 10000,
    headers: {
      Accept: 'application/json',
    },
  })

  // Intercepta requisições
  instance.interceptors.request.use(conf => {
    // Ex: incluir token JWT, se necessário
    const token = useCookie(config.cookies.accessToken).value
    if (token)
      conf.headers.Authorization = `Bearer ${token}`

    return conf
  })

  // Intercepta respostas
  instance.interceptors.response.use(
    response => response,
    error => {
      const { response } = error

      if (!response)
        return Promise.reject({ message: 'Erro de rede ou servidor inativo' })

      if (response.status === 422) {
        // eslint-disable-next-line prefer-promise-reject-errors
        return Promise.reject({
          message: 'Erro de validação',
          errors: response.data.errors || {},
          status: 422,
        })
      }

      if (response.status === 401) {
        useAuth().logout() // Chama a função de logout do plugin de autenticação
        // Redireciona para a página de login ou exibe mensagem
        document.location.href = '/auth/login'

        // eslint-disable-next-line prefer-promise-reject-errors
        return Promise.reject({
          message: 'Não autorizado',
          status: 401,
        })
      }

      if (response.status === 405) {
        // eslint-disable-next-line prefer-promise-reject-errors
        return Promise.reject({
          message: 'A operação solicitada não é permitida para este recurso.',
          status: 405,
        })
      }

      if (response.status === 500) {
        // eslint-disable-next-line prefer-promise-reject-errors
        return Promise.reject({
          message: 'Erro interno do servidor',
          status: 500,
        })
      }

      // eslint-disable-next-line prefer-promise-reject-errors
      return Promise.reject({
        message: response.data.message || 'Erro desconhecido',
        status: response.status,
      })
    },
  )

  return instance
}
