<script setup lang="ts">
import type { ColorButton } from '@codifytech/components/CDFButton.vue'
import CDFButton from '@codifytech/components/CDFButton.vue'

defineProps<{
  icon?: string
  to?: string
  color?: ColorButton
}>()
</script>

<template>
  <CDFButton
    is-icon
    rounded="xl"
    density="compact"
    :icon="icon"
    variant="outlined"
    :to="to"
    :color="color"
  />
</template>
