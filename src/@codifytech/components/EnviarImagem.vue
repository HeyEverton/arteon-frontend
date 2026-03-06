<script lang="ts">
import type { PropType } from 'vue'
import CDFAvatar from '@codifytech/components/CDFAvatar.vue'
import CDFButton from '@codifytech/components/CDFButton.vue'
import { defineComponent, ref, watch } from 'vue'

export default defineComponent({
  name: 'AvatarComponent',
  components: { CDFButton, CDFAvatar },
  props: {
    // Prop para receber o arquivo
    modelValue: {
      type: Object as PropType<File | string | null>, // Será um arquivo ou null
      default: null,
    },
    placeholder: {
      type: Object as PropType<string | null>, // Será um arquivo ou null
      default: null,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:modelValue'], // Emite o update para two-way binding

  setup(props, { emit }) {
    const fileInput = ref<HTMLInputElement | null>(null) // Referência ao input de arquivos
    const previewImage = ref<string | null>(null) // Controle do preview da imagem

    // Atualiza o preview sempre que o modelValue mudar
    watch(
      () => props.modelValue,
      (newValue) => {
        if (newValue instanceof File) {
          // Cria o URL do Blob se modelValue for um arquivo
          previewImage.value = URL.createObjectURL(newValue)
        }
        else {
          // Reseta o preview se não existir arquivo
          previewImage.value = props.modelValue
        }
      },
      { immediate: true }, // Executa assim que o componente for montado
    )

    // Abrir seletor de arquivos
    const triggerFileUpload = () => {
      fileInput.value?.click() // Dispara o clique no input escondido
    }

    // Manipula o upload do arquivo
    const handleFileUpload = (event: Event) => {
      const target = event.target as HTMLInputElement
      const file = target.files?.[0] // Obtém o primeiro arquivo selecionado

      if (file)
        emit('update:modelValue', file) // Atualiza o modelValue com o arquivo selecionado
    }

    // Remove o arquivo carregado
    const removeImage = () => {
      emit('update:modelValue', null) // Atualiza modelValue para null
      if (fileInput.value)
        fileInput.value.value = '' // Reseta o campo do input
    }

    return {
      fileInput,
      previewImage,
      triggerFileUpload,
      handleFileUpload,
      removeImage,
    }
  },
})
</script>

<template>
  <div class="enviar-imagem position-relative">
    <VSkeletonLoader
      :loading="loading"
      type="avatar"
      class="flex-grow-1"
      boilerplate
    >
      <!-- Avatar Preview -->
      <CDFAvatar
        class="enviar-imagem-avatar"
        color="primary"
        variant="tonal"
        size="150"
        :font-size="30"
        :foto="previewImage"
        :name="placeholder || 'Avatar'"
      />
    </VSkeletonLoader>
    <div class="enviar-imagem-actions">
      <!-- Upload Button -->
      <CDFButton
        is-icon
        icon="tabler-cloud-upload"
        variant="text"
        class="enviar-imagem-btn"
        color="info"
        rounded="100%"
        size="30px"
        type="button"
        @click="triggerFileUpload"
      />
      <!-- Remove Button (shown only if an image is uploaded) -->
      <CDFButton
        v-if="previewImage"
        is-icon
        icon="tabler-trash"
        variant="text"
        class="enviar-imagem-btn"
        color="error"
        rounded="100%"
        size="30px"
        type="button"
        @click="removeImage"
      />
    </div>

    <!-- Hidden File Input -->
    <input
      ref="fileInput"
      type="file"
      class="d-none"
      accept="image/*"
      @change="handleFileUpload"
    >
  </div>
</template>

<style lang="scss">
.enviar-imagem {
  inline-size: fit-content;

  .enviar-imagem-avatar:hover {
    cursor: pointer;
    opacity: 0.7;
  }

  .enviar-imagem-actions {
    position: absolute;
    display: flex;
    flex-direction: column;
    gap: 2px;
    inset-block-end: 30px;
    inset-inline-end: -15px;
    transform: translate(50%, 50%);

    .enviar-imagem-btn{}
  }
}
</style>
