<script setup lang="ts">
import { useAuth } from '@/@codifytech/hooks/useAuth'
import FormUsers from '@/pages/users/components/form-users.vue'
import { useUsersStore } from '@/pages/users/store/useUsersStore'

definePage({
  meta: {
    subject: 'profile',
    action: 'edit',
  },
})

const store = useUsersStore()
const auth = useAuth()

const {
  fetchItem,
} = store

onMounted(() => {
  fetchItem(auth.user().id)
})
</script>

<template>
  <FormUsers
    is-editing
    is-profile
    :is-header="false"
  />
</template>
