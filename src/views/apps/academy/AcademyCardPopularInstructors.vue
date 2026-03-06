<script setup lang="ts">
import avatar1 from '@/assets/images/avatars/avatar-1.png'
import avatar2 from '@/assets/images/avatars/avatar-2.png'
import avatar3 from '@/assets/images/avatars/avatar-3.png'
import avatar4 from '@/assets/images/avatars/avatar-4.png'
</script>

<template>
  <VCard>
    <VCardItem title="Professores Populares">
      <template #append>
        <MoreBtn />
      </template>
    </VCardItem>
    <VDivider />
    <div class="d-flex justify-space-between py-4 px-6">
      <div class="text-body-1 text-uppercase">
        Professores
      </div>
      <div class="text-body-1 text-uppercase">
        Cursos
      </div>
    </div>
    <VDivider />
    <VCardText>
      <VList class="card-list">
        <VListItem
          v-for="instructor in [
            { name: 'Arthur Oliveira', profession: 'Pintura a Óleo', totalCourses: 33, avatar: avatar1 },
            { name: 'Beatriz Costa', profession: 'Arte Digital 2D', totalCourses: 52, avatar: avatar2 },
            { name: 'Carlos Mendonça', profession: 'Cartoon e Mangá', totalCourses: 12, avatar: avatar3 },
            { name: 'Danielle Santos', profession: 'Aquarela Básica', totalCourses: 8, avatar: avatar4 },
          ]"
          :key="instructor.name"
        >
          <template #prepend>
            <VAvatar
              size="34"
              :image="instructor.avatar"
            />
          </template>
          <VListItemTitle class="font-weight-medium">
            {{ instructor.name }}
          </VListItemTitle>
          <VListItemSubtitle>
            {{ instructor.profession }}
          </VListItemSubtitle>

          <template #append>
            <h6 class="text-h6">
              {{ instructor.totalCourses }}
            </h6>
          </template>
        </VListItem>
      </VList>
    </VCardText>
  </VCard>
</template>

<style lang="scss">
.card-list {
  --v-card-list-gap: 1rem;
}
</style>
