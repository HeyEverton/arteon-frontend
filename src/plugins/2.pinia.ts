import type { App } from 'vue'
import { createPinia } from 'pinia'
import { createPiniaCrudPlugin } from './piniaCrudPlugin'

export const store = createPinia()

// Registra o plugin CRUD do Pinia
store.use(createPiniaCrudPlugin({
  defaultPerPage: 15,
}))

export default function (app: App) {
  app.use(store)
}
