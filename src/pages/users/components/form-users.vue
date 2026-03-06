<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useUsersStore } from '@/pages/users/store/useUsersStore'
import { confirmedValidator, emailValidator, lengthValidator, requiredValidator } from '@/validators/cdf-rules'
import { useAuth } from '../../../@codifytech/hooks/useAuth'

const props = withDefaults(defineProps<{
  isEditing?: boolean
  isHeader?: boolean
  isActions?: boolean
  isReadOnly?: boolean
  isProfile?: boolean
}>(), {
  isEditing: false,
  isHeader: true,
  isActions: true,
  isReadOnly: false,
  isProfile: false,
})

const store = useUsersStore()
const isPasswordVisible = ref(false)
const auth = useAuth()

const {
  form,
  formKey,
  data,
  roles,
  crudLoading,
  loadingRoles,
} = storeToRefs(store)

const {
  fetchCargos,
  create,
  update,
  reset,
} = store

onMounted(() => {
  fetchCargos()
})

onBeforeRouteLeave(() => {
  reset()
})
</script>

<template>
  <LayoutForms
    v-model:form="form"
    v-model:form-key="formKey"
    v-model:loading="crudLoading.save"
    :title="!isEditing ? 'Cadastrar Usuários' : 'Editar Usuários'"
    :is-editing="isEditing"
    :is-header="isHeader"
    :is-actions="isActions"
    :is-read-only="isReadOnly"
    :actions="{
      save: {
        method: () => create(),
      },
      update: {
        method: () => update().then((result) => {
          if (props.isProfile) {
            auth.setUser(result)
            data = result
          }
        }),
      },
      reset: {
        method: () => reset(),
      },
    }"
    back="/users"
  >
    <template #content>
      <VCol
        cols="12"
        class="d-flex justify-center"
      >
        <VSkeletonLoader
          :loading="crudLoading.item"
          type="avatar"
        >
          <EnviarImagem
            v-model="data.foto"
            :placeholder="data.name"
          />
        </VSkeletonLoader>
      </VCol>

      <VCol
        cols="12"
        md="6"
      >
        <CDFTextField
          v-model="data.name"
          label="Digite o nome"
          placeholder="Digite o nome"
          :rules="[requiredValidator]"
          :loading="crudLoading.item"
        />
      </VCol>

      <VCol
        cols="12"
        md="6"
      >
        <CDFSelect
          v-model="data.role"
          label="Cargo"
          placeholder="Selecione o cargo"
          :rules="[requiredValidator]"
          item-title="name"
          :items="roles"
          :loading="loadingRoles"
          return-object
        />
      </VCol>

      <VCol cols="12">
        <CDFTextField
          v-model="data.email"
          label="E-mail"
          placeholder="Digite o e-mail"
          :rules="[requiredValidator, emailValidator]"
          :loading="crudLoading.item"
        />
      </VCol>

      <VCol
        cols="12"
        md="6"
      >
        <CDFTextField
          v-model="data.password"
          label="Senha"
          placeholder="Digite a senha"
          :rules="isEditing ? [lengthValidator(data.password, 8)] : [requiredValidator, lengthValidator(data.password, 8)]"
          :loading="crudLoading.item"
          :type="isPasswordVisible ? 'text' : 'password'"
          :append-inner-icon="isPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'"
          @click:append-inner="isPasswordVisible = !isPasswordVisible"
        />
      </VCol>

      <VCol
        cols="12"
        md="6"
      >
        <CDFTextField
          v-model="data.password_confirmation"
          label="Confirmar Senha"
          placeholder="Digite a confirmação da senha"
          :rules="isEditing ? [confirmedValidator(data.password ?? '', data.password_confirmation ?? ''), lengthValidator(data.password, 8)] : [requiredValidator, confirmedValidator(data.password ?? '', data.password_confirmation ?? ''), lengthValidator(data.password, 8)]"
          :loading="crudLoading.item"
          :type="isPasswordVisible ? 'text' : 'password'"
          :append-inner-icon="isPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'"
          @click:append-inner="isPasswordVisible = !isPasswordVisible"
        />
      </VCol>
    </template>
  </LayoutForms>
</template>
