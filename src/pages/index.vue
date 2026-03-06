<script setup lang="ts">
import { computed, ref } from 'vue'
import { useTheme } from 'vuetify'

definePage({
  meta: {
    action: 'read',
    subject: 'auth',
  },
})

const theme = useTheme()

// ── Mock data ─────────────────────────────────────────────────────────────────

// Novos alunos por mês
const novoAlunosPorMes = ref({
  labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
  valores: [8, 14, 11, 19, 22, 18, 25, 30, 27, 34, 38, 42],
})

// Horas de aulas ministradas por mês
const horasAulasPorMes = ref([12, 16, 14, 20, 18, 22, 24, 21, 26, 28, 30, 32])

// Distribuição de turmas por modalidade
const modalidades = ref([
  { nome: 'Desenho de Observação', alunos: 34 },
  { nome: 'Retrato e Figura Humana', alunos: 27 },
  { nome: 'Perspectiva e Arquitetura', alunos: 18 },
  { nome: 'Aquarela', alunos: 13 },
  { nome: 'Ilustração Digital', alunos: 8 },
])

// Top cursos
const topCursos = ref([
  { id: 1, nome: 'Desenho de Observação — Iniciante', nivel: 'Iniciante', alunos: 86, avaliacao: 4.9, receita: 'R$ 8.600,00', crescimento: 18 },
  { id: 2, nome: 'Retrato do Zero ao Avançado', nivel: 'Avançado', alunos: 74, avaliacao: 4.8, receita: 'R$ 11.100,00', crescimento: 12 },
  { id: 3, nome: 'Perspectiva para Arquitetos', nivel: 'Intermediário', alunos: 58, avaliacao: 4.7, receita: 'R$ 8.700,00', crescimento: -2 },
  { id: 4, nome: 'Aquarela: Texturas e Luz', nivel: 'Intermediário', alunos: 49, avaliacao: 4.9, receita: 'R$ 6.370,00', crescimento: 9 },
  { id: 5, nome: 'Ilustração Digital com Procreate', nivel: 'Iniciante', alunos: 41, avaliacao: 4.6, receita: 'R$ 4.920,00', crescimento: 25 },
])

// Atividades recentes de alunos
const atividadesRecentes = ref([
  { id: 'ATG-001', aluno: 'Ana Beatriz Costa', acao: 'Enviou portfólio', curso: 'Retrato do Zero', status: 'Aguardando Feedback', data: '06/03/2026' },
  { id: 'ATG-002', aluno: 'Carlos Mendonça', acao: 'Concluiu módulo', curso: 'Perspectiva Arquitetos', status: 'Concluído', data: '06/03/2026' },
  { id: 'ATG-003', aluno: 'Fernanda Luz', acao: 'Novo comentário', curso: 'Aquarela: Texturas', status: 'Pendente', data: '05/03/2026' },
  { id: 'ATG-004', aluno: 'Rafael Torres', acao: 'Enviou portfólio', curso: 'Desenho de Observação', status: 'Revisado', data: '05/03/2026' },
  { id: 'ATG-005', aluno: 'Juliana Farias', acao: 'Realizou avaliação', curso: 'Procreate Iniciante', status: 'Concluído', data: '04/03/2026' },
])

// Próximas aulas ao vivo
const proximasAulas = ref([
  { titulo: 'Live: Luzes e Sombras no Retrato', data: '07/03/2026', horario: '19:00', turma: 'Retrato do Zero', alunos: 74, sala: 'Sala A' },
  { titulo: 'Correção de Portfólios — Observação', data: '08/03/2026', horario: '10:00', turma: 'Desenho de Observação', alunos: 86, sala: 'Sala B' },
  { titulo: 'Q&A: Dúvidas Frequentes — Perspectiva', data: '10/03/2026', horario: '18:30', turma: 'Perspectiva Arquitetos', alunos: 58, sala: 'Sala A' },
])

