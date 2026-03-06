<script setup lang="ts">
import type { ThemeSwitcherTheme } from '@layouts/types'
import { useConfigStore } from '@core/stores/config'

const props = defineProps<{
  themes: ThemeSwitcherTheme[]
}>()

const configStore = useConfigStore()

const selectedItem = ref([configStore.theme])

// Update icon if theme is changed from other sources
watch(
  () => configStore.theme,
  () => {
    selectedItem.value = [configStore.theme]
  },
  { deep: true },
)

const setTheme = () => {
  configStore.theme = configStore.theme === 'dark' ? 'light' : 'dark'
  document.location.reload()
}
</script>

<template>
  <IconBtn color="rgba(var(--v-theme-on-surface), var(--v-high-emphasis-opacity))">
    <VIcon
      :icon="props.themes.find(t => t.name === configStore.theme)?.icon"
      size="24"
      @click="setTheme"
    />

    <VTooltip
      activator="parent"
      open-delay="1000"
      scroll-strategy="close"
    >
      <span class="text-capitalize">{{ configStore.theme }}</span>
    </VTooltip>
  </IconBtn>
</template>
