<script setup lang="ts">
import type { ISearch, ITerm } from '@codifytech/types/globalTypes'
import CDFButton from '@codifytech/components/CDFButton.vue'
import { Mask } from 'maska'
import { toRef } from 'vue'

const props = defineProps<{
  terms: ITerm[]
  field: string
  relationship: string
  search: string
  isSearching: boolean
  onSearch: () => void
  onSearchAgain: () => void
  onReset: () => void
}>()

const emit = defineEmits<{
  (e: 'update:field', value: string): void
  (e: 'update:search', value: string): void
  (e: 'update:relationship', value: string): void
  (e: 'update:searching', value: ISearch): void
  (e: 'update:isSearching', value: boolean): void
}>()

const field = toRef(props, 'field')
const search = ref<any | null>(props.search)
const terms = toRef(props, 'terms')
const isSearching = toRef(props, 'isSearching')

const selectedEl = ref<HTMLSelectElement | null>(null)
const inputEl = ref<HTMLInputElement | null>(null)
const mask = ref<Mask | null>(null)
const inputType = ref<string>('TEXT')
const inputOptions = ref<[]>([])

const updateField = (value: string) => {
  mask.value = terms.value.find(t => t.value === value)?.mask
    ? new Mask({ mask: terms.value.find(t => t.value === value)?.mask })
    : null

  if (inputType.value === 'ENUM')
    search.value = null

  inputType.value = terms.value.find(t => t.value === value)?.type ?? 'TEXT'
  inputOptions.value = terms.value.find(t => t.value === value)?.options ?? []

  if (inputType.value === 'TEXT')
    inputEl?.value?.focus()

  emit('update:field', value)
  emit('update:relationship', terms.value.find(term => term.value === value)?.relationship || '')
  emit('update:searching', {
    field: value,
    search: search.value,
    relationship: terms.value.find(term => term.value === value)?.relationship || '',
  })
}

const updateSearch = (value: string) => {
  emit('update:search', value)
  emit('update:searching', {
    field: field.value,
    search: value,
    relationship: terms.value.find(term => term.value === field.value)?.relationship || '',
  })
}

const onSearch = () => {
  if (isSearching.value)
    props.onSearchAgain()
  else
    props.onSearch()

  emit('update:searching', {
    field: field.value,
    search: search.value,
    relationship: terms.value.find(term => term.value === field.value)?.relationship || '',
  })
}

const reset = () => {
  props.onReset()

  selectedEl.value?.reset()
  field.value = terms.value[0].value ?? ''
  search.value = ''
  isSearching.value = false

  emit('update:field', terms.value[0].value ?? '')
  emit('update:search', '')
  emit('update:searching', {
    field: terms.value[0].value ?? '',
    search: '',
    relationship: '',
  })
  emit('update:isSearching', false)
}

const getItems = computed(() => {
  return [
    ...terms.value,
    {
      title: 'Todos Items',
      value: 'all',
    },
  ]
})
</script>

<template>
  <VCard
    class="cdf-search"
    flat
  >
    <template #prepend>
      <VSelect
        ref="selectedEl"
        v-model="field"
        class="cdf-select"
        :items="getItems"
        variant="outlined"
        single-line
        item-value="value"
        item-title="title"
        @update:model-value="updateField"
      >
        <template #chip="{ item, index }">
          <div :key="index">
            <VIcon icon="tabler-filter" />
            <span v-if="$vuetify.display.smAndUp">
              Procurar {{ item.title ? item.title : 'Por' }}:
            </span>
          </div>
        </template>
        <template #selection="{ item, index }">
          <div :key="index">
            <VIcon icon="tabler-filter" />
            <span v-if="$vuetify.display.smAndUp">
              Procurar ({{ item.title }}):
            </span>
          </div>
        </template>
        <template #item="{ props, item }">
          <VListItem
            v-if="item.value !== 'all'"
            v-bind="props"
            :title="item.title"
          />
          <VListItem
            v-else
            v-bind="props"
            :title="item.title"
            prepend-icon="tabler-list"
            @click="() => reset()"
          />
        </template>
      </VSelect>
    </template>
    <template #item>
      <VTextField
        v-if="inputType === 'TEXT'"
        ref="inputEl"
        v-model="search"
        class="cdf-search"
        :model-value="mask ? mask.masked(search) : search"
        placeholder="Pesquisar..."
        @update:model-value="updateSearch"
      />
      <VSelect
        v-if="inputType === 'ENUM'"
        ref="inputEl"
        v-model="search"
        class="cdf-search"
        placeholder="Pesquisar..."
        :items="inputOptions"
        @update:model-value="updateSearch"
      >
        <template #selection="{ item }">
          <VLabel v-if="String(search).length === 0">
            Selecione uma opção...
          </VLabel>
          <VLabel
            v-else
            :style="{
              color: 'rgba(var(--v-theme-on-surface), var(--v-high-emphasis-opacity))',
            }"
          >
            {{ item.title }}
          </VLabel>
        </template>
      </VSelect>
    </template>
    <template #append>
      <CDFButton
        v-if="isSearching"
        class="cdf-search-btn-x"
        icon="tabler-x"
        variant="text"
        is-icon
        @click="() => reset()"
      />
      <CDFButton
        :disabled="!(field.length > 0 && String(search).length > 0)"
        class="cdf-search-btn"
        icon="tabler-search"
        variant="outlined"
        is-icon
        @click="() => onSearch()"
      />
    </template>
  </VCard>
</template>

<style lang="scss">
.cdf-search {
  .v-card-item {
    padding: 0 !important;
  }

  .v-card-item__prepend,
  .v-card-item__append {
    padding-inline: 0 !important;
  }

  .v-field {
    border-radius: 0;
    padding-inline-end: 10px;
  }

  .v-field__input {
    padding-inline-start: 10px;
  }

  .cdf-select {
    .v-field {
      border-radius: 5px 0 0 5px;
    }
  }

  .cdf-search-btn-x {
    border: thin rgba(var(--v-border-color), var(--v-border-opacity)) solid;
    border-radius: 0 !important;
    border-inline-start: 0;

    &:hover {
      border: thin solid currentcolor;
    }
  }

  .cdf-search-btn {
    border: thin rgba(var(--v-border-color), var(--v-border-opacity)) solid;
    border-end-start-radius: 0 !important;
    border-inline-start: 0;
    border-start-start-radius: 0 !important;

    &:hover {
      border: thin solid currentcolor;
    }
  }
}
</style>
