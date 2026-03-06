import type { VForm } from 'vuetify/components/VForm'
import type { LoginResponse, PayloadLogin } from '@/pages/auth/login/types'
import { useAuth } from '@codifytech/hooks/useAuth'
import { useSuccessDialogStore } from '@codifytech/stores/useSuccessDialogStore'
import { defineStore } from 'pinia'
import AuthService from '@/pages/auth/services/AuthService'

const defaultCredentials = {
  email: '',
  password: '',
  remember: false,
}

const successDialog = useSuccessDialogStore()

export const useAuthStore = defineStore('AuthStore', {
  state: () => ({
    form: {} as VForm,
    loading: false,
    credentials: { ...defaultCredentials },
    is_verified: false,
    messages: {
      error: {
        isError: false,
        status: '',
        messages: [] as any[] | string,
      },
    },
    router: useRouter(),
    ability: useAbility(),
    verificarEmailLoading: false,
    reenviarEmailVerificacaoLoading: false,
  }),
  actions: {
    async login(payload: PayloadLogin) {
      this.loading = true

      await this.form?.validate()
        .then(async ({ valid: isValid }) => {
          if (isValid) {
            await AuthService.login<LoginResponse>(payload)
              .then(data => {
                useAuth().setUser(data.user)
                useAuth().setAccessToken(data.authorization.token)
                useAuth().setAbilitiesRules(data.authorization)

                this.ability.update(data.authorization.permissions || [])

                this.router.replace('/')
              })
              .finally(() => {
                this.loading = false
                this.credentials = { ...defaultCredentials }
              })
          }
        })
    },
    async verificarEmail(email: string) {
      this.verificarEmailLoading = true

      return AuthService.get({}, `email/verify-email/${email}`)
        .then(() => {
          useAuth().emailVerification()

          successDialog.showSuccessDialog({
            title: 'E-mail verificado',
            message: 'Seu e-mail foi verificado com sucesso.',
            confirmText: 'Ok',
          })

          this.router.replace('/')
        })
        .finally(() => {
          this.verificarEmailLoading = false
        })
    },
    async reenviarEmailVerificacao() {
      this.reenviarEmailVerificacaoLoading = true

      return AuthService.post({}, 'email/verification-notification')
        .then(() => {
          successDialog.showSuccessDialog({
            title: 'E-mail enviado',
            message: 'Um novo e-mail de verificação foi enviado.',
            confirmText: 'Ok',
          })
        })
        .finally(() => {
          this.reenviarEmailVerificacaoLoading = false
        })
    },
    async logout() {
      await AuthService.logout().then(() => {
        useAuth().logout()
        document.location.href = '/auth/login'
      })
    },
  },
})
