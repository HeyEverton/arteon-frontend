import type { VForm } from 'vuetify/components/VForm'
import { handleError } from '@codifytech/services/error-handling'
import { defineStore } from 'pinia'
import AuthService from '@/pages/auth/services/AuthService'

export const useEsqueceuSenhaStore = defineStore('auht/esqueceu-senha', {
  state: () => ({
    form: {} as VForm,
    email: '',
    messages: {
      success: {
        isSuccess: false,
        message: '',
      },
      error: {
        isError: false,
        status: '',
        messages: [] as any[] | string,
      },
    },
    loading: false,
  }),
  actions: {
    async forgotPassword() {
      this.loading = true
      AuthService.forgotPassword(this.email).then(() => {
        this.messages.success.isSuccess = true
        this.messages.success.message = 'Um e-mail foi enviado para você com as instruções para redefinir sua senha.'
      }).catch(reason => {
        const handling = handleError(reason.response)

        this.messages.error.isError = true
        this.messages.error.status = handling?.erroStatus
        this.messages.error.messages = handling?.errors
      }).finally(() => {
        this.loading = false
      })
    },
  },
})
