<script setup lang="ts">
import logo from '@images/logo.svg?raw'
import authImage from '@images/pages/auth-v2-register-illustration-light.png'
import { VNodeRenderer } from '@layouts/components/VNodeRenderer'
import { useTheme } from 'vuetify'
import { VForm } from 'vuetify/components/VForm'
import { useAuthStore } from '@/pages/auth/login/store/useAuthStore'

definePage({
  meta: {
    layout: 'blank',
    unauthenticatedOnly: true,
  },
})

const authStore = useAuthStore()
const theme = useTheme()

const {
  credentials,
  login,
} = authStore

const {
  form,
  loading,
} = storeToRefs(authStore)

const isPasswordVisible = ref(false)
const name = import.meta.env.VITE_APP_NAME || 'App Name'
</script>

<template>
  <VRow
    no-gutters
    class="auth-wrapper"
  >
    <VCol
      md="8"
      class="d-none d-md-flex"
    >
      <div
        class="position-relative rounded-lg w-100 ma-14 me-0"
        :class="{
          'bg-background': theme.global.current.dark,
          'bg-surface': !theme.global.current.dark,
        }"
      >
        <div class="d-flex align-center justify-center w-100 h-100">
          <VImg
            max-width="505"
            :src="authImage"
            class="auth-illustration mt-16 mb-2"
          />
        </div>
      </div>
    </VCol>
    <VCol
      cols="12"
      md="4"
      class="auth-card-v2 d-flex align-center justify-center"
    >
      <VCard
        flat
        :max-width="500"
        class="mt-12 mt-sm-0 pa-4"
      >
        <VCardText>
          <VNodeRenderer
            :nodes="h('div', { innerHTML: logo })"
            class="mb-2 logo d-flex justify-center"
          />
          <h4 class="text-h4 text-center mb-1">
            Seja bem-vindo(a) ao {{ name }}
          </h4>
          <h4 class="text-body-1 text-center mb-1">
            Faça login em sua conta
          </h4>
        </VCardText>

        <VCardText>
          <VForm ref="form">
            <VRow>
              <VCol cols="12">
                <AppTextField
                  v-model="credentials.email"
                  autofocus
                  label="E-mail"
                  type="email"
                  placeholder="Insira seu E-mail"
                />
              </VCol>

              <VCol cols="12">
                <AppTextField
                  v-model="credentials.password"
                  label="Senha"
                  placeholder="············"
                  :type="isPasswordVisible ? 'text' : 'password'"
                  :append-inner-icon="isPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'"
                  @click:append-inner="isPasswordVisible = !isPasswordVisible"
                />

                <div class="d-flex align-center flex-wrap justify-space-between mt-2 mb-4">
                  <VCheckbox
                    v-model="credentials.remember"
                    label="Lembrar de mim"
                  />
                  <a
                    class="text-primary ms-2 mb-1"
                    href="/auth/esqueceu-senha"
                  >
                    Esqueceu a senha?
                  </a>
                </div>

                <VBtn
                  block
                  :loading="loading"
                  @click="login(credentials)"
                >
                  Entrar
                </VBtn>
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>

<style lang="scss">
@use "@core/scss/template/pages/page-auth";

.logo svg {
  block-size: 40px;
}
</style>
