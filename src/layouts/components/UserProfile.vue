<script setup lang="ts">
import { useAuth } from '@codifytech/hooks/useAuth'
import { computed, ref } from 'vue'
import { useAuthStore } from '@/pages/auth/login/store/useAuthStore'

const { logout } = useAuthStore()
const auth = useAuth()

// Estado do menu
const isMenuOpen = ref(false)

// Dados do usuário computados
const user = computed(() => auth.user())

// Status online simulado (pode ser conectado a um sistema real)
const isOnline = ref(true)

// Função de logout com confirmação
function handleLogout() {
  // Aqui poderia ter um dialog de confirmação
  logout()
}

// Função para copiar ID do usuário
function copyUserId() {
  if (user.value?.id)
    navigator.clipboard.writeText(user.value.id.toString())

  // Aqui poderia mostrar um toast de sucesso
}

// Helper para obter o nome da role
const roleName = computed(() => {
  const role = user.value?.role
  if (typeof role === 'object' && role && 'name' in role)
    return role.name

  return role?.toString() || 'Usuário'
})
</script>

<template>
  <VBadge
    :model-value="isOnline"
    dot
    location="bottom right"
    offset-x="3"
    offset-y="3"
    bordered
    :color="isOnline ? 'success' : 'error'"
    class="user-profile-badge"
  >
    <VAvatar
      class="cursor-pointer user-avatar"
      color="primary"
      variant="tonal"
      size="40"
    >
      <VImg
        v-if="user?.foto"
        :src="user.foto"
        alt="Avatar do usuário"
      />
      <span v-else>
        {{ user?.name?.charAt(0)?.toUpperCase() || 'U' }}
      </span>

      <!-- Menu do usuário -->
      <VMenu
        v-model="isMenuOpen"
        activator="parent"
        width="280"
        location="bottom end"
        offset="14px"
        transition="scale-transition"
        class="user-menu"
      >
        <VCard class="user-menu-card">
          <!-- Header do usuário -->
          <VCardText class="user-header pa-4">
            <div class="d-flex align-center">
              <VBadge
                :model-value="isOnline"
                dot
                location="bottom right"
                offset-x="3"
                offset-y="3"
                :color="isOnline ? 'success' : 'error'"
                class="me-3"
              >
                <VAvatar
                  size="48"
                  color="primary"
                  variant="tonal"
                >
                  <VImg
                    v-if="user?.foto"
                    :src="user.foto"
                    alt="Avatar do usuário"
                  />
                  <span
                    v-else
                    class="text-h6"
                  >
                    {{ user?.name?.charAt(0)?.toUpperCase() || 'U' }}
                  </span>
                </VAvatar>
              </VBadge>

              <div class="flex-grow-1">
                <h6 class="mb-1 text-h6 font-weight-semibold text-high-emphasis">
                  {{ user?.name || 'Usuário' }}
                </h6>
                <p class="mb-0 text-body-2 text-medium-emphasis">
                  {{ roleName }}
                </p>
                <VChip
                  size="x-small"
                  :color="isOnline ? 'success' : 'error'"
                  variant="flat"
                  class="mt-1"
                >
                  {{ isOnline ? 'Online' : 'Offline' }}
                </VChip>
              </div>

              <!-- Botão de copiar ID -->
              <VBtn
                icon
                variant="text"
                size="small"
                @click="copyUserId"
              >
                <VIcon>tabler-copy</VIcon>
                <VTooltip activator="parent">
                  Copiar ID
                </VTooltip>
              </VBtn>
            </div>
          </VCardText>

          <VDivider />

          <!-- Menu de navegação -->
          <VList class="user-menu-list pa-2">
            <!-- Perfil -->
            <VListItem
              to="/profile"
              class="menu-item ma-1"
              prepend-icon="tabler-user"
              title="Meu Perfil"
              subtitle="Informações pessoais"
            />

            <!-- Configurações -->
            <!--
              <VListItem
              link
              class="menu-item ma-1"
              prepend-icon="tabler-settings"
              title="Configurações"
              subtitle="Preferências do sistema"
              />
            -->

            <!-- Notificações -->
            <!--
              <VListItem
              link
              class="menu-item ma-1"
              prepend-icon="tabler-bell"
              title="Notificações"
              subtitle="Central de alertas"
              >
              <template #append>
              <VChip
              v-if="userStats.notifications > 0"
              size="x-small"
              color="error"
              variant="elevated"
              >
              {{ userStats.notifications }}
              </VChip>
              </template>
              </VListItem>
            -->

            <!-- Ajuda -->
            <!--
              <VListItem
              link
              class="menu-item ma-1"
              prepend-icon="tabler-help"
              title="Ajuda & Suporte"
              subtitle="Central de ajuda"
              />
            -->
            <!-- <VDivider class="my-2" /> -->

            <!-- Trocar tema -->
            <!--
              <VListItem
              link
              class="menu-item ma-1"
              prepend-icon="tabler-palette"
              title="Aparência"
              subtitle="Tema claro/escuro"
              />
            -->
            <!-- Keyboard shortcuts -->
            <!--
              <VListItem
              link
              class="menu-item ma-1"
              prepend-icon="tabler-keyboard"
              title="Atalhos"
              subtitle="Atalhos do teclado"
              />
            -->
            <VDivider class="my-2" />

            <!-- Logout -->
            <VListItem
              class="menu-item logout-item ma-1"
              prepend-icon="tabler-logout"
              title="Sair do Sistema"
              subtitle="Encerrar sessão"
              @click="handleLogout"
            />
          </VList>
        </VCard>
      </VMenu>
    </VAvatar>
  </VBadge>
</template>

<style scoped>
/* Estilo básico para o avatar */
.user-avatar {
  transition: transform 0.2s ease;
}

.user-avatar:hover {
  transform: scale(1.05);
}

/* Estilo para o card do menu */
.user-menu-card {
  overflow: hidden;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 10%);
}

/* Header do usuário */
.user-header {
  background: linear-gradient(135deg, rgba(var(--v-theme-primary), 5%) 0%, rgba(var(--v-theme-secondary), 5%) 100%);
}

/* Estatísticas do usuário */
.user-stats {
  background: rgba(var(--v-theme-surface-variant), 30%);
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.stat-item:hover {
  background: rgba(var(--v-theme-primary), 8%);
  transform: translateY(-2px);
}

/* Itens do menu */
.menu-item {
  border-radius: 8px;
  transition: all 0.2s ease;
}

.menu-item:hover {
  background: rgba(var(--v-theme-primary), 4%);
  transform: translateX(4px);
}

.logout-item {
  border: 1px solid rgba(var(--v-theme-error), 20%);
  background: rgba(var(--v-theme-error), 2%);
}

.logout-item:hover {
  border-color: rgba(var(--v-theme-error), 40%);
  background: rgba(var(--v-theme-error), 8%) !important;
}

/* Responsividade */
@media (max-width: 600px) {
  .user-menu-card {
    inline-size: 95vw !important;
    max-inline-size: 320px;
  }

  .menu-item:hover {
    transform: none;
  }

  .user-avatar:hover {
    transform: none;
  }
}

/* Acessibilidade */
@media (prefers-reduced-motion: reduce) {
  .user-avatar,
  .menu-item,
  .stat-item {
    transition: none;
  }
}
</style>
