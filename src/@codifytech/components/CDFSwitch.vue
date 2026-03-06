<script lang="ts" setup>
defineOptions({
  name: 'CDFSwitch',
  inheritAttrs: false,
})

// const { class: _class, label, variant: _, ...restAttrs } = useAttrs()

const elementId = computed(() => {
  const attrs = useAttrs()
  const _elementIdToken = attrs.id || attrs.label

  return _elementIdToken ? `app-switch-${_elementIdToken}-${Math.random().toString(36).slice(2, 7)}` : undefined
})

const label = computed(() => useAttrs().label as string | undefined)
const labelSwitch = computed(() => typeof useAttrs().modelValue === 'number' ? useAttrs().modelValue ? 'Sim' : 'Não' : useAttrs().modelValue)
const loading = computed(() => useAttrs().loading as boolean | undefined)
</script>

<template>
  <VSkeletonLoader
    :loading="loading"
    type="text"
    class="flex-grow-1"
  >
    <div
      class="cdf-switch flex-grow-1"
      :class="$attrs.class"
    >
      <VLabel
        v-if="label"
        :for="elementId"
        class="mb-1 text-body-2 text-wrap"
        style="line-height: 15px;"
        :text="label"
      />
      <VSwitch
        v-bind="{
          ...$attrs,
          class: null,
          label: labelSwitch,
          id: elementId,
          variant: 'outlined',
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
      </VSwitch>
    </div>
  </VSkeletonLoader>
</template>

<style lang="scss">
.cdf-switch {
  .v-selection-control {
    block-size: 38px !important;

    .v-selection-control__wrapper {
      block-size: 38px !important;
    }
  }
}
</style>
