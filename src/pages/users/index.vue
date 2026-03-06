<script setup lang="ts">
import type { ITerm } from '@codifytech/types/globalTypes'
import type { IHeader, ITableAction } from '@codifytech/types/layoutTable'
import type { ComputedRef } from 'vue'
import type { IUser } from '@/pages/users/types'
import CDFAvatar from '@codifytech/components/CDFAvatar.vue'
import LayoutTable from '@codifytech/components/LayoutTable.vue'
import { storeToRefs } from 'pinia'
import { useUsersStore } from '@/pages/users/store/useUsersStore'

withDefaults(defineProps<{
  isHeader: boolean
}>(), {
  isHeader: true,
})

definePage({
  meta: {
    action: 'list',
    subject: 'users',
  },
})

const store = useUsersStore()

const {
  items,
  isSearching,
  perPage,
  currentPage,
  total,
  crudLoading,
  stateHandler,
  stateHandlerKey,
} = storeToRefs(store)

const {
  loadMore,
  setSearchParams,
  reset,
  destroy,
  onOrderBy,
} = store

const headers: ComputedRef<IHeader[]> = computed(() => {
  return [
    {
      title: 'Nome',
      key: 'name',
    },
    {
      title: 'E-mail',
      key: 'email',
    },
    {
      title: 'Cargo',
      key: 'roles.name',
    },
  ]
})

const terms: ComputedRef<ITerm[]> = computed(() => {
  return [
    {
      title: 'Nome',
      value: 'name',
    },
    {
      title: 'E-mail',
      value: 'email',
    },
  ] as ITerm[]
})

const actions: ITableAction[] = [
  {
    icon: 'tabler-edit',
    color: 'primary',
    can: {
      action: 'edit',
      subject: 'users',
    },
    to: (item: IUser) => `/users/editar/${item.id}`,
  },
  {
    icon: 'tabler-trash',
    color: 'error',
    can: {
      action: 'delete',
      subject: 'users',
    },
    onClick: (item: IUser) => destroy(item.id),
  },
]

onBeforeRouteLeave(() => {
  store.$reset()
})
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
    title="Usuários"
    new-item="/users/cadastrar"
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
    <template #item.name="{ item }">
      <div class="d-flex align-center gap-x-2">
        <CDFAvatar
          size="32"
          color="primary"
          :foto="item.foto"
          :name="item.name"
        />
        {{ item.name }}
      </div>
    </template>
    <template #item.roles.name="{ item, index }">
      <VChip
        :key="index"
        density="comfortable"
        size="small"
      >
        {{ item.role?.name }}
      </VChip>
    </template>
  </LayoutTable>
</template>
