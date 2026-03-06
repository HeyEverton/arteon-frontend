<script setup lang="ts">
import { usePerfilStore } from '@/pages/acesso/perfis/store/usePerfilStore'
import UserList from '@/pages/users/index.vue'
import RoleCards from './components/RoleCards.vue'

const perfilStore = usePerfilStore()

const { listarPerfis } = perfilStore

definePage({
  meta: {
    unauthenticatedOnly: false,
    action: 'manage',
    subject: 'all',
  },
})

onBeforeMount(() => {
  Promise.all([
    listarPerfis(),
  ])
})
</script>

<template>
  <VRow>
    <VCol cols="12">
      <h4 class="text-h4 mb-6">
        Lista de perfis
      </h4>
      <p class="mb-0">
        Um perfil dá acesso a menus e recursos pré-definidos, de modo que, dependendo do perfil atribuído, um administrador pode acessar o que precisa.
      </p>
    </VCol>

    <!-- 👉 Roles Cards -->
    <VCol cols="12">
      <RoleCards />
    </VCol>

    <VCol cols="12">
      <h4 class="text-h4 mb-6">
        Total de usuários com suas funções
      </h4>
      <p class="mb-0">
        Encontre todas as contas de administrador da sua empresa e suas funções de associado.
      </p>
    </VCol>

    <VCol cols="12">
      <!-- 👉 User List  -->
      <UserList :is-header="false" />
    </VCol>
  </VRow>
</template>
