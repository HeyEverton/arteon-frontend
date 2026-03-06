import { defineStore } from 'pinia'

const block = ['top', 'bottom'] as const
const inline = ['start', 'end', 'left', 'right'] as const
type Tblock = typeof block[number]
type Tinline = typeof inline[number]
export type Anchor
  = | Tblock
    | Tinline
    | 'center'
    | 'center center'
    | `${Tblock} ${Tinline | 'center'}`
    | `${Tinline} ${Tblock | 'center'}`

export const useSnackbarStore = defineStore('SnackbarStore', {
  state: () => ({
    text: '',
    color: 'primary',
    location: 'bottom end' as Anchor,
    multiline: false,
    rounded: 'pill' as string | number | boolean,
    timeout: 2000,
    variant: 'flat' as 'text' | 'flat' | 'elevated' | 'tonal' | 'outlined' | 'plain',
    show: false,
  }),
  actions: {
    showSnackbar({
      text,
      color,
      location,
      multiline,
      rounded,
      timeout,
      variant,
    }: {
      text: string
      color?: string
      location?: Anchor
      multiline?: boolean
      rounded?: string | number | boolean
      timeout?: number
      variant?: 'text' | 'flat' | 'elevated' | 'tonal' | 'outlined' | 'plain'
    }) {
      this.text = text
      this.color = color ?? 'primary'
      this.location = location ?? 'bottom end'
      this.multiline = multiline ?? false
      this.rounded = rounded ?? 'pill'
      this.timeout = timeout ?? 2000
      this.variant = variant ?? 'flat'
      this.show = true
    },
    closeSnackbar() {
      this.show = false
      this.$reset()
    },
  },
})