// ── Métricas principais ───────────────────────────────────────────────────────
const metricas = computed(() => [
  {
    key: 'totalAlunos',
    label: 'Total de Alunos',
    valor: '308',
    variacao: 10.5,
    descricao: 'vs. mês anterior',
    icone: 'tabler-users',
    cor: '#507DBC',
  },
  {
    key: 'cursoAtivos',
    label: 'Cursos Ativos',
    valor: '5',
    variacao: 0,
    descricao: '2 em elaboração',
    icone: 'tabler-books',
    cor: '#A1C6EA',
  },
  {
    key: 'avaliacaoMedia',
    label: 'Avaliação Média',
    valor: '4.78 ★',
    variacao: 3.2,
    descricao: 'vs. mês anterior',
    icone: 'tabler-star',
    cor: '#FFD93D',
  },
  {
    key: 'receitaMensal',
    label: 'Receita do Mês',
    valor: 'R$ 6.840,00',
    variacao: 14.7,
    descricao: 'vs. mês anterior',
    icone: 'tabler-currency-real',
    cor: '#28C76F',
  },
])

// ── Configurações dos gráficos ────────────────────────────────────────────────
const labelColors = computed(() =>
  theme.current.value.dark ? '#94A3B8' : '#64748B',
)

const gridColor = computed(() =>
  theme.current.value.dark ? '#1E3C5A' : '#E2E8F0',
)

const tooltipTheme = computed(() =>
  theme.current.value.dark ? 'dark' : 'light',
)

// Gráfico de novos alunos (área)
const alunosChartOptions = computed(() => ({
  chart: { type: 'area', height: 350, toolbar: { show: false } },
  dataLabels: { enabled: false },
  stroke: { curve: 'smooth', width: 3 },
  fill: {
    type: 'gradient',
    gradient: { shadeIntensity: 1, opacityFrom: 0.6, opacityTo: 0.1, stops: [0, 90, 100] },
  },
  colors: ['#507DBC'],
  xaxis: {
    categories: novoAlunosPorMes.value.labels,
    labels: { style: { colors: labelColors.value } },
  },
  yaxis: {
    labels: {
      formatter: (v: number) => String(v),
      style: { colors: labelColors.value },
    },
  },
  grid: { borderColor: gridColor.value, strokeDashArray: 4 },
  tooltip: {
    theme: tooltipTheme.value,
    y: { formatter: (v: number) => `${v} alunos` },
  },
}))

const alunosChartSeries = computed(() => [{
  name: 'Novos Alunos',
  data: novoAlunosPorMes.value.valores,
}])

// Gráfico de horas de aula (barras)
const horasChartOptions = computed(() => ({
  chart: { type: 'bar', height: 350, toolbar: { show: false } },
  plotOptions: { bar: { borderRadius: 8, columnWidth: '50%' } },
  dataLabels: { enabled: false },
  colors: ['#A1C6EA'],
  xaxis: {
    categories: novoAlunosPorMes.value.labels,
    labels: { style: { colors: labelColors.value } },
  },
  yaxis: {
    labels: {
      formatter: (v: number) => `${v}h`,
      style: { colors: labelColors.value },
    },
  },
  grid: { borderColor: gridColor.value, strokeDashArray: 4 },
  tooltip: {
    theme: tooltipTheme.value,
    y: { formatter: (v: number) => `${v} horas` },
  },
}))

const horasChartSeries = computed(() => [{
  name: 'Horas Ministradas',
  data: horasAulasPorMes.value,
}])

// Gráfico de modalidades (donut)
const modalidadesChartOptions = computed(() => ({
  chart: { type: 'donut', height: 300 },
  labels: modalidades.value.map(m => m.nome),
  colors: ['#507DBC', '#A1C6EA', '#BBD1EA', '#FFD93D', '#28C76F'],
  legend: {
    position: 'bottom',
    fontSize: '12px',
    labels: { colors: labelColors.value },
  },
  plotOptions: {
    pie: {
      donut: {
        size: '68%',
        labels: {
          show: true,
          name: { show: true, fontSize: '14px', color: theme.current.value.dark ? '#DAE3E5' : '#04080F' },
          value: {
            show: true,
            fontSize: '22px',
            fontWeight: 700,
            color: theme.current.value.dark ? '#DAE3E5' : '#04080F',
            formatter: (val: string) => `${val}%`,
          },
          total: {
            show: true,
            label: 'Alunos',
            fontSize: '13px',
            color: labelColors.value,
            formatter: () => '308',
          },
        },
      },
    },
  },
  dataLabels: { enabled: false },
  tooltip: { theme: tooltipTheme.value },
}))

