import { ApiService } from '@codifytech/services/ApiService'

class PermissoesService extends ApiService {
  async fetchActions<T>() {
    return this.get<T>({}, 'list/actions')
  }

  async deleteAll(name: string) {
    return this.delete(`destroy/all/${name}`)
  }
}
export default new PermissoesService('permission')
