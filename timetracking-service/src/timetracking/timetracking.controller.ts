import { Controller, Post, Get, Body, Param, Query } from '@nestjs/common';
import { TimetrackingService } from './timetracking.service';
import { ClockInDto, ClockOutDto, GetTimeEntriesDto } from './timetracking.dto';

@Controller('timetracking')
export class TimetrackingController {
  constructor(private readonly timetrackingService: TimetrackingService) {}

  @Post('clock-in')
  async clockIn(@Body() clockInDto: ClockInDto) {
    return this.timetrackingService.clockIn(clockInDto);
  }

  @Post('clock-out')
  async clockOut(@Body() clockOutDto: ClockOutDto) {
    return this.timetrackingService.clockOut(clockOutDto);
  }

  @Get('entries/:userId')
  async getTimeEntries(
    @Param('userId') userId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.timetrackingService.getTimeEntries({ userId, startDate, endDate });
  }

  @Get('status/:userId')
  async getCurrentStatus(@Param('userId') userId: string) {
    return this.timetrackingService.getCurrentStatus(userId);
  }

  @Get('total-hours/:userId')
  async getTotalHours(
    @Param('userId') userId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.timetrackingService.getTotalHours(userId, startDate, endDate);
  }
}