<script setup lang="ts">
import type { Actions } from '@codifytech/types/globalTypes'
import type { VForm } from 'vuetify/components/VForm'
import CDFButton from '@codifytech/components/CDFButton.vue'
import { onMounted, ref, toRef } from 'vue'
import { useDisplay } from 'vuetify'

const props = withDefaults(defineProps<{
  title: string
  back: string
  actions?: Actions
  form: VForm
  formKey: number
  isHeader?: boolean
  isActions?: boolean
  isEditing?: boolean
  isReadOnly?: boolean
  loading: boolean
}>(), {
  isHeader: true,
  isActions: true,
  isReadOnly: false,
})

const emit = defineEmits<{
  (e: 'update:form', value: VForm): void
  (e: 'update:loading', value: boolean): void
}>()

const formBase = ref<VForm | null>(null)
const loading = toRef(props, 'loading')
const display = useDisplay()
const router = useRouter()

onMounted(() => {
  if (formBase.value)
    emit('update:form', formBase.value)
})

const handleSubmit = async (event: Event) => {
  event.preventDefault()
  if (formBase.value) {
    const { valid } = await formBase.value.validate()
    if (valid) {
      if (props.isEditing && props.actions?.update?.method)
        props.actions.update.method()
      else if (props.actions?.save?.method)
        props.actions.save.method()
    }
  }
}

watch(formBase, value => {
  emit('update:form', value)
})
</script>

<template>
  <!-- Header -->
  <VCard
    v-if="isHeader"
    class="mb-2"
  >
    <VCardItem>
      <VRow
        class="pa-4"
        align="center"
      >
        <VCardTitle>
          <template #default>
            <h2 class="header text-h6 text-lg-h4">
              {{ title }}
            </h2>
          </template>
        </VCardTitle>
        <VSpacer />
        <VCardActions class="py-0">
          <slot name="header-actions" />
          <CDFButton
            icon="tabler-arrow-back"
            color="primary"
            variant="outlined"
            :to="back"
            :is-text="display.smAndUp"
            :size="display.smAndUp ? 'default' : 'small'"
            @click="() => {
              router.push(back)
              formBase?.reset()
              formBase?.resetValidation()
            }"
          >
            Voltar
          </CDFButton>
        </VCardActions>
      </VRow>
    </VCardItem>
  </VCard>

  <VForm
    ref="formBase"
    :key="formKey"
    @submit.prevent="handleSubmit"
  >
    <VCard>
      <VCardItem>
        <!-- Content -->
        <VRow class="layout-forms-content">
          <slot name="content" />
        </VRow>

        <!-- Actions -->
        <VCardItem
          v-if="isActions"
          class="pb-0 px-0"
        >
          <VDivider />
          <VRow
            class="pt-5 pb-0 my-2"
            align="center"
          >
            <VCardActions class="py-0">
              <CDFButton
                v-model:loading="loading"
                :icon="actions?.save?.icon ?? 'tabler-send'"
                :color="(actions?.save?.color ?? 'success') as any"
                variant="elevated"
                type="submit"
              >
                {{ actions?.save?.text ?? 'Salvar' }}
              </CDFButton>
              <CDFButton
                :icon="isEditing ? 'tabler-x' : actions?.reset?.icon ?? 'tabler-eraser'"
                :color="(actions?.reset?.color ?? 'error') as any"
                variant="elevated"
                :to="isEditing ? back : undefined"
                @click="() => {
                  if (actions?.reset?.method) actions.reset.method()
                  formBase?.reset()
                  formBase?.resetValidation()
                }"
              >
                {{ isEditing ? 'Cancelar' : actions?.reset?.text ?? 'Limpar' }}
              </CDFButton>
            </VCardActions>
          </VRow>
        </VCardItem>
      </VCardItem>
    </VCard>
  </VForm>
</template>
