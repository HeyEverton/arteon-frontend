# Habilita 360 Frontend - AI Agent Instructions

This guide provides essential context for AI agents working on the Habilita 360 frontend codebase.

## 🏗 Project Architecture

- **Framework**: Vue 3 + Vite + TypeScript
- **UI Library**: Vuetify 3 (managed via `vite-plugin-vuetify`)
- **State Management**: Pinia (with custom CRUD plugin)
- **Routing**: File-based routing via `unplugin-vue-router` (`src/pages`)
- **Auto-Imports**: `unplugin-auto-import` and `unplugin-vue-components` are enabled. Avoid manual imports for Vue, Vue Router, Pinia, and core components.

### 📂 Directory Structure

- **`src/@core`**: The foundational framework/UI kit layer. Contains generic components, composables, and styles. **Avoid modifying unless refactoring the core framework.**
- **`src/@codifytech`**: The business logic layer.
  - `services/`: API interaction logic (extends `ApiService`).
  - `stores/`: Global state management.
  - `hooks/`: Business-logic composables (e.g., `useApi`, `useAuth`).
- **`src/pages`**: Application routes. Follows file-based routing.
  - Structure: `src/pages/[feature]/index.vue` (list), `src/pages/[feature]/[action].vue`.
  - Feature-specific stores can reside in `src/pages/[feature]/store/`.

## 🔄 State Management & API (CRUD Pattern)

We use a **Custom Pinia CRUD Plugin** to standardize API interactions.

### API Service
- Extend `ApiService` from `@codifytech/services/ApiService` for new services.
- It handles `FormData` conversion, method spoofing (`_method: PUT` for files), and error normalization.

```typescript
// Example: src/@codifytech/services/UsersService.ts
import { ApiService } from '@codifytech/services/ApiService'
class UsersService extends ApiService {
  constructor() { disconnect(super('users')) }
}
export default new UsersService('users')
```

### Pinia Stores (CRUD)
- Enable CRUD magic by setting `_crud: true` and injecting the `apiService`.
- **Do not** manually implement `fetchAll`, `create`, `update`, `delete`, `loading`, `error` unless you need custom behavior. The plugin provides them.

```typescript
// Example: src/pages/users/store/useUsersStore.ts
export const useUsersStore = defineStore('users', {
  state: () => ({
    _crud: true,            // ⚡ Enables CRUD plugin
    apiService: UsersService, // 🔌 Injects API service
    // ... custom state
  }),
})
```
- **Usage in Components**:
  - `store.fetchAll()`, `store.create(payload)`, `store.delete(id)` are auto-available.
  - State: `items`, `item`, `loading`, `error`, `pagination` are auto-populated.
  - Errors (422) are automatically routed to the `ValidationDialog` store.

## 🛠 Developer Workflows

- **Run Dev**: `pnpm dev`
- **Docker**: `docker-compose -f docker-compose.dev.yml up`
- **Lint**: `pnpm lint` (ESLint + Stylelint)
- **Typecheck**: `pnpm typecheck`

## 🧩 Key Conventions

- **Imports**: Rely on auto-imports.
  - ✅ `const count = ref(0)`
  - ❌ `import { ref } from 'vue'`
- **Component Naming**: PascalCase for component files and usage (`<LayoutTable />`).
- **Styling**: SCSS modules or scoped styles. Core styles are in `src/@core/scss`.
- **Tables**: Use `<LayoutTable />` from `@codifytech/components/LayoutTable.vue`. It integrates with the CRUD store state (`loading`, `items`, `pagination`).
