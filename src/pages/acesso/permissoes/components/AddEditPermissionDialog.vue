<script setup lang="ts">
import { toCamelCase } from '@codifytech/helpers/StringHelper'
import { storeToRefs } from 'pinia'
import { VForm } from 'vuetify/components/VForm'
import { usePermissoesStore } from '@/pages/acesso/permissoes/store/usePermissoesStore'

interface Props {
  isDialogVisible: boolean
  isEditing: boolean
}

interface Emit {
  (e: 'update:isDialogVisible', value: boolean): void
  (e: 'update:isEditing', value: boolean): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emit>()

const permissoesStore = usePermissoesStore()
const { listActions, createAllPermissions, updateAllPermissions } = permissoesStore
const { data, actions } = storeToRefs(permissoesStore)
const isEditing = toRef(props, 'isEditing')

const isSelectAll = ref(false)
const refPermissionForm = ref<VForm>()

const trActions = computed(() => {
  const divided = []
  for (let i = 0; i < actions.value.length; i += 4)
    divided.push(actions.value.slice(i, i + 4))

  return divided
})

watch(isSelectAll, (val) => {
  if (val) {
    actions.value.map((p) => {
      data.value?.actions?.push(`${data.value.crud} ${p.id}`)
    })
  }
  else { data.value.actions = [] }
}, { immediate: true })

const isDisabledActions = computed(() => data.value?.crud?.length === 0)

const onSubmit = () => {
  if (isEditing.value)
    updateAllPermissions(data.value)
  else
    createAllPermissions(data.value)

  emit('update:isDialogVisible', false)
  emit('update:isEditing', false)

  data.value = {
    name: '',
    crud: '',
    actions: [],
  }
  isSelectAll.value = false
  refPermissionForm.value?.reset()
}

const onReset = () => {
  emit('update:isDialogVisible', false)
  emit('update:isEditing', false)

  data.value = {
    name: '',
    crud: '',
    actions: [],
  }
  isSelectAll.value = false
  refPermissionForm.value?.reset()
}

onMounted(() => {
  listActions()
})
</script>

<template>
  <VDialog
    :width="$vuetify.display.smAndDown ? 'auto' : 600"
    :model-value="props.isDialogVisible"
    @update:model-value="onReset"
  >
    <!-- 👉 dialog close btn -->
    <DialogCloseBtn @click="onReset" />

    <VCard class="pa-sm-8 pa-5">
      <!-- 👉 Title -->
      <VCardItem class="text-center">
        <VCardTitle class="text-h5">
          {{ isEditing ? 'Editar' : 'Criar' }} Permissão
        </VCardTitle>
        <VCardSubtitle>
          {{ isEditing ? 'Edite' : 'Crie' }}  Permissões conforme suas necessidades.
        </VCardSubtitle>
      </VCardItem>

      <VCardText class="mt-1">
        <!-- 👉 Form -->
        <VForm ref="refPermissionForm">
          <VAlert
            type="warning"
            title="Aviso!"
            variant="tonal"
            class="mb-6"
          >
            Ao editar o nome da permissão, você pode comprometer a funcionalidade das permissões do sistema. Por favor, certifique-se de ter absoluta certeza antes de prosseguir.
          </VAlert>

          <VRow>
            <VCol cols="12">
              <AppTextField
                v-model="data.name"
                label="Nome da Página"
                placeholder="Insira o nome da página"
                @update:model-value="(v) => {
                  data.crud = toCamelCase(data.name)
                }"
              />
            </VCol>

            <VCol cols="12">
              <AppTextField
                v-model:value="data.crud"
                label="Nome do Assunto"
                placeholder="Insira o nome do assunto"
                readonly
              />
            </VCol>

            <VTable class="w-100">
              <thead>
                <tr>
                  <th :colspan="actions?.length">
                    <VRow align="center">
                      <span>Ações</span>
                      <VSpacer />
                      <VCheckbox
                        v-model="isSelectAll"
                        label="Selecionar todos"
                        :disabled="isDisabledActions"
                      />
                    </VRow>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(trs, trIndex) in trActions"
                  :key="trIndex"
                >
                  <td v-for="(td, tdIndex) in trs">
                    <VCheckbox
                      :key="tdIndex"
                      v-model="data.actions"
                      :label="td.title"
                      :value="`${data.crud} ${td.id}`"
                      :disabled="isDisabledActions"
                    />
                  </td>
                </tr>
              </tbody>
            </VTable>

            <!-- 👉 Submit and Cancel -->
            <VCol cols="12">
              <VBtn
                class="me-3"
                @click="onSubmit"
              >
                Salvar
              </VBtn>
              <VBtn
                color="secondary"
                variant="tonal"
                @click="onReset"
              >
                Cancelar
              </VBtn>
            </VCol>
          </VRow>
        </VForm>
      </VCardText>
    </VCard>
  </VDialog>
</template>

<style lang="scss">
.permission-table {
  td {
    border-block-end: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
    padding-block: 0.5rem;
    padding-inline: 0;
  }
}
</style>
