# Plugin CRUD para Pinia

Este plugin adiciona funcionalidades CRUD automatizadas para stores do Pinia, facilitando a criação de stores que fazem requisições para APIs REST.

## Instalação e Configuração

O plugin já está configurado no arquivo `src/plugins/2.pinia.ts`:

```typescript
import { createPinia } from 'pinia'
import { createPiniaCrudPlugin } from './piniaCrudPlugin'

export const store = createPinia()

// Registra o plugin CRUD do Pinia
store.use(createPiniaCrudPlugin({
  defaultPerPage: 15,
  messages: {
    created: 'Item criado com sucesso!',
    updated: 'Item atualizado com sucesso!',
    deleted: 'Item removido com sucesso!',
    unexpectedError: 'Ocorreu um erro inesperado',
    validationErrors: 'Dados inválidos',
  },
}))
```

## Como Usar

### 1. Criando uma Store CRUD

Para que uma store use o plugin CRUD, ela deve ter uma das seguintes propriedades no estado:

- `_crud: true` - Marca que a store deve usar o plugin
- `apiService` - Uma instância do ApiService

```typescript
import { ApiService } from '@codifytech/services/ApiService'
import { defineStore } from 'pinia'

export const useUsersStore = defineStore('users', {
  state: () => ({
    // Marca que esta store deve usar o plugin CRUD
    _crud: true,

    // Injeta o service da API
    apiService: new ApiService('/api/users'),

    // Estados específicos da store (opcionais)
    selectedUser: null,
    filters: {},
  }),

  // Actions customizadas (opcionais)
  actions: {
    async fetchActiveUsers() {
      await this.fetchAll({ status: 'active' })
    },
  },

  // Getters customizados (opcionais)
  getters: {
    activeUsers: state => state.items?.filter(user => user.status === 'active') || [],
  },
})
```

### 2. Estados Adicionados Automaticamente

O plugin adiciona automaticamente os seguintes estados à sua store:

```typescript
{
  items: [],           // Array de itens
  item: null,          // Item individual
  loading: false,      // Estado de carregamento
  error: null,         // Mensagem de erro
  validationErrors: {}, // Erros de validação (422)

  // Estados para pesquisa e paginação
  searchParams: {},    // Parâmetros de busca
  searchTerm: '',      // Termo de pesquisa
  isSearching: false,  // Estado de pesquisa
  currentPage: 1,      // Página atual
  lastPage: 1,         // Última página
  total: 0,            // Total de itens
  perPage: 10,         // Itens por página
}
```

### 3. Actions Disponíveis

O plugin adiciona automaticamente as seguintes actions:

```typescript
// Buscar todos os itens
await userStore.fetchAll()
await userStore.fetchAll({ status: 'active', page: 1 })

// Buscar um item específico
await userStore.fetchItem('123')

// Criar um novo item
const newUser = await userStore.create({
  name: 'João',
  email: 'joao@example.com',
})

// Atualizar um item
await userStore.update('123', { name: 'João Silva' })

// Deletar um item
await userStore.delete('123')

// Carregamento infinito (para v3-infinite-loading)
// No template: <InfiniteLoading @infinite="userStore.loadMore" />

// Buscar com termo de pesquisa
await userStore.search('joão')

// Configurar parâmetros de busca personalizados
userStore.setSearchParams({ status: 'active', role: 'admin' })

// Resetar busca
userStore.resetSearch()

// Limpar erros
userStore.clearErrors()

// Resetar toda a store
userStore.reset()

// Resetar formulário (se existir uma propriedade 'form')
userStore.resetForm()
```

### 4. Getters Disponíveis

O plugin adiciona automaticamente os seguintes getters:

```typescript
userStore.hasError // Boolean - se há erro
userStore.hasValidationErrors // Boolean - se há erros de validação
userStore.isLoading // Boolean - se está carregando
userStore.isEmpty // Boolean - se não há itens
userStore.hasItems // Boolean - se há itens
userStore.canLoadMore // Boolean - se pode carregar mais (paginação)
userStore.searchResultsCount // Number - quantidade de resultados da busca
```

### 5. Propriedade $crud

Todas as actions e getters também estão disponíveis através da propriedade `$crud`:

```typescript
// Usando diretamente
userStore.fetchAll()
userStore.isLoading

// Usando através de $crud
userStore.$crud.fetchAll()
userStore.$crud.isLoading
```

## Exemplo Completo em um Componente Vue

```vue
<script setup>
import { onMounted, ref } from 'vue'
import { useUsersStore } from '@/stores/useUsersStore'

const userStore = useUsersStore()
const searchTerm = ref('')

// Carrega usuários ao montar o componente
onMounted(() => {
  userStore.fetchAll()
})

// Função para buscar usuários
const handleSearch = () => {
  userStore.search(searchTerm.value)
}

// Função para editar usuário
const editUser = async userId => {
  await userStore.fetchItem(userId)

  // Lógica para abrir modal de edição
}

// Função para deletar usuário
const deleteUser = async userId => {
  if (confirm('Tem certeza que deseja excluir este usuário?')) {
    await userStore.delete(userId)
    await userStore.fetchAll() // Recarrega a lista
  }
}
</script>

<template>
  <div>
    <!-- Loading state -->
    <div v-if="userStore.isLoading">
      Carregando usuários...
    </div>

    <!-- Error state -->
    <div
      v-if="userStore.hasError"
      class="error"
    >
      {{ userStore.error }}
    </div>

    <!-- Empty state -->
    <div v-if="userStore.isEmpty && !userStore.isLoading">
      Nenhum usuário encontrado
    </div>

    <!-- Search -->
    <input
      v-model="searchTerm"
      placeholder="Buscar usuários..."
      @input="handleSearch"
    >

    <!-- Users list -->
    <div v-if="userStore.hasItems">
      <div
        v-for="user in userStore.items"
        :key="user.id"
      >
        {{ user.name }} - {{ user.email }}
        <button @click="editUser(user.id)">
          Editar
        </button>
        <button @click="deleteUser(user.id)">
          Excluir
        </button>
      </div>

      <!-- Infinite loading -->
      <InfiniteLoading
        v-if="userStore.canLoadMore"
        @infinite="userStore.loadMore"
      />
    </div>
  </div>
</template>
```

## Tratamento de Erros

O plugin trata automaticamente os erros:

- **Erro 422 (Validação)**: Mostra no ValidationDialog e armazena em `validationErrors`
- **Outros erros**: Mostra no Snackbar e armazena em `error`

## Personalização de Mensagens

Você pode personalizar as mensagens ao configurar o plugin:

```typescript
store.use(createPiniaCrudPlugin({
  messages: {
    created: 'Criado com sucesso!',
    updated: 'Atualizado com sucesso!',
    deleted: 'Removido com sucesso!',
    unexpectedError: 'Erro inesperado',
    validationErrors: 'Dados inválidos',
  },
}))
```

## Configuração Global de ApiService

Se você não quiser definir `apiService` em cada store, pode passar uma instância global nas opções:

```typescript
store.use(createPiniaCrudPlugin({
  apiService: new ApiService('/api'),
  defaultPerPage: 20,
}))
```

Então na store, você só precisa marcar com `_crud: true`:

```typescript
export const useUsersStore = defineStore('users', {
  state: () => ({
    _crud: true,

    // outros estados...
  }),
})
```
