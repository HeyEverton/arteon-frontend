import { ApiService } from '@codifytech/services/ApiService'

class AuthService extends ApiService {
  public async login<T>(payload: any) {
    return await this.post<T>(payload, 'login')
  }

  public async logout() {
    return await this.post({}, 'logout')
  }

  public async forgotPassword(email: string) {
    return await this.post({
      email,
    }, 'forgot-password')
  }

  public async resetPassword(email: string, token: string, newPassword: string, confirmPassword: string) {
    return await this.post({
      email,
      password: newPassword,
      password_confirmation: confirmPassword,
      token,
    }, 'reset-password')
  }
}
export default new AuthService('auth')
