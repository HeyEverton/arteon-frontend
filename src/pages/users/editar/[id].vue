<script setup lang="ts">
import FormUsers from '@/pages/users/components/form-users.vue'
import { useUsersStore } from '@/pages/users/store/useUsersStore'

definePage({
  meta: {
    navActiveLink: 'users',
    subject: 'users',
    action: 'edit',
  },
})

const store = useUsersStore()
const router = useRouter()

const {
  fetchItem,
} = store

onMounted(() => {
  fetchItem(router.currentRoute.value.params.id)
})
</script>

<template>
  <FormUsers is-editing />
</template>
