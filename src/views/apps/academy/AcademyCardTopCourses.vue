<script setup lang="ts">
const coursesData = [
  { title: 'Curso Básico de Desenho de Layout', views: '1.2k', icon: 'tabler-pencil', color: 'primary' },
  { title: 'Introdução à Pintura Digital', views: '834', icon: 'tabler-palette', color: 'info' },
  { title: 'Fundamentos de Fotografia para Refs', views: '3.7k', icon: 'tabler-camera', color: 'success' },
  { title: 'Design Visual Avançado em Procreate', views: '2.5k', icon: 'tabler-brush', color: 'warning' },
  { title: 'Sua Primeira Aula de Sketching', views: '948', icon: 'tabler-book', color: 'error' },
]
</script>

<template>
  <VCard>
    <VCardItem title="Top Cursos">
      <template #append>
        <MoreBtn />
      </template>
    </VCardItem>

    <VCardText>
      <VList class="card-list">
        <VListItem
          v-for="(course, index) in coursesData"
          :key="index"
        >
          <template #prepend>
            <VAvatar
              rounded
              variant="tonal"
              :color="course.color"
            >
              <VIcon
                :icon="course.icon"
                size="24"
              />
            </VAvatar>
          </template>

          <VListItemTitle class="me-4">
            <div class="d-flex flex-column">
              <h6 class="text-h6 text-truncate">
                {{ course.title }}
              </h6>
              <div>
                <VChip
                  variant="tonal"
                  color="secondary"
                  label
                  size="small"
                >
                  {{ course.views }} Visualizações
                </VChip>
              </div>
            </div>
          </VListItemTitle>
        </VListItem>
      </VList>
    </VCardText>
  </VCard>
</template>
