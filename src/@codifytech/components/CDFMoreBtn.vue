<script lang="ts" setup>
import { Icon } from '@iconify/vue'
import { can } from '@layouts/plugins/casl'

interface MenuList {
  title?: string
  click?: (e: MouseEvent | KeyboardEvent) => void | Promise<void>
  class?: string
  type?: string
  icon?: string
  iconColor?: string
  can?: {
    action: string
    subject: string
  }
}

interface Props {
  menuList?: MenuList[]
  itemProps?: boolean
}

const props = defineProps<Props>()
</script>

<template>
  <VMenu>
    <template #activator="{ props }">
      <IconBtn
        density="compact"
        color="disabled"
        v-bind="props"
      >
        <VIcon icon="tabler-dots-vertical" />
      </IconBtn>
    </template>
    <VList :item-props="props.itemProps">
      <template
        v-for="(item, i) in props.menuList"
        :key="i"
      >
        <VListItem
          v-if="!item?.can || can(item.can.subject, item.can.action)"
          v-bind="item"
          :style="item.type === 'divider' ? 'min-height: 0px !important' : null"
          @click="item.click"
        >
          <template
            v-if="item.icon"
            #prepend
          >
            <Icon
              :icon="item.icon"
              :color="item.iconColor"
            />
          </template>
          <template #title>
            <span v-if="item?.type !== 'divider'">{{ item.title }}</span>
            <VDivider v-else />
          </template>
        </VListItem>
      </template>
    </VList>
  </VMenu>
</template>
