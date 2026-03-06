import { ApiService } from '@codifytech/services/ApiService'

class PerfisService extends ApiService {
  async listPermissions<T>() {
    return this.get<T>({}, 'list/permissions')
  }
}
export default new PerfisService('roles')
