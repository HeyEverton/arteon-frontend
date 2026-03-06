import type { Message } from '@codifytech/components/SuccessDialog.vue'
import { defineStore } from 'pinia'

export const useSuccessDialogStore = defineStore('SuccessDialog', {
  state: () => ({
    show: false as boolean,
    title: '',
    message: '' as string | Message[],
    confirmText: 'OK',
  }),
  actions: {
    showSuccessDialog({
      title,
      message,
      confirmText,
    }: {
      title: string
      message: string | Message[]
      confirmText: string
    }) {
      this.title = title
      this.message = message
      this.confirmText = confirmText
      this.show = true
    },
    closeSuccessDialog() {
      this.show = false
      this.$reset()
    },
  },
})
