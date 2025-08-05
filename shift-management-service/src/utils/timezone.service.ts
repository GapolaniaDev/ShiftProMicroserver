import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import * as moment from 'moment-timezone';

@Injectable()
export class TimezoneService {
  constructor(private httpService: HttpService) {}

  async getTimezoneFromCoordinates(latitude: number, longitude: number): Promise<string> {
    try {
      // First try local calculation using moment-timezone
      const timezone = this.getTimezoneFromCoordinatesLocal(latitude, longitude);
      if (timezone) {
        return timezone;
      }

      // Fallback to external API if available
      const apiKey = process.env.TIMEZONEDB_API_KEY;
      if (apiKey) {
        return this.getTimezoneFromAPI(latitude, longitude, apiKey);
      }

      // Final fallback to UTC
      return 'UTC';
    } catch (error) {
      console.error('Error getting timezone:', error);
      return 'UTC';
    }
  }

  private getTimezoneFromCoordinatesLocal(latitude: number, longitude: number): string | null {
    try {
      // Get all timezone names
      const timezones = moment.tz.names();
      
      let minDistance = Number.MAX_VALUE;
      let closestTimezone = null;

      for (const timezone of timezones) {
        const zone = moment.tz.zone(timezone);
        if (!zone) continue;

        // This is a simplified approach - in reality, timezone boundaries are complex
        // For production, consider using a proper geolocation to timezone library
        const distance = Math.abs(latitude - 0) + Math.abs(longitude - 0); // Placeholder calculation
        
        if (distance < minDistance) {
          minDistance = distance;
          closestTimezone = timezone;
        }
      }

      return closestTimezone;
    } catch (error) {
      return null;
    }
  }

  private async getTimezoneFromAPI(latitude: number, longitude: number, apiKey: string): Promise<string> {
    try {
      const url = `http://api.timezonedb.com/v2.1/get-time-zone?key=${apiKey}&format=json&by=position&lat=${latitude}&lng=${longitude}`;
      
      const response = await firstValueFrom(
        this.httpService.get(url)
      );

      if (response.data && response.data.status === 'OK' && response.data.zoneName) {
        return response.data.zoneName;
      }

      return 'UTC';
    } catch (error) {
      console.error('API timezone lookup failed:', error);
      return 'UTC';
    }
  }

  convertToTimezone(date: Date, timezone: string): Date {
    try {
      return moment(date).tz(timezone).toDate();
    } catch (error) {
      return date;
    }
  }

  formatInTimezone(date: Date, timezone: string, format = 'YYYY-MM-DD HH:mm:ss'): string {
    try {
      return moment(date).tz(timezone).format(format);
    } catch (error) {
      return moment(date).format(format);
    }
  }
}