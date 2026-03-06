<script setup lang="ts">
import { avatarText } from '@core/utils/formatters'

import { storeToRefs } from 'pinia'

import { ref } from 'vue'
import { usePerfilStore } from '@/pages/acesso/perfis/store/usePerfilStore'

// Importe a função de debounce do lodash

const perfilStore = usePerfilStore()

const {
  listarUsuarios,
  filterUsuarios,
  clearFilterUsuarios,
} = perfilStore

const {
  users,
  usersSearch,
  usersPerPage,
  usersOrderBy,
  usersIsSearch,
} = storeToRefs(perfilStore)

const router = useRouter()

const headers = [
  { title: 'Usuário', key: 'name' },
  { title: 'Cargo', key: 'role', sortable: false },
  { title: 'Status', key: 'ativo' },
  { title: 'Ações', key: 'actions', sortable: false },
]

const resolveUserStatusVariant = (stat: boolean) => {
  if (stat)
    return { name: 'Ativo', color: 'success' }
  else
    return { name: 'Inativo', color: 'error' }
}

const isAddNewUserDrawerVisible = ref(false)
</script>

<template>
  <section>
    <VCard>
      <VCardText class="d-flex flex-wrap gap-4">
        <VSpacer />
        <div class="d-flex align-center flex-wrap gap-4">
          <!-- 👉 Search  -->
          <AppTextField
            v-model="usersSearch"
            placeholder="Pesquisar Usuários"
            density="compact"
            style="inline-size: 12.5rem;"
            :append-inner-icon="usersIsSearch ? 'tabler-x' : 'tabler-search'"
            @click:append-inner="usersIsSearch ? clearFilterUsuarios() : filterUsuarios()"
          />
        </div>
      </VCardText>

      <VDivider />

      <VDataTable
        v-model:items-per-page="usersPerPage"
        show-select
        :headers="headers"
        :items="users"
        class="text-no-wrap"
        no-data-text="Nenhum registro encontrado"
        @update:sort-by="(e) => {
          if (e.length > 0) {
            usersOrderBy.key = e[0].key
            usersOrderBy.order = e[0].order
          }
          else {
            usersOrderBy.key = ''
            usersOrderBy.order = ''
          }

          filterUsuarios()
        }"
      >
        <template #item.name="{ item }">
          <div class="d-flex align-center">
            <VAvatar
              :size="32"
              color="primary"
              class="mr-2"
            >
              <VImg
                v-if="item.foto"
                :src="item.foto"
              />
              <span
                v-else
                class="text-xs"
              >{{ avatarText(item.name) }}</span>
            </VAvatar>
            <div class="d-flex flex-column">
              <h6 class="text-body-1 font-weight-medium">
                <RouterLink
                  to="/"
                  class="user-list-name"
                >
                  {{ item.name }}
                </RouterLink>
              </h6>
              <span class="text-sm text-disabled">{{ item.email }}</span>
            </div>
          </div>
        </template>
        <template #item.role="{ item, index }">
          <VChip
            :key="index"
            density="comfortable"
            size="small"
          >
            {{ item.role.title }}
          </VChip>
        </template>
        <template #item.ativo="{ item }">
          <VChip
            :color="resolveUserStatusVariant(item.ativo).color"
            class="text-capitalize"
          >
            {{ resolveUserStatusVariant(item.ativo).name }}
          </VChip>
        </template>
        <template #item.actions="{ item }">
          <IconBtn @click="() => router.replace({ name: 'users-editar-id', params: { id: item.id } })">
            <VIcon icon="tabler-eye" />
          </IconBtn>
        </template>

        <!-- pagination -->
        <template #bottom>
          <div class="d-flex justify-center">
            <InfiniteLoading @infinite="listarUsuarios">
              <template #complete>
                <span />
              </template>
              <template #error>
                <span>Ops, algo deu errado!</span>
              </template>
            </InfiniteLoading>
          </div>
        </template>
      </VDataTable>
    </VCard>
  </section>
</template>

<style lang="scss">
.text-capitalize {
  text-transform: capitalize;
}

.user-list-name:not(:hover) {
  color: rgba(var(--v-theme-on-background), var(--v-medium-emphasis-opacity));
}

.result {
  display: flex;
  flex-direction: column;
  padding: 10px;
  border-radius: 10px;
  background: #8f8989;
  font-weight: 300;
  gap: 5px;
  inline-size: 400px;
  margin-block: 0 auto 10px auto;
  text-align: center;
}
</style>
