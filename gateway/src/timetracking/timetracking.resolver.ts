import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { TimetrackingService } from './timetracking.service';
import { TimeEntry, ClockInInput, ClockOutInput, CurrentStatus, TotalHours } from './timetracking.types';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { CurrentUser } from '../common/current-user.decorator';

@Resolver(() => TimeEntry)
export class TimetrackingResolver {
  constructor(private timetrackingService: TimetrackingService) {}

  @Mutation(() => TimeEntry)
  @UseGuards(JwtAuthGuard)
  async clockIn(@Args('input') input: ClockInInput): Promise<TimeEntry> {
    return this.timetrackingService.clockIn(input);
  }

  @Mutation(() => TimeEntry)
  @UseGuards(JwtAuthGuard)
  async clockOut(@Args('input') input: ClockOutInput): Promise<TimeEntry> {
    return this.timetrackingService.clockOut(input);
  }

  @Mutation(() => TimeEntry)
  @UseGuards(JwtAuthGuard)
  async myClockIn(
    @CurrentUser() user: any,
    @Args('description', { nullable: true }) description?: string,
  ): Promise<TimeEntry> {
    return this.timetrackingService.clockIn({ userId: user.sub, description });
  }

  @Mutation(() => TimeEntry)
  @UseGuards(JwtAuthGuard)
  async myClockOut(@CurrentUser() user: any): Promise<TimeEntry> {
    return this.timetrackingService.clockOut({ userId: user.sub });
  }

  @Query(() => [TimeEntry])
  @UseGuards(JwtAuthGuard)
  async getTimeEntries(
    @Args('userId') userId: string,
    @Args('startDate', { nullable: true }) startDate?: string,
    @Args('endDate', { nullable: true }) endDate?: string,
  ): Promise<TimeEntry[]> {
    return this.timetrackingService.getTimeEntries(userId, startDate, endDate);
  }

  @Query(() => [TimeEntry])
  @UseGuards(JwtAuthGuard)
  async getMyTimeEntries(
    @CurrentUser() user: any,
    @Args('startDate', { nullable: true }) startDate?: string,
    @Args('endDate', { nullable: true }) endDate?: string,
  ): Promise<TimeEntry[]> {
    return this.timetrackingService.getTimeEntries(user.sub, startDate, endDate);
  }

  @Query(() => CurrentStatus)
  @UseGuards(JwtAuthGuard)
  async getCurrentStatus(@Args('userId') userId: string): Promise<CurrentStatus> {
    return this.timetrackingService.getCurrentStatus(userId);
  }

  @Query(() => CurrentStatus)
  @UseGuards(JwtAuthGuard)
  async getMyCurrentStatus(@CurrentUser() user: any): Promise<CurrentStatus> {
    return this.timetrackingService.getCurrentStatus(user.sub);
  }

  @Query(() => TotalHours)
  @UseGuards(JwtAuthGuard)
  async getTotalHours(
    @Args('userId') userId: string,
    @Args('startDate', { nullable: true }) startDate?: string,
    @Args('endDate', { nullable: true }) endDate?: string,
  ): Promise<TotalHours> {
    return this.timetrackingService.getTotalHours(userId, startDate, endDate);
  }

  @Query(() => TotalHours)
  @UseGuards(JwtAuthGuard)
  async getMyTotalHours(
    @CurrentUser() user: any,
    @Args('startDate', { nullable: true }) startDate?: string,
    @Args('endDate', { nullable: true }) endDate?: string,
  ): Promise<TotalHours> {
    return this.timetrackingService.getTotalHours(user.sub, startDate, endDate);
  }
}