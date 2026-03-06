<script setup lang="ts">
import DialogCloseBtn from '@core/components/DialogCloseBtn.vue'

const props = defineProps<{
  isDialogVisible: boolean
  title?: string
  errors: string | []
  errorStatus: number | string
}>()

const emit = defineEmits<{
  (e: 'update:isDialogVisible', value: boolean): void
  (e: 'confirm', value: boolean): void
}>()

const updateModelValue = (val: boolean) => {
  emit('update:isDialogVisible', val)
}

const onConfirmation = () => {
  emit('confirm', true)
  updateModelValue(false)
}

const getMessage = () => {
  const errors = props?.errors

  return Object.values(errors ?? {}) ?? []
}
</script>

<template>
  <VDialog
    persistent
    max-width="500"
    :model-value="isDialogVisible"
    @update:model-value="updateModelValue"
  >
    <DialogCloseBtn @click="onConfirmation" />

    <VCard class="text-center px-10 py-6">
      <VCardText>
        <VAvatar
          size="88px"
          variant="outlined"
          color="error"
          calss="mb-5"
        >
          <VIcon
            size="3rem"
            icon="tabler-x"
          />
        </VAvatar>

        <VAlert
          v-if="getMessage().length === 0"
          color="error"
          class="text-lg font-weight-medium my-2"
        >
          {{ errorStatus ?? errors ?? 'Ocorreu um erro tente novamente mais tarde' }}
        </VAlert>

        <template v-for="(erros) in getMessage()">
          <VAlert
            v-for="(erro, index) in erros"
            :key="index"
            color="error"
            class="text-lg font-weight-medium my-2"
          >
            {{ erro }}
          </VAlert>
        </template>
      </VCardText>
    </VCard>
  </VDialog>
</template>
