import { Injectable } from '@nestjs/common';
import { HttpService } from '../common/http.service';
import { ClockInInput, ClockOutInput, TimeEntry, CurrentStatus, TotalHours } from './timetracking.types';

@Injectable()
export class TimetrackingService {
  constructor(private httpService: HttpService) {}

  async clockIn(input: ClockInInput): Promise<TimeEntry> {
    const response = await this.httpService.getTimetrackingService().post('/timetracking/clock-in', input);
    return response.data;
  }

  async clockOut(input: ClockOutInput): Promise<TimeEntry> {
    const response = await this.httpService.getTimetrackingService().post('/timetracking/clock-out', input);
    return response.data;
  }

  async getTimeEntries(userId: string, startDate?: string, endDate?: string): Promise<TimeEntry[]> {
    const params: any = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;

    const response = await this.httpService.getTimetrackingService().get(`/timetracking/entries/${userId}`, { params });
    return response.data;
  }

  async getCurrentStatus(userId: string): Promise<CurrentStatus> {
    const response = await this.httpService.getTimetrackingService().get(`/timetracking/status/${userId}`);
    return response.data;
  }

  async getTotalHours(userId: string, startDate?: string, endDate?: string): Promise<TotalHours> {
    const params: any = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;

    const response = await this.httpService.getTimetrackingService().get(`/timetracking/total-hours/${userId}`, { params });
    return response.data;
  }
}