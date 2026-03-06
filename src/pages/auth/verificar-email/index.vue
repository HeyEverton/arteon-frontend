<script setup lang="ts">
import type { IUser } from '@/pages/users/types'
import authV1BottomShape from '@images/svg/auth-v1-bottom-shape.svg?raw'
import authV1TopShape from '@images/svg/auth-v1-top-shape.svg?raw'
import { VNodeRenderer } from '@layouts/components/VNodeRenderer'
import { themeConfig } from '@themeConfig'
import { useAuthStore } from '@/pages/auth/login/store/useAuthStore'

const store = useAuthStore()
const auth = useCookie<IUser>('userData')
const route = useRoute()

definePage({
  meta: {
    layout: 'blank',
    action: 'read',
    subject: 'auth',
  },
})

const {
  reenviarEmailVerificacao,
  verificarEmail,
} = store

const {
  reenviarEmailVerificacaoLoading,
} = storeToRefs(store)

onMounted(() => {
  const email = route.query.email

  if (email)
    verificarEmail(email)
})
</script>

<template>
  <div class="auth-wrapper d-flex align-center justify-center pa-4">
    <div class="position-relative my-sm-16">
      <!-- 👉 Top shape -->
      <VNodeRenderer
        :nodes="h('div', { innerHTML: authV1TopShape })"
        class="text-primary auth-v1-top-shape d-none d-sm-block"
      />

      <!-- 👉 Bottom shape -->
      <VNodeRenderer
        :nodes="h('div', { innerHTML: authV1BottomShape })"
        class="text-primary auth-v1-bottom-shape d-none d-sm-block"
      />

      <!-- 👉 Auth card -->
      <VCard
        class="auth-card"
        max-width="460"
        :class="$vuetify.display.smAndUp ? 'pa-6' : 'pa-2'"
      >
        <VCardItem class="justify-center">
          <VCardTitle>
            <div class="app-logo">
              <VNodeRenderer :nodes="themeConfig.app.logo" />
            </div>
          </VCardTitle>
        </VCardItem>

        <VCardText>
          <h4 class="text-h4 mb-1">
            Verifique seu e-mail ✉️
          </h4>
          <p class="text-body-1 mb-0">
            Link de ativação de conta enviado para seu endereço de e-mail: <span class="font-weight-medium text-high-emphasis">{{ auth.email }}</span> Por favor, siga o link dentro para continuar.
          </p>
          <div class="d-flex flex-column align-center justify-center mt-5">
            <span class="me-1">Não recebeu o e-mail? </span>
            <VBtn
              class="mt-5"
              :loading="reenviarEmailVerificacaoLoading"
              @click="reenviarEmailVerificacao"
            >
              Reenviar
            </VBtn>
          </div>
        </VCardText>
      </VCard>
    </div>
  </div>
</template>

<style lang="scss">
@use "@core/scss/template/pages/page-auth.scss";
</style>
