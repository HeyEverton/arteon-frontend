<script setup lang="ts">
import { mockCoursesData } from './mockCourses'

interface Props {
  searchQuery: string
}
const props = defineProps<Props>()

// Data table options
const itemsPerPage = ref(6)
const page = ref(1)

const hideCompleted = ref(true)
const label = ref('Todos os Cursos')

const courses = computed(() => {
  let filtered = [...mockCoursesData]

  if (hideCompleted.value)
    filtered = filtered.filter(c => c.completedTasks !== c.totalTasks)

  if (label.value && label.value !== 'Todos os Cursos')
    filtered = filtered.filter(c => c.tags.toLowerCase() === label.value.toLowerCase())

  if (props.searchQuery)
    filtered = filtered.filter(c => c.courseTitle.toLowerCase().includes(props.searchQuery.toLowerCase()))

  const start = (page.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value

  return filtered.slice(start, end)
})

const totalCourse = computed(() => {
  let filtered = [...mockCoursesData]

  if (hideCompleted.value)
    filtered = filtered.filter(c => c.completedTasks !== c.totalTasks)

  if (label.value && label.value !== 'Todos os Cursos')
    filtered = filtered.filter(c => c.tags.toLowerCase() === label.value.toLowerCase())

  if (props.searchQuery)
    filtered = filtered.filter(c => c.courseTitle.toLowerCase().includes(props.searchQuery.toLowerCase()))

  return filtered.length
})

watch([hideCompleted, label, () => props.searchQuery], () => {
  page.value = 1
})

const resolveChipColor = (tags: string) => {
  if (tags === 'Digital')
    return 'primary'
  if (tags === 'Pintura')
    return 'success'
  if (tags === 'Arquitetura')
    return 'error'
  if (tags === 'Anatomia')
    return 'warning'
  if (tags === 'Desenho')
    return 'info'
}
</script>

<template>
  <VCard class="mb-6">
    <VCardText>
      <!-- 👉 Header -->
      <div class="d-flex justify-space-between align-center flex-wrap gap-4 mb-6">
        <div>
          <h5 class="text-h5">
            Meus Cursos
          </h5>
          <div class="text-body-1">
            Total de {{ totalCourse }} cursos matriculados
          </div>
        </div>

        <div class="d-flex flex-wrap gap-x-6 gap-y-4 align-center">
          <AppSelect
            v-model="label"
            :items="[
              { title: 'Digital', value: 'digital' },
              { title: 'Pintura', value: 'pintura' },
              { title: 'Arquitetura', value: 'arquitetura' },
              { title: 'Anatomia', value: 'anatomia' },
              { title: 'Desenho', value: 'desenho' },
              { title: 'Todos os Cursos', value: 'Todos os Cursos' },
            ]"
            style="min-inline-size: 260px;"
          />
          <VSwitch
            v-model="hideCompleted"
            label="Ocultar Concluídos"
          />
        </div>
      </div>

      <!-- 👉 Course List -->
      <div
        v-if="courses.length"
        class="mb-6"
      >
        <VRow>
          <template
            v-for="course in courses"
            :key="course.id"
          >
            <VCol
              cols="12"
              md="4"
              sm="6"
            >
              <VCard
                flat
                border
              >
                <div class="px-2 pt-2">
                  <VImg
                    :src="course.tutorImg"
                    class="cursor-pointer"
                    @click="() => $router.push({ name: 'academy-course-details' })"
                  />
                </div>
                <VCardText>
                  <div class="d-flex justify-space-between align-center mb-4">
                    <VChip
                      variant="tonal"
                      :color="resolveChipColor(course.tags)"
                      size="small"
                    >
                      {{ course.tags }}
                    </VChip>
                    <div class="d-flex">
                      <h6 class="text-h6 text-medium-emphasis align-center me-1">
                        {{ course.rating }}
                      </h6>
                      <VIcon
                        icon="tabler-star-filled"
                        color="warning"
                        size="24"
                        class="me-2"
                      />
                      <div class="text-body-1">
                        ({{ course.ratingCount }})
                      </div>
                    </div>
                  </div>
                  <h5 class="text-h5 mb-1">
                    <RouterLink
                      :to="{ name: 'academy-course-details' }"
                      class="course-title"
                    >
                      {{ course.courseTitle }}
                    </RouterLink>
                  </h5>
                  <p>
                    {{ course.desc }}
                  </p>
                  <div
                    v-if="course.completedTasks !== course.totalTasks"
                    class="d-flex align-center mb-1"
                  >
                    <VIcon
                      icon="tabler-clock"
                      size="20"
                      class="me-1"
                    />
                    <span class="text-body-1 my-auto"> {{ course.time }}</span>
                  </div>
                  <div
                    v-else
                    class="mb-1"
                  >
                    <VIcon
                      icon="tabler-check"
                      size="20"
                      color="success"
                      class="me-1"
                    />
                    <span class="text-success text-body-1">Concluído</span>
                  </div>
                  <VProgressLinear
                    :model-value="(course.completedTasks / course.totalTasks) * 100"
                    rounded
                    color="primary"
                    height="8"
                    class="mb-4"
                  />
                  <div class="d-flex flex-wrap gap-4">
                    <VBtn
                      variant="tonal"
                      color="secondary"
                      class="flex-grow-1"
                      :to="{ name: 'academy-course-details' }"
                    >
                      <template #prepend>
                        <VIcon
                          icon="tabler-rotate-clockwise-2"
                          class="flip-in-rtl"
                        />
                      </template>
                      Recomeçar
                    </VBtn>
                    <VBtn
                      v-if="course.completedTasks !== course.totalTasks"
                      variant="tonal"
                      class="flex-grow-1"
                      :to="{ name: 'academy-course-details' }"
                    >
                      <template #append>
                        <VIcon
                          icon="tabler-chevron-right"
                          class="flip-in-rtl"
                        />
                      </template>
                      Continuar
                    </VBtn>
                  </div>
                </VCardText>
              </VCard>
            </VCol>
          </template>
        </VRow>
      </div>

      <div v-else>
        <h4 class="text-h4 text-center mb-6">
          Nenhum Curso Encontrado
        </h4>
      </div>

      <VPagination
        v-model="page"
        active-color="primary"
        first-icon="tabler-chevrons-left"
        last-icon="tabler-chevrons-right"
        show-first-last-page
        :length="Math.ceil(totalCourse / itemsPerPage)"
      />
    </VCardText>
  </VCard>
</template>

<style lang="scss" scoped>
.course-title {
  &:not(:hover) {
    color: rgba(var(--v-theme-on-surface), var(--v-text-high-emphasis));
  }
}
</style>
