<!-- eslint-disable vue/no-mutating-props -->
<script setup lang="ts">
import { estados } from '@codifytech/enums/estados'
import { cepValidator, requiredValidator } from '@/validators/cdf-rules'
import { useSnackbarStore } from '../stores/useSnackbarStore'
import Utils from '../utils'

const props = defineProps<{
  data: {
    logradouro: string
    cep: string
    cidade: string
    estado: string
    bairro: string
    numero: string
    complemento?: string
  }
  readonly?: boolean
}>()

const address = toRef(props, 'data')
const carregandoDados = ref<boolean>(false)

async function pesquisarCEP() {
  if (props.data.cep.length >= 9) {
    carregandoDados.value = true
    await Utils.searchCEP(props.data.cep)
      .then(data => {
        carregandoDados.value = false
        props.data.logradouro = data.logradouro
        props.data.cidade = data.cidade
        props.data.bairro = data.bairro
        props.data.estado = data.estado
      })
      .catch(() => {
        carregandoDados.value = false

        useSnackbarStore().showSnackbar({
          text: 'O cep informado está incorreto.',
          location: 'top center',
          color: 'error',
          timeout: 5000,
        })
      })
  }
}
</script>

<template>
  <div>
    <VRow>
      <VCol
        cols="12"
        md="3"
      >
        <label for="cep">CEP</label>
        <VTextField
          id="cep"
          v-model="address.cep"
          v-debounce:900="pesquisarCEP"
          v-mask="'#####-####'"
          placeholder="Insira o CEP"
          maxlength="9"
          :loading="carregandoDados"
          :readonly="readonly"
          :rules="[requiredValidator, cepValidator]"
        />
      </VCol>
      <VCol
        cols="12"
        md="6"
      >
        <label for="logradouro">Logradouro</label>
        <VTextField
          id="logradouro"
          v-model="address.logradouro"
          placeholder="Insira o logradouro"
          :loading="carregandoDados"
          :rules="[requiredValidator]"
          :readonly="readonly"
        />
      </VCol>

      <VCol
        cols="12"
        md="3"
      >
        <label for="numero">Número</label>
        <VTextField
          id="numero"
          v-model="address.numero"
          v-mask="'#####'"
          type="tel"
          :loading="carregandoDados"
          :rules="[requiredValidator]"
          placeholder="Insira o número"
          :readonly="readonly"
        />
      </VCol>

      <VCol
        cols="12"
        md="6"
      >
        <label for="complemento">Complemento</label>
        <VTextField
          id="complemento"
          v-model="address.complemento"
          :loading="carregandoDados"
          placeholder="Insira o complemento"
          :readonly="readonly"
        />
      </VCol>

      <VCol
        cols="12"
        md="6"
      >
        <label for="bairro">Bairro</label>
        <VTextField
          id="bairro"
          v-model="address.bairro"
          :loading="carregandoDados"
          placeholder="Insira o bairro"
          :rules="[requiredValidator]"
          :readonly="readonly"
        />
      </VCol>

      <VCol
        cols="12"
        md="6"
      >
        <label for="cidade">Cidade</label>
        <VTextField
          id="cidade"
          v-model="address.cidade"
          :loading="carregandoDados"
          placeholder="Insira a cidade"
          :rules="[requiredValidator]"
          :readonly="readonly"
        />
      </VCol>

      <VCol
        cols="12"
        md="6"
      >
        <label for="estado">Estado</label>
        <VSelect
          id="estado"
          v-model="address.estado"
          :items="estados"
          placeholder="Selecione o estado"
          item-title="nome"
          item-value="sigla"
          :loading="carregandoDados"
          :readonly="readonly"
          no-data-text="Nenhum estado foi encontrado"
          :rules="[requiredValidator]"
        />
      </VCol>
    </VRow>
  </div>
</template>
