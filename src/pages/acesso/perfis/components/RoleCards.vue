<script setup lang="ts">
import type { IRole } from '@/pages/acesso/types'
import girlUsingMobile from '@images/pages/girl-using-mobile.png'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import { usePerfilStore } from '@/pages/acesso/perfis/store/usePerfilStore'
import AddEditRoleDialog from './AddEditRoleDialog.vue'

const perfilStore = usePerfilStore()
const { roles, isEditing } = storeToRefs(perfilStore)
const { deletarPerfil, obterPerfil } = perfilStore

const isRoleDialogVisible = ref(false)
const isDialogDestroyPermission = ref(false)
const isDialogConfirmDestroyPermission = ref(false)

const roleId = ref('')
const roleDestroy = ref<IRole>()
const copiadoComSucesso = ref(false)

const isAddRoleDialogVisible = ref(false)

const editRole = (id: string) => {
  isRoleDialogVisible.value = true
  roleId.value = id
  isEditing.value = true
  obterPerfil(id)
}

const destroyRole = (item: IRole) => {
  isDialogDestroyPermission.value = true
  roleDestroy.value = item
  roleId.value = item.id
}

const destroyConfirmPermission = () => {
  isDialogConfirmDestroyPermission.value = true
}

const copyName = (text: string) => {
  copyToClipboard(text)
  copiadoComSucesso.value = true
}
</script>

<template>
  <VRow>
    <VSnackbar
      v-model="copiadoComSucesso"
      location="top end"
    >
      Copiado para área de transferência com sucesso!
      <template #actions>
        <VBtn
          color="error"
          @click="copiadoComSucesso = !copiadoComSucesso"
        >
          Fechar
        </VBtn>
      </template>
    </VSnackbar>

    <VCol
      v-for="item in roles"
      :key="item.id"
      cols="12"
      sm="6"
      lg="4"
    >
      <VCard>
        <VCardText class="pb-5">
          <h4 class="text-h4">
            {{ item.name }}
          </h4>
          <div class="d-flex align-center gap-4">
            <a
              class="cursor-pointer"
              @click="() => editRole(item.id ?? '')"
            >
              Editar Perfil
            </a>
            <a
              class="cursor-pointer"
              @click="() => destroyRole(item)"
            >
              Excluír Perfil
            </a>
            <VSpacer />
            <VBtn
              icon
              color="disabled"
              variant="text"
              size="x-small"
            >
              <VIcon
                size="24"
                icon="tabler-copy"
                @click="copyName(item.name)"
              />
            </VBtn>
          </div>
        </VCardText>
      </VCard>
    </VCol>

    <VCol
      cols="12"
      sm="6"
      lg="4"
    >
      <VCard
        class="h-100"
        :ripple="false"
      >
        <VRow
          no-gutters
          class="h-100"
        >
          <VCol
            cols="5"
            class="d-flex flex-column justify-end align-center mt-5"
          >
            <img
              alt="Girl Using a Mobile phone"
              width="85"
              :src="girlUsingMobile"
            >
          </VCol>

          <VCol cols="7">
            <VCardText class="d-flex flex-column align-end justify-end gap-2 h-100">
              <VBtn @click="isAddRoleDialogVisible = true">
                Criar Perfil
              </VBtn>
              <span class="text-end">Crie um perfil, se não existir.</span>
            </VCardText>
          </VCol>
        </VRow>
      </VCard>
      <AddEditRoleDialog v-model:is-dialog-visible="isAddRoleDialogVisible" />
    </VCol>
  </VRow>

  <ConfirmDialog
    v-model:is-dialog-visible="isDialogDestroyPermission"
    confirm-button-text="Sim"
    cancel-button-text="Não"
    confirmation-msg="Você deseja excluír este cargo?"
    @confirm="destroyConfirmPermission"
    @cancel="isDialogDestroyPermission = !isDialogDestroyPermission"
  />

  <CodifyTechConfirmInputDialog
    v-model:is-dialog-visible="isDialogConfirmDestroyPermission"
    v-model:item="roleDestroy"
    key-destroy="name"
    confirm-button-text="Confirmar"
    cancel-button-text="Cancelar"
    @confirm="deletarPerfil(roleId)"
    @cancel="isDialogDestroyPermission = !isDialogDestroyPermission"
  />

  <AddEditRoleDialog
    v-model:is-dialog-visible="isRoleDialogVisible"
    v-model:role-id="roleId"
  />
</template>
