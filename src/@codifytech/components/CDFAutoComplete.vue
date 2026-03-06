<script setup lang="ts">
import { blurHandler } from '@/utils/generals'

const props = defineProps<{
  modelValue: any
  items: any[]
  label: string
  returnObject?: boolean
  loading?: boolean
  rules?: any[]
  itemValue?: string
  itemTitle?: string
  placeholder?: string
  clearable?: boolean
  fetchItems: (search?: string) => Promise<any>
}>()

defineEmits<{
  (e: 'update:modelValue', value: any): void
}>()

const modelValue = toRef(props, 'modelValue')
const isLoading = ref<boolean>(false)

const fetch = () => {
  if (!isLoading.value) {
    props.fetchItems()
      .finally(() => {
        isLoading.value = true
      })
  }
}
</script>

<template>
  <AppAutocomplete
    v-model="modelValue"
    v-debounce:900="fetchItems"
    :items="items"
    :label="label"
    :return-object="returnObject"
    :loading="loading"
    :rules="rules"
    :item-value="itemValue"
    :item-title="itemTitle"
    :placeholder="placeholder"
    @focusin="fetch"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <template
      v-if="clearable"
      #clear
    >
      <button
        @click="() => {
          fetchItems()
          blurHandler()
        }"
      >
        <VIcon
          size="20"
          icon="tabler-x"
        />
      </button>
    </template>
  </AppAutocomplete>
</template>
