<script setup lang="ts">
import FormUsers from '@/pages/users/components/form-users.vue'

definePage({
  meta: {
    navActiveLink: 'users',
    subject: 'users',
    action: 'create',
  },
})
</script>

<template>
  <FormUsers />
</template>
