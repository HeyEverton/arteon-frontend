import { defineStore } from 'pinia'

export const useConfirmDialogStore = defineStore('ConfirmDialog', {
  state: () => ({
    show: false,
    message: 'Tem certeza que deseja excluir este registro?' as string,
    confirmButtonText: 'Sim, excluir' as string,
    cancelButtonText: 'Não, cancelar' as string,
    loading: false,
    onConfirm: null as (() => Promise<void>) | null,
  }),
  actions: {
    showConfirmDialog(
      message: string,
      confirmButtonText: string,
      cancelButtonText: string,
      loading: boolean,
      onConfirm: () => Promise<void>,
    ) {
      this.show = true
      this.message = message
      this.confirmButtonText = confirmButtonText
      this.cancelButtonText = cancelButtonText
      this.loading = loading
      this.onConfirm = onConfirm
    },
    hideConfirmDialog() {
      this.show = false
      this.$reset()
    },
    async confirm() {
      this.loading = true

      if (this.onConfirm) {
        await this.onConfirm().then(() => {
          this.hideConfirmDialog()
        }).finally(() => {
          this.loading = false
        })
      }
    },
    cancel() {
      this.hideConfirmDialog()
    },
  },
})
