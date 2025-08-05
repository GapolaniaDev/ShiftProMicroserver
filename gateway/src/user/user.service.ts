import { Injectable } from '@nestjs/common';
import { HttpService } from '../common/http.service';
import { CreateUserProfileInput, UpdateUserProfileInput, UserProfile } from './user.types';

@Injectable()
export class UserService {
  constructor(private httpService: HttpService) {}

  async createProfile(input: CreateUserProfileInput): Promise<UserProfile> {
    const response = await this.httpService.getUserService().post('/users', input);
    return response.data;
  }

  async getProfile(userId: string): Promise<UserProfile> {
    console.log('=== GATEWAY SERVICE: getProfile called with userId:', userId);
    
    const response = await this.httpService.getUserService().get(`/users/${userId}`);
    console.log('=== GATEWAY SERVICE: Response from user-service:', response.data);
    
    return response.data;
  }

  async updateProfile(userId: string, input: UpdateUserProfileInput): Promise<UserProfile> {
    const response = await this.httpService.getUserService().put(`/users/${userId}`, input);
    return response.data;
  }

  async deleteProfile(userId: string): Promise<string> {
    await this.httpService.getUserService().delete(`/users/${userId}`);
    return 'Profile deleted successfully';
  }

  async getAllProfiles(): Promise<UserProfile[]> {
    const response = await this.httpService.getUserService().get('/users');
    return response.data;
  }
}