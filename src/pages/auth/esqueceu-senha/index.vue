<script setup lang="ts">
import ValidationDialog from '@codifytech/components/ValidationDialog.vue'
import logo from '@images/logo.svg?raw'
import authV1BottomShape from '@images/svg/auth-v1-bottom-shape.svg?raw'
import authV1TopShape from '@images/svg/auth-v1-top-shape.svg?raw'
import { VNodeRenderer } from '@layouts/components/VNodeRenderer'
import { useEsqueceuSenhaStore } from '@/pages/auth/esqueceu-senha/store/useEsqueceuSenhaStore'
import { requiredValidator } from '@/validators/cdf-rules'

definePage({
  meta: {
    layout: 'blank',
    unauthenticatedOnly: true,
  },
})

const store = useEsqueceuSenhaStore()

const {
  email,
  loading,
  messages,
} = storeToRefs(store)

const {
  forgotPassword,
} = store
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
            @submit.prevent="() => forgotPassword()"
          >
            <VRow>
              <!-- password -->
              <VCol cols="12">
                <AppTextField
                  v-model="email"
                  autofocus
                  label="E-mail"
                  placeholder="Digite seu endereço de e-mail"
                  :rules="[requiredValidator]"
                />
              </VCol>

              <!-- reset password -->
              <VCol cols="12">
                <VBtn
                  block
                  type="submit"
                  :loading="loading"
                >
                  Solicitar Redefinição
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
.logo svg{
  height: 40px;
}
</style>
