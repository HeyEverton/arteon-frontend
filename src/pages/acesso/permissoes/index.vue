<script setup lang="ts">
import type { IHeader, ITableAction } from '@codifytech/types/layoutTable'
import type { ComputedRef } from 'vue'
import type { ITerm } from '@/@codifytech/types/globalTypes'
import type { IPermission } from '@/pages/acesso/types'
import { storeToRefs } from 'pinia'
import { capitalize } from 'vue'
import { usePermissoesStore } from '@/pages/acesso/permissoes/store/usePermissoesStore'
import AddEditPermissionDialog from './components/AddEditPermissionDialog.vue'

const store = usePermissoesStore()

const {
  items,
  isSearching,
  perPage,
  currentPage,
  total,
  crudLoading,
  stateHandler,
  stateHandlerKey,
  isEditing,
  isPermissionDialogVisible,
} = storeToRefs(store)

const {
  loadMore,
  setSearchParams,
  reset,
  destroy,
  onOrderBy,
  getPermission,
  deletarAllPermission,
} = store

const headers: ComputedRef<IHeader[]> = computed(() => {
  return [
    { title: 'Nome', key: 'name' },
    { title: 'Permissões', key: 'actions', sortable: false },
  ]
})

const terms: ComputedRef<ITerm[]> = computed(() => {
  return [
    {
      title: 'Nome',
      value: 'name',
    },
  ]
})

const actions: ITableAction[] = [
  {
    icon: 'tabler-edit',
    color: 'primary',
    can: {
      action: 'edit',
      subject: 'user',
    },
    onClick: (item: IPermission) => editPermission(item),
  },
  {
    icon: 'tabler-trash',
    color: 'error',
    can: {
      action: 'delete',
      subject: 'user',
    },
    onClick: (item: IPermission) => deletarAllPermission(item),
  },
]

const addPermission = () => {
  isPermissionDialogVisible.value = true
  isEditing.value = false
}

const editPermission = (permission: IPermission) => {
  isPermissionDialogVisible.value = true
  isEditing.value = true
  getPermission(permission)
}
</script>

<template>
  <LayoutTable
    v-model:loading="crudLoading.items"
    v-model:loading-destroy="crudLoading.delete"
    v-model:is-searching="isSearching"
    v-model:state-handler="stateHandler"
    v-model:state-handler-key="stateHandlerKey"
    :items="items || []"
    :is-header="isHeader"
    :destroy="destroy"
    title="Lista Permissões"
    :new-item="() => addPermission()"
    new-item-text="Adicionar Permissão"
    :headers="headers"
    :actions="actions"
    :items-per-page="perPage"
    :page="currentPage"
    :items-length="total || 0"
    :load-more="loadMore"
    :terms-search="terms"
    :set-search-params="setSearchParams"
    :on-reset="reset"
    :on-order-by="onOrderBy"
    @update:searching="setSearchParams"
  >
    <template #item.actions="{ item }">
      <div class="d-flex gap-2">
        <VChip
          v-for="(text, index) in item.actions"
          :key="index"
          label
          class="font-weight-medium"
        >
          {{ capitalize(text?.toString()?.split(' ')[1]) }}
        </VChip>
      </div>
    </template>
  </LayoutTable>

  <AddEditPermissionDialog
    v-model:is-dialog-visible="isPermissionDialogVisible"
    v-model:is-editing="isEditing"
  />
</template>
