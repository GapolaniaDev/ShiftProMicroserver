import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';

@Injectable()
export class HttpService {
  private authServiceClient: AxiosInstance;
  private userServiceClient: AxiosInstance;
  private timetrackingServiceClient: AxiosInstance;

  constructor(private configService: ConfigService) {
    this.authServiceClient = axios.create({
      baseURL: this.configService.get<string>('AUTH_SERVICE_URL'),
    });

    this.userServiceClient = axios.create({
      baseURL: this.configService.get<string>('USER_SERVICE_URL'),
    });

    this.timetrackingServiceClient = axios.create({
      baseURL: this.configService.get<string>('TIMETRACKING_SERVICE_URL'),
    });
  }

  getAuthService(): AxiosInstance {
    return this.authServiceClient;
  }

  getUserService(): AxiosInstance {
    return this.userServiceClient;
  }

  getTimetrackingService(): AxiosInstance {
    return this.timetrackingServiceClient;
  }
}