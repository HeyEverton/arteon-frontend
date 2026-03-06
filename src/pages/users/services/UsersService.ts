import { ApiService } from '@codifytech/services/ApiService'

class UsersService extends ApiService {
  async fetchRolesList<T>(): Promise<T> {
    return this.get<T>({}, 'list/roles')
  }
}
export default new UsersService('users')
