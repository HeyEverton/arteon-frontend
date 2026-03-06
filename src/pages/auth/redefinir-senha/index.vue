<script setup lang="ts">
import ValidationDialog from '@codifytech/components/ValidationDialog.vue'
import logo from '@images/logo.svg?raw'
import authV1BottomShape from '@images/svg/auth-v1-bottom-shape.svg?raw'
import authV1TopShape from '@images/svg/auth-v1-top-shape.svg?raw'
import { VNodeRenderer } from '@layouts/components/VNodeRenderer'
import { useRedefinirSenhaStore } from '@/pages/auth/redefinir-senha/store/useRedefinirSenhaStore'
import { requiredValidator } from '@/validators/cdf-rules'

definePage({
  meta: {
    layout: 'blank',
    unauthenticatedOnly: true,
  },
})

const store = useRedefinirSenhaStore()
const route = useRoute()

const {
  form,
  email,
  token,
  newPassword,
  confirmPassword,
  loading,
  messages,
} = storeToRefs(store)

onBeforeMount(() => {
  email.value = route.query.email
  token.value = route.query.token
})

const {
  resetPassword,
} = store

const isPasswordVisible = ref(false)
const isConfirmPasswordVisible = ref(false)
</script>

<template>
  <ValidationDialog
    v-model:is-dialog-visible="messages.error.isError"
    v-model:error-status="messages.error.status"
    v-model:errors="messages.error.messages"
    @update:is-dialog-visible="messages.error.isError ?? !messages.error.isError"
  />

  <SuccessDialog
    v-model:is-dialog-visible="messages.success.isSuccess"
    :confirmation-msg="messages.success.message"
    title="Sucesso!"
    confirmation-button-text="ok"
  />

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

      <!-- 👉 Auth Card -->
      <VCard
        class="auth-card pa-4"
        max-width="448"
      >
        <VCardItem class="justify-center">
          <template #prepend>
            <div class="d-flex">
              <VNodeRenderer
                :nodes="h('div', { innerHTML: logo })"
                class="mb-2 logo d-flex justify-center"
              />
            </div>
          </template>
        </VCardItem>

        <VCardText class="pt-2">
          <h4 class="text-h4 mb-1">
            Esqueceu a senha? 🔒
          </h4>
        </VCardText>

        <VCardText>
          <VForm
            ref="form"
            @submit.prevent="() => resetPassword()"
          >
            <VRow>
              <!-- email -->
              <VCol cols="12">
                <AppTextField
                  label="E-mail"
                  placeholder="Digite seu endereço de e-mail"
                  disabled="disabled"
                  readonly="readonly"
                  :value="route.query.email"
                />
              </VCol>

              <!-- password -->
              <VCol cols="12">
                <AppTextField
                  v-model="newPassword"
                  autofocus
                  label="Senha"
                  placeholder="············"
                  :type="isPasswordVisible ? 'text' : 'password'"
                  :append-inner-icon="isPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'"
                  :rules="[requiredValidator]"
                  @click:append-inner="isPasswordVisible = !isPasswordVisible"
                />
              </VCol>

              <!-- Confirm Password -->
              <VCol cols="12">
                <AppTextField
                  v-model="confirmPassword"
                  label="Confirmar Senha"
                  placeholder="············"
                  :type="isConfirmPasswordVisible ? 'text' : 'password'"
                  :append-inner-icon="isConfirmPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'"
                  :rules="[requiredValidator]"
                  @click:append-inner="isConfirmPasswordVisible = !isConfirmPasswordVisible"
                />
              </VCol>

              <!-- reset password -->
              <VCol cols="12">
                <VBtn
                  :loading="loading"
                  block
                  type="submit"
                >
                  Definir nova senha
                </VBtn>
              </VCol>

              <!-- back to login -->
              <VCol cols="12">
                <RouterLink
                  class="d-flex align-center justify-center"
                  to="/auth/login"
                >
                  <VIcon
                    icon="tabler-chevron-left"
                    class="flip-in-rtl"
                  />
                  <span>Voltar ao login</span>
                </RouterLink>
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </div>
  </div>
</template>

<style lang="scss">
@use "@core/scss/template/pages/page-auth.scss";
</style>
