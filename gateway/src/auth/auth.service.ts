import { Injectable, UnauthorizedException } from '@nestjs/common';
import { HttpService } from '../common/http.service';
import { LoginInput, RegisterInput, AuthResponse } from './auth.types';

@Injectable()
export class AuthService {
  constructor(private httpService: HttpService) {}

  async login(loginInput: LoginInput): Promise<AuthResponse> {
    try {
      const response = await this.httpService.getAuthService().post('/auth/login', loginInput);
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        throw new UnauthorizedException('Invalid credentials');
      }
      throw error;
    }
  }

  async register(registerInput: RegisterInput): Promise<AuthResponse> {
    try {
      const response = await this.httpService.getAuthService().post('/auth/register', registerInput);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async validateToken(token: string): Promise<any> {
    try {
      const response = await this.httpService.getAuthService().get('/auth/validate', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}