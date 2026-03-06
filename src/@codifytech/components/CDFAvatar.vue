<script setup lang="ts">
import Utils from '@codifytech/utils'
import { UseImage } from '@vueuse/components'

defineOptions({
  name: 'CDFAvatar',
  inheritAttrs: false,
})

const props = withDefaults(defineProps<{
  name?: string
  foto?: string | undefined
  size?: number | string
  fontSize?: number | string
  color?: string
  variant?: 'tonal' | 'flat' | 'text' | 'elevated' | 'outlined' | 'plain'
}>(), {
  size: 32,
  fontSize: 16,
  color: 'primary',
  variant: 'tonal',
})

const foto = toRef(props, 'foto')
</script>

<template>
  <UseImage
    v-bind="{
      ...$attrs,
      src: foto,
      height: size,
      width: size,
      class: 'rounded-circle',
    }"
  >
    <template #error>
      <VAvatar
        v-bind="{
          ...$attrs,
          color,
          variant,
          size,
        }"
      >
        <span :style="`font-size: ${fontSize}px`">
          {{ Utils.avatarTwoText(name ?? '') }}
        </span>
      </VAvatar>
    </template>
  </UseImage>
</template>
