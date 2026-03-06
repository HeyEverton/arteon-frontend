import { defineStore } from 'pinia'

export const useValidationDialogStore = defineStore('ValidationDialog', {
  state: () => ({
    show: false,
    status: '' as number | string,
    messages: '' as string | any[],
  }),
  actions: {
    showValidationDialog(status: number | string, messages: string | any[]) {
      this.show = true
      this.status = status
      this.messages = messages
    },
    hideValidationDialog() {
      this.show = false
      this.$reset()
    },
  },
})
