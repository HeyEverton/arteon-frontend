import { registerPlugins } from '@core/utils/plugins'

import InfiniteLoading from 'v3-infinite-loading'
import { createApp } from 'vue'
import vueDebounce from 'vue-debounce'
import { mask } from 'vue-the-mask'
import App from '@/App.vue'

// Styles
import '@core/scss/template/index.scss'
import '@styles/styles.scss'
import 'v3-infinite-loading/lib/style.css'

// Create vue app
const app = createApp(App)

// Use components
app.component('InfiniteLoading', InfiniteLoading)

// Use directives
app.directive('mask', mask)
app.directive('debounce', vueDebounce({ lock: true }))

// Register plugins
registerPlugins(app)

// Mount vue app
app.mount('#app')
