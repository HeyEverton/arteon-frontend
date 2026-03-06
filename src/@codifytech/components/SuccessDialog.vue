<script setup lang="ts">
export interface Message {
  title?: string | undefined
  text: string | undefined
  type: string | undefined
}

const props = defineProps<{
  isDialogVisible: boolean
  title?: string
  confirmationMsg: string | Message[]
  confirmationButtonText: string
}>()

const emit = defineEmits<{
  (e: 'update:isDialogVisible', value: boolean): void
  (e: 'confirm', value: boolean): void
}>()

const isDialogVisible = toRef(props, 'isDialogVisible')
const title = toRef(props, 'title')
const confirmationMsg = toRef(props, 'confirmationMsg')

const onConfirmation = () => {
  emit('confirm', true)
  emit('update:isDialogVisible', false)
}
</script>

<template>
  <div>
    <VDialog
      v-model:model-value="isDialogVisible"
      persistent
      max-width="500"
    >
      <DialogCloseBtn @click="onConfirmation" />
      <VCard :title="title ?? 'Confirmado!'">
        <VCardText v-if="typeof confirmationMsg === 'string'">
          {{ confirmationMsg }}
        </VCardText>

        <div v-else>
          <VCardText
            v-for="(row, index) in confirmationMsg"
            :key="index"
          >
            <VAlert :color="row.type">
              <span>{{ row.title }}: {{ row.text }}</span>
            </VAlert>
          </VCardText>
        </div>

        <VCardText class="d-flex justify-end">
          <VBtn @click="onConfirmation">
            {{ confirmationButtonText ?? 'Ok' }}
          </VBtn>
        </VCardText>
      </VCard>
    </VDialog>
  </div>
</template>