const modalidadesChartSeries = computed(() => modalidades.value.map(m => m.alunos))

// ── Helpers ───────────────────────────────────────────────────────────────────
const getStatusColor = (status: string) => {
  switch (status) {
    case 'Concluído': return 'success'
    case 'Revisado': return 'primary'
    case 'Aguardando Feedback': return 'warning'
    case 'Pendente': return 'info'
    default: return 'secondary'
  }
}

const getNivelColor = (nivel: string) => {
  switch (nivel) {
    case 'Iniciante': return 'success'
    case 'Intermediário': return 'warning'
    case 'Avançado': return 'error'
    default: return 'secondary'
  }
}
</script>

<template>
  <div>
    <!-- ── Header ─────────────────────────────────────────────────────────── -->
    <div class="mb-6">
      <h1 class="text-h4 font-weight-bold mb-1">
        Área do Professor 🎨
      </h1>
      <p class="text-body-1 text-medium-emphasis">
        Gerencie seus cursos, acompanhe o progresso dos alunos e visualize suas métricas de ensino.
      </p>
    </div>

    <!-- ── Métricas Principais ────────────────────────────────────────────── -->
    <VRow class="mb-6">
      <VCol
        v-for="metrica in metricas"
        :key="metrica.key"
        cols="12"
        sm="6"
        md="3"
      >
        <VCard
          class="metrica-card"
          :style="{ borderTop: `4px solid ${metrica.cor}` }"
        >
          <VCardText>
            <div class="d-flex justify-space-between align-start mb-3">
              <div>
                <p class="text-caption text-uppercase text-medium-emphasis mb-1 font-weight-medium">
                  {{ metrica.label }}
                </p>
                <h2 class="text-h5 font-weight-bold">
                  {{ metrica.valor }}
                </h2>
              </div>
              <VAvatar
                :color="metrica.cor"
                size="46"
                rounded
                style="opacity: 0.15;"
                class="metrica-avatar"
              >
                <VIcon
                  :icon="'tabler-users'"
                  size="26"
                  :color="metrica.cor"
                  style="opacity: 1;"
                />
              </VAvatar>
            </div>
            <div class="d-flex align-center">
              <VChip
                v-if="metrica.variacao !== 0"
                :color="metrica.variacao > 0 ? 'success' : 'error'"
                size="small"
                variant="tonal"
                class="font-weight-medium me-2"
              >
                <VIcon
                  :icon="metrica.variacao > 0 ? 'tabler-trending-up' : 'tabler-trending-down'"
                  size="14"
                  class="me-1"
                />
                {{ metrica.variacao > 0 ? '+' : '' }}{{ metrica.variacao }}%
              </VChip>
              <span class="text-caption text-medium-emphasis">{{ metrica.descricao }}</span>
            </div>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>

    <!-- ── Gráficos principais ────────────────────────────────────────────── -->
    <VRow class="mb-6">
      <!-- Novos Alunos por Mês -->
      <VCol
        cols="12"
        md="8"
      >
        <VCard height="100%">
          <VCardTitle class="d-flex align-center justify-space-between pt-4 px-5">
            <div>
              <p class="text-subtitle-1 font-weight-bold mb-0">
                Novos Alunos por Mês
              </p>
              <p class="text-caption text-medium-emphasis mb-0">
                Crescimento da base de alunos em 2026
              </p>
            </div>
            <VChip
              color="primary"
              size="small"
              variant="tonal"
            >
              2026
            </VChip>
          </VCardTitle>
          <VCardText>
            <VueApexCharts
              type="area"
              :options="alunosChartOptions"
              :series="alunosChartSeries"
              height="300"
            />
          </VCardText>
        </VCard>
      </VCol>

      <!-- Distribuição por Modalidade -->
      <VCol
        cols="12"
        md="4"
      >
        <VCard height="100%">
          <VCardTitle class="pt-4 px-5">
            <p class="text-subtitle-1 font-weight-bold mb-0">
              Alunos por Modalidade
            </p>
            <p class="text-caption text-medium-emphasis mb-0">
              Distribuição dos {{ metricas.find(m => m.key === 'totalAlunos')?.valor }} alunos ativos
            </p>
          </VCardTitle>
          <VCardText>
            <VueApexCharts
              type="donut"
              :options="modalidadesChartOptions"
              :series="modalidadesChartSeries"
              height="300"
            />
          </VCardText>
        </VCard>
      </VCol>
    </VRow>

    <!-- ── Horas de Aula ──────────────────────────────────────────────────── -->
    <VRow class="mb-6">
      <VCol cols="12">
        <VCard>
          <VCardTitle class="d-flex align-center justify-space-between pt-4 px-5">
            <div>
              <p class="text-subtitle-1 font-weight-bold mb-0">
                Horas de Aula Ministradas por Mês
              </p>
              <p class="text-caption text-medium-emphasis mb-0">
                Total acumulado em 2026: {{ horasAulasPorMes.reduce((a, b) => a + b, 0) }} horas
              </p>
            </div>
            <VBtn
              variant="tonal"
              color="primary"
              size="small"
            >
              <VIcon
                icon="tabler-download"
                class="me-1"
              />
              Exportar
            </VBtn>
          </VCardTitle>
          <VCardText>
            <VueApexCharts
              type="bar"
              :options="horasChartOptions"
              :series="horasChartSeries"
              height="280"
            />
          </VCardText>
        </VCard>
      </VCol>
    </VRow>

    <!-- ── Tabelas + Próximas Aulas ───────────────────────────────────────── -->
    <VRow class="mb-6">
      <!-- Top 5 Cursos -->
      <VCol
        cols="12"
        md="8"
      >
        <VCard>
          <VCardTitle class="d-flex align-center justify-space-between pt-4 px-5">
            <div>
              <p class="text-subtitle-1 font-weight-bold mb-0">
                Desempenho dos Cursos
              </p>
              <p class="text-caption text-medium-emphasis mb-0">
                Métricas dos seus 5 cursos ativos
              </p>
            </div>
            <VBtn
              variant="text"
              color="primary"
              size="small"
            >
              Ver Todos
              <VIcon
                icon="tabler-chevron-right"
                class="ms-1"
              />
            </VBtn>
          </VCardTitle>
          <VCardText class="px-0 pb-0">
            <VTable>
              <thead>
                <tr>
                  <th class="text-caption text-uppercase ps-5">
                    Curso
                  </th>
                  <th class="text-caption text-uppercase text-center">
                    Alunos
                  </th>
                  <th class="text-caption text-uppercase text-center">
                    Avaliação
                  </th>
                  <th class="text-caption text-uppercase">
                    Receita
                  </th>
                  <th class="text-caption text-uppercase text-center">
                    Crescimento
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="curso in topCursos"
                  :key="curso.id"
                  class="curso-row"
                >
                  <td class="ps-5">
                    <p class="font-weight-medium mb-0 text-body-2">
                      {{ curso.nome }}
                    </p>
                    <VChip
                      :color="getNivelColor(curso.nivel)"
                      size="x-small"
                      variant="tonal"
                      class="mt-1"
                    >
                      {{ curso.nivel }}
                    </VChip>
                  </td>
                  <td class="text-center">
                    <span class="font-weight-semibold">{{ curso.alunos }}</span>
                  </td>
                  <td class="text-center">
                    <VChip
                      color="warning"
                      size="small"
                      variant="tonal"
                    >
                      ★ {{ curso.avaliacao }}
                    </VChip>
                  </td>
                  <td>
                    <span class="font-weight-bold text-success">{{ curso.receita }}</span>
                  </td>
                  <td class="text-center">
                    <VChip
                      :color="curso.crescimento > 0 ? 'success' : 'error'"
                      size="small"
                      variant="tonal"
                    >
                      <VIcon
                        :icon="curso.crescimento > 0 ? 'tabler-arrow-up' : 'tabler-arrow-down'"
                        size="13"
                        class="me-1"
                      />
                      {{ curso.crescimento > 0 ? '+' : '' }}{{ curso.crescimento }}%
                    </VChip>
                  </td>
                </tr>
              </tbody>
            </VTable>
          </VCardText>
        </VCard>
      </VCol>

      <!-- Próximas Aulas ao Vivo -->
      <VCol
        cols="12"
        md="4"
      >
        <VCard height="100%">
          <VCardTitle class="pt-4 px-5">
            <p class="text-subtitle-1 font-weight-bold mb-0">
              Próximas Aulas ao Vivo
            </p>
            <p class="text-caption text-medium-emphasis mb-0">
              Seus próximos 3 encontros agendados
            </p>
          </VCardTitle>
          <VCardText>
            <div
              v-for="(aula, i) in proximasAulas"
              :key="i"
              class="aula-item pa-3 mb-3 rounded-lg"
            >
              <div class="d-flex align-center justify-space-between mb-2">
                <VChip
                  color="primary"
                  size="x-small"
                  variant="tonal"
                >
                  {{ aula.sala }}
                </VChip>
                <span class="text-caption text-medium-emphasis">{{ aula.data }} · {{ aula.horario }}</span>
              </div>
              <p class="font-weight-semibold text-body-2 mb-1">
                {{ aula.titulo }}
              </p>
              <div class="d-flex align-center text-caption text-medium-emphasis">
                <VIcon
                  icon="tabler-users"
                  size="14"
                  class="me-1"
                />
                {{ aula.alunos }} alunos · {{ aula.turma }}
              </div>
            </div>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>

    <!-- ── Atividades Recentes dos Alunos ─────────────────────────────────── -->
    <VRow>
      <VCol cols="12">
        <VCard>
          <VCardTitle class="d-flex align-center justify-space-between pt-4 px-5">
            <div>
              <p class="text-subtitle-1 font-weight-bold mb-0">
                Atividades Recentes dos Alunos
              </p>
              <p class="text-caption text-medium-emphasis mb-0">
                Últimas interações que precisam da sua atenção
              </p>
            </div>
            <VBtn
              variant="text"
              color="primary"
              size="small"
            >
              Ver Todas
              <VIcon
                icon="tabler-chevron-right"
                class="ms-1"
              />
            </VBtn>
          </VCardTitle>
          <VCardText class="px-0 pb-0">
            <VTable>
              <thead>
                <tr>
                  <th class="text-caption text-uppercase ps-5">
                    Aluno
                  </th>
                  <th class="text-caption text-uppercase">
                    Ação
                  </th>
                  <th class="text-caption text-uppercase">
                    Curso
                  </th>
                  <th class="text-caption text-uppercase text-center">
                    Status
                  </th>
                  <th class="text-caption text-uppercase">
                    Data
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="ativ in atividadesRecentes"
                  :key="ativ.id"
                  class="curso-row"
                >
                  <td class="ps-5">
                    <div class="d-flex align-center gap-3">
                      <VAvatar
                        color="primary"
                        size="32"
                        variant="tonal"
                      >
                        <span class="text-caption font-weight-bold">
                          {{ ativ.aluno.split(' ').map(n => n[0]).slice(0, 2).join('') }}
                        </span>
                      </VAvatar>
                      <span class="font-weight-medium text-body-2">{{ ativ.aluno }}</span>
                    </div>
                  </td>
                  <td>
                    <span class="text-body-2">{{ ativ.acao }}</span>
                  </td>
                  <td>
                    <span class="text-caption text-medium-emphasis">{{ ativ.curso }}</span>
                  </td>
                  <td class="text-center">
                    <VChip
                      :color="getStatusColor(ativ.status)"
                      size="x-small"
                      variant="tonal"
                    >
                      {{ ativ.status }}
                    </VChip>
                  </td>
                  <td>
                    <span class="text-caption text-medium-emphasis">{{ ativ.data }}</span>
                  </td>
                </tr>
              </tbody>
            </VTable>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </div>
</template>

<style scoped lang="scss">
.metrica-card {
  position: relative;
  overflow: hidden;
  transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.25s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 28px rgba(0, 0, 0, 0.12);
  }
}

.metrica-avatar {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.metrica-card:hover .metrica-avatar {
  transform: scale(1.12) rotate(6deg);
}

.aula-item {
  background: rgba(var(--v-theme-primary), 0.04);
  border: 1px solid rgba(var(--v-theme-primary), 0.1);
  transition: background 0.2s;

  &:hover {
    background: rgba(var(--v-theme-primary), 0.09);
  }

  &:last-child {
    margin-block-end: 0 !important;
  }
}

.curso-row {
  transition: background 0.15s;

  &:hover {
    background: rgba(var(--v-theme-on-surface), 0.03);
  }
}
</style>
