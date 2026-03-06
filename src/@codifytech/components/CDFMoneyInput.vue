<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'

defineOptions({ name: 'InputDinheiro', inheritAttrs: false })

const props = withDefaults(defineProps<{
  modelValue?: number
  type?: 'currency' | 'number'
}>(), {
  type: 'currency',
})

const emit = defineEmits(['update:modelValue'])

// Valores internos
const displayValue = ref<string>('')
const numberInputValue = ref<number | undefined>(props.modelValue)

// Função para formatar como moeda
function formatCurrency(value: number | undefined): string {
  if (value === undefined || value === null)
    return ''

  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

// Função para desformatar (remover pontos e converter vírgula em ponto)
function parseCurrency(formatted: string): number {
  if (!formatted)
    return 0

  // Remove todos os pontos (separadores de milhares) e substitui vírgula por ponto
  const cleaned = formatted.replace(/\./g, '').replace(',', '.')

  return Number.parseFloat(cleaned) || 0
}

// Inicializar displayValue
if (props.type === 'currency')
  displayValue.value = formatCurrency(props.modelValue)

// Watch para atualizar quando modelValue mudar externamente
watch(
  () => props.modelValue,
  (value: number | undefined) => {
    if (props.type === 'currency')
      displayValue.value = formatCurrency(value)
    else
      numberInputValue.value = value
  },
)

// Handler para input currency - formata em tempo real
function handleCurrencyInput(event: Event) {
  const target = event.target as HTMLInputElement
  const cursorPosition = target.selectionStart || 0
  const value = target.value

  // Remove tudo que não for número
  const numbersOnly = value.replace(/\D/g, '')

  if (!numbersOnly) {
    displayValue.value = ''
    emit('update:modelValue', 0)

    return
  }

  // Converte para número e divide por 100 (para incluir centavos)
  const numericValue = Number.parseInt(numbersOnly, 10) / 100

  // Formata com separadores
  const formatted = formatCurrency(numericValue)

  // Calcula nova posição do cursor
  const oldLength = value.length
  const newLength = formatted.length
  const diff = newLength - oldLength
  const newPosition = Math.max(0, cursorPosition + diff)

  displayValue.value = formatted

  // Restaura posição do cursor no próximo tick
  nextTick(() => {
    target.setSelectionRange(newPosition, newPosition)
  })

  // Emite valor numérico
  if (numericValue !== props.modelValue)
    emit('update:modelValue', numericValue)
}

// Handler para blur (quando sai do campo)
function handleCurrencyBlur() {
  const numericValue = parseCurrency(displayValue.value)

  displayValue.value = formatCurrency(numericValue)

  if (numericValue !== props.modelValue)
    emit('update:modelValue', numericValue)
}

// Watch para emitir mudanças - Number
watch(numberInputValue, (newValue: number | undefined) => {
  if (props.type === 'number' && newValue !== props.modelValue)
    emit('update:modelValue', newValue)
})

const elementId = computed(() => {
  const attrs = useAttrs()
  const _elementIdToken = attrs.id || attrs.label

  return _elementIdToken ? `app-text-field-${_elementIdToken}-${Math.random().toString(36).slice(2, 7)}` : undefined
})

const label = computed(() => useAttrs().label as string | undefined)

const filteredAttrs = computed(() => {
  const attributes = useAttrs()
  const { label: _, ...rest } = attributes

  return rest
})

const filteredSlots = computed(() => {
  const slots = useSlots()
  const { label: _, ...rest } = slots

  return rest
})

onUnmounted(() => {
  emit('update:modelValue', null)
})
</script>

<template>
  <div
    class="app-text-field flex-grow-1"
    :class="$attrs.class"
  >
    <slot
      v-if="label || $slots.label"
      name="label"
      :label="label"
      :element-id="elementId"
    >
      <VLabel
        :for="elementId"
        class="mb-1 text-body-2 text-high-emphasis"
        :text="label"
      />
    </slot>
    <VTextField
      v-if="props.type === 'number'"
      :id="elementId"
      v-model.number="numberInputValue"
      type="number"
      variant="outlined"
      v-bind="filteredAttrs"
    >
      <template
        v-for="(_, slotName) in filteredSlots"
        #[slotName]="slotProps"
        :key="slotName"
      >
        <slot
          v-if="typeof slotName === 'string' && slotName !== 'label' && !['actions', 'content', 'header-actions'].includes(slotName)"
          :name="slotName"
          v-bind="slotProps"
        />
      </template>
    </VTextField>
    <VTextField
      v-else
      :id="elementId"
      v-model="displayValue"
      type="text"
      variant="outlined"
      inputmode="decimal"
      v-bind="filteredAttrs"
      @input="handleCurrencyInput"
      @blur="handleCurrencyBlur"
    >
      <template
        v-for="(_, slotName) in filteredSlots"
        #[slotName]="slotProps"
        :key="slotName"
      >
        <slot
          v-if="typeof slotName === 'string' && slotName !== 'label' && !['actions', 'content', 'header-actions'].includes(slotName)"
          :name="slotName"
          v-bind="slotProps"
        />
      </template>
    </VTextField>
  </div>
</template>
