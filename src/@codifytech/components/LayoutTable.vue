<script setup lang="ts">
import type { ISearch } from '@codifytech/types/globalTypes'
import type { ILayoutTable } from '@codifytech/types/layoutTable'
import type { StateHandler } from 'v3-infinite-loading/lib/types'
import CDFActionButton from '@codifytech/components/CDFActionButton.vue'
import CDFButton from '@codifytech/components/CDFButton.vue'
import SearchBar from '@codifytech/components/SearchBar.vue'
import { can } from '@layouts/plugins/casl'
import { toRef } from 'vue'

const props = withDefaults(defineProps<ILayoutTable>(), {
  itemsPerPage: 10,
  isHeader: true,
  isNewItem: true,
})

const emit = defineEmits<{
  (e: 'update:loading', value: boolean): void
  (e: 'update:search', value: ISearch): void
  (e: 'update:confirmDestroyItem', value: boolean): void
  (e: 'update:state-handler', value: StateHandler): void
}>()

const route = useRouter()

const items = toRef(props, 'items', [])

const search = ref()
const searchField = ref<string>('')
const searchTerm = ref<string>('')
const searchRelationship = ref<string>('')
const isSearching = toRef(props, 'isSearching')

const headers = toRef(props, 'headers', [])
const stateHandler = ref<StateHandler>()
const stateHandlerKey = toRef(props, 'stateHandlerKey')

const getHeaders = computed(() => {
  return headers.value.concat({
    title: 'Açoes',
    key: 'acoes',
    sortable: false,
    minWidth: 'max-content',
    align: 'center',
    cellProps() {
      return {
        class: 'd-flex align-center justify-center gap-2',
      }
    },
  })
})

const updateSearch = (e: ISearch) => {
  search.value = e
  emit('update:search', e)
}

const onSearch = () => {
  props.onReset(stateHandler.value)
  props?.setSearchParams({
    search: searchTerm.value,
    searchColumn: searchField.value,
    searchRelation: searchRelationship.value,
  })
  props?.loadMore(stateHandler.value)
}

const onInfinite = ($state: StateHandler) => {
  stateHandler.value = $state
  props?.loadMore($state)
}

const resetSearch = () => {
  props.onReset(stateHandler.value)
}

onMounted(() => {
  searchField.value = props.termsSearch?.[0]?.value ?? ''
})
</script>

<template>
  <!-- Header -->
  <VCard
    v-if="isHeader"
    class="mb-2"
  >
    <VCardItem class="pa-4 pa-sm-6">
      <VRow
        class="pa-4"
        align="center"
      >
        <VCardTitle style="flex: 1;">
          <template #default>
            <h2 class="header text-h6 text-lg-h4">
              {{ title }}
            </h2>
          </template>
        </VCardTitle>
        <VCardActions
          v-if="isNewItem"
          class="py-0"
        >
          <CDFButton
            :icon="newItemIcon ?? 'tabler-plus'"
            :color="newItemColor ?? 'primary'"
            variant="outlined"
            :is-text="$vuetify.display.smAndUp"
            :size="$vuetify.display.smAndUp ? 'default' : 'small'"
            @click="() => {
              typeof newItem === 'string' ? route.push(newItem) : newItem()
            }"
          >
            Cadastrar
          </CDFButton>
          <slot name="header-actions" />
        </VCardActions>
      </VRow>
    </VCardItem>
  </VCard>

  <slot name="content" />

  <!-- Content -->
  <VCard>
    <VCardItem class="pa-4 pa-sm-6">
      <VDataTableServer
        v-model:headers="getHeaders"
        hover
        :items="items"
        items-per-page-text="Registros por página"
        :items-per-page="itemsPerPage"
        :loading="loading"
        :item-value="groupKey"
        :items-length="itemsLength"
        @update:sort-by="(value) => onOrderBy?.(stateHandler, value)"
      >
        <template
          v-for="(_, slot) of $slots"
          #[slot]="scope"
        >
          <slot
            :name="slot"
            v-bind="scope"
          />
        </template>
        <template #top>
          <VRow
            justify="start"
            class="mb-2"
          >
            <VCol
              cols="12"
              md="8"
            >
              <SearchBar
                v-model:search="searchTerm"
                v-model:field="searchField"
                v-model:relationship="searchRelationship"
                v-model:is-searching="isSearching"
                :terms="termsSearch ?? []"
                :on-search="() => onSearch()"
                :on-search-again="() => onSearch()"
                :on-reset="() => resetSearch()"
                @update:searching="updateSearch"
              />
            </VCol>
          </VRow>
        </template>
        <template #item.acoes="{ item }">
          <slot
            name="actions"
            :item="item"
          />
          <template v-for="(action, indexAction) in actions">
            <CDFActionButton
              v-if="action?.can ? can(action?.can.action, action?.can.subject) : true"
              :key="indexAction"
              :icon="action.icon"
              :color="action.color"
              :to="action.to ? action?.to(item) : action.to ?? null"
              @click="() => action?.onClick ? action?.onClick(item) : null"
            />
          </template>
        </template>
        <template #no-data />
        <template #loading>
          <VSkeletonLoader type="table-row@5" />
        </template>
        <template #bottom>
          <div class="d-flex justify-center ma-auto my-5">
            <InfiniteLoading
              v-if="loadMore"
              :key="stateHandlerKey"
              @infinite="onInfinite"
            >
              <template #complete>
                <span />
              </template>
              <template #error>
                <span>Ocorreu um erro ao carregar</span>
              </template>
            </InfiniteLoading>
          </div>
        </template>
      </VDataTableServer>
    </VCardItem>
  </VCard>
</template>

<style scoped lang="scss">
.header {
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style>
