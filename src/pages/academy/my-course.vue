<script setup lang="ts">
import boyAppAcademy from '@/assets/images/illustrations/boy-app-academy.png'
import girlAppAcademy from '@/assets/images/illustrations/girl-app-academy.png'
import academyCourseIllustration1 from '@/assets/images/pages/academy-course-illustration1.png'
import academyCourseIllustration2Dark from '@/assets/images/pages/academy-course-illustration2-dark.png'
import academyCourseIllustration2Light from '@/assets/images/pages/academy-course-illustration2-light.png'
import guitarCoursePoster from '@/assets/images/pages/guitar-course-poster.png'
import singingCoursePoster from '@/assets/images/pages/singing-course-poster.png'
import AcademyMyCourses from '@/views/apps/academy/AcademyMyCourses.vue'

const academyCourseIllustration2 = useGenerateImageVariant(academyCourseIllustration2Light, academyCourseIllustration2Dark)

const searchQuery = ref('')
</script>

<template>
  <div>
    <VCard class="mb-6">
      <VCardText class="py-12 position-relative">
        <div
          class="d-flex flex-column gap-y-4 mx-auto"
          :class="$vuetify.display.mdAndUp ? 'w-50' : $vuetify.display.xs ? 'w-100' : 'w-75'"
        >
          <h4
            class="text-h4 text-center text-wrap mx-auto"
            :class="$vuetify.display.mdAndUp ? 'w-75' : 'w-100'"
          >
            Aulas, atividades e aprendizado.
            <span class="text-primary text-no-wrap"> Tudo em um só lugar.</span>
          </h4>
          <p class="text-center text-wrap text-body-1 mx-auto mb-0">
            Melhore suas habilidades com cursos de pintura digital, desenhos clássicos, conceitos de design e teoria da cor.
          </p>
          <div class="d-flex justify-center align-center gap-4 flex-wrap">
            <div
              class="flex-grow-1"
              style="max-inline-size: 350px;"
            >
              <AppTextField
                v-model="searchQuery"
                placeholder="Buscar em minhas aulas"
              />
            </div>
            <VBtn
              color="primary"
              density="comfortable"
              icon="tabler-search"
              class="rounded"
            />
          </div>
        </div>
        <img
          :src="academyCourseIllustration1"
          class="illustration1 d-none d-md-block flip-in-rtl"
          height="180"
        >
        <img
          :src="academyCourseIllustration2"
          class="illustration2 d-none d-md-block"
          height="100"
        >
      </VCardText>
    </VCard>

    <AcademyMyCourses :search-query="searchQuery" />

    <div class="mb-6">
      <VRow>
        <VCol
          v-for="{ title, btnText, color, description, image } in [
            { title: 'Ganhe um Certificado', description: 'Termine todos os módulos da sua trilha para gerar ser certificado online.', btnText: 'Ver Trilhas', color: 'primary', image: boyAppAcademy },
            { title: 'Cursos Mais Bem Avaliados', description: 'Matricule-se nos cursos de desenho e arte digital mais populares.', btnText: 'Ver Cursos', color: 'error', image: girlAppAcademy },
          ]"
          :key="title"
          cols="12"
          md="6"
        >
          <VCard

            flat
            :color="`rgba(var(--v-theme-${color}), var(--v-selected-opacity))`"
          >
            <VCardText>
              <div class="d-flex justify-space-between gap-4 flex-column-reverse flex-sm-row">
                <div class="text-center text-sm-start">
                  <h5
                    class="text-h5 mb-1"
                    :class="`text-${color}`"
                  >
                    <div class="d-flex justify-space-between gap-4 flex-column-reverse flex-sm-row">
                      <div class="text-center text-sm-start">
                        <h5
                          class="text-h5 mb-1"
                          :class="`text-${color}`"
                        >
                          {{ title }}
                        </h5>
                      </div>
                    </div>
                  </h5>
                  <p
                    class="text-body-1 mx-auto"
                    style="max-inline-size: 300px;"
                  >
                    {{ description }}
                  </p>
                  <VBtn :color="color">
                    {{ btnText }}
                  </VBtn>
                </div>

                <div class="align-self-center">
                  <div class="align-self-center">
                    <img
                      :src="image"
                      height="127"
                      class="flip-in-rtl"
                    >
                  </div>
                </div>
              </div>
            </VCardText>
          </VCard>
        </VCol>
      </VRow>
    </div>

    <VCard>
      <VCardText>
        <VRow>
          <VCol
            cols="12"
            md="4"
          >
            <div class="d-flex flex-column align-center gap-y-4 h-100 justify-center">
              <VAvatar
                variant="tonal"
                size="52"
                rounded
                color="primary"
              >
                <VIcon
                  icon="tabler-gift"
                  size="36"
                />
              </VAvatar>
              <h4 class="text-h4 font-weight-medium">
                Cursos Gratuitos de Hoje
              </h4>
              <p class="text-body-1 text-center mb-0">
                Oferecemos aulas introdutórias de desenho para que você expanda sua visão artística. Pratique de graça com a Arteon!
              </p>
              <VBtn>Conhecer Premium</VBtn>
            </div>
          </VCol>
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
                <VVideo
                  :image="guitarCoursePoster"
                  src="https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-576p.mp4"
                  pills
                  density="compact"
                  :height="$vuetify.display.mdAndUp ? 200 : 150"
                  elevation="0"
                  rounded
                />
              </div>
              <VCardText>
                <h5 class="text-h5 mb-2">
                  Sua Primeira Aula de Sketching
                </h5>
                <p class="text-body-1 mb-0">
                  Pratique fundamentos iniciais de esboço e soltura do traço.
                </p>
              </VCardText>
            </VCard>
          </VCol>
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
                <VVideo
                  :image="singingCoursePoster"
                  src="https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-576p.mp4"
                  pills
                  density="compact"
                  :height="$vuetify.display.mdAndUp ? 200 : 150"
                  elevation="0"
                  rounded
                />
              </div>
              <VCardText>
                <h5 class="text-h5 mb-2">
                  Materiais para Iniciantes
                </h5>
                <p class="text-body-1 mb-0">
                  Entenda sobre tintas, papéis, lápis, telas, softwares de pintura e suas aplicações.
                </p>
              </VCardText>
            </VCard>
          </VCol>
        </VRow>
      </VCardText>
    </VCard>
  </div>
</template>

<style lang="scss">
.illustration1 {
  position: absolute;
  inset-block-end: 0;
  inset-inline-end: 0;
}

.illustration2 {
  position: absolute;
  inset-block-start: 2rem;
  inset-inline-start: 2.5rem;
}
</style>
