<script lang="ts" setup>
defineOptions({
  name: 'CDFFileUpload',
  inheritAttrs: false,
})

const elementId = computed(() => {
  const attrs = useAttrs()
  const _elementIdToken = attrs.id || attrs.label

  return _elementIdToken ? `app-file-upload-field-${_elementIdToken}-${Math.random().toString(36).slice(2, 7)}` : undefined
})

const label = computed(() => useAttrs().label as string | undefined)

const viewFile = (url: string) => {
  window.open(url, 'name', 'height=600,width=800,toolbar=0,menubar=0,location=0')
}

const fileName = () => {
  const url = useAttrs().modelValue as string

  return url?.split('/').pop() ?? '' // Obtém o último segmento da URL
}
</script>

<template>
  <div
    class="app-text-field flex-grow-1"
    :class="$attrs.class"
  >
    <VLabel
      v-if="label"
      :for="elementId"
      class="mb-1 text-body-2 text-high-emphasis"
      :text="label"
    />
    <div v-if="typeof $attrs.modelValue === 'string' && !isEmpty($attrs.modelValue)">
      <input
        class="app-file-upload-field"
        :value="fileName()"
        readonly
        type="hidden"
      >

      <IconBtn @click="() => viewFile($attrs.modelValue)">
        <VIcon
          icon="fa-solid fa-eye"
          size="14"
        />
      </IconBtn>
      <IconBtn @click="() => $emit('update:modelValue', null)">
        <VIcon
          icon="fa-solid fa-trash"
          size="14"
        />
      </IconBtn>
    </div>

    <VFileInput
      v-else
      v-bind="{
        ...$attrs,
        class: null,
        label: undefined,
        variant: 'outlined',
        id: elementId,
      }"
    >
      <template
        v-for="(_, name) in $slots"
        #[name]="slotProps"
      >
        <slot
          :name="name"
          v-bind="slotProps || {}"
        />
      </template>
    </VFileInput>
  </div>
</template>

<style lang="scss">
.app-file-upload-field {
  .v-input__control {
    display: none;
  }
}
</style>
