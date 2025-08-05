import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { TimeEntry, TimeEntryStatus } from './timeentry.entity';
import { ClockInDto, ClockOutDto, GetTimeEntriesDto } from './timetracking.dto';

@Injectable()
export class TimetrackingService {
  constructor(
    @InjectRepository(TimeEntry)
    private timeEntryRepository: Repository<TimeEntry>,
  ) {}

  async clockIn(clockInDto: ClockInDto): Promise<TimeEntry> {
    const activeEntry = await this.timeEntryRepository.findOne({
      where: {
        userId: clockInDto.userId,
        status: TimeEntryStatus.CLOCKED_IN,
      },
    });

    if (activeEntry) {
      throw new BadRequestException('User is already clocked in');
    }

    const timeEntry = this.timeEntryRepository.create({
      userId: clockInDto.userId,
      clockIn: new Date(),
      description: clockInDto.description,
      status: TimeEntryStatus.CLOCKED_IN,
    });

    return this.timeEntryRepository.save(timeEntry);
  }

  async clockOut(clockOutDto: ClockOutDto): Promise<TimeEntry> {
    const activeEntry = await this.timeEntryRepository.findOne({
      where: {
        userId: clockOutDto.userId,
        status: TimeEntryStatus.CLOCKED_IN,
      },
    });

    if (!activeEntry) {
      throw new BadRequestException('No active clock-in found for user');
    }

    const clockOutTime = new Date();
    const hoursWorked = (clockOutTime.getTime() - activeEntry.clockIn.getTime()) / (1000 * 60 * 60);

    activeEntry.clockOut = clockOutTime;
    activeEntry.status = TimeEntryStatus.CLOCKED_OUT;
    activeEntry.hoursWorked = Math.round(hoursWorked * 100) / 100;

    return this.timeEntryRepository.save(activeEntry);
  }

  async getTimeEntries(getTimeEntriesDto: GetTimeEntriesDto): Promise<TimeEntry[]> {
    const { userId, startDate, endDate } = getTimeEntriesDto;
    
    const whereClause: any = { userId };

    if (startDate && endDate) {
      whereClause.clockIn = Between(new Date(startDate), new Date(endDate));
    }

    return this.timeEntryRepository.find({
      where: whereClause,
      order: { clockIn: 'DESC' },
    });
  }

  async getCurrentStatus(userId: string): Promise<{ isActive: boolean; activeEntry?: TimeEntry }> {
    const activeEntry = await this.timeEntryRepository.findOne({
      where: {
        userId,
        status: TimeEntryStatus.CLOCKED_IN,
      },
    });

    return {
      isActive: !!activeEntry,
      activeEntry: activeEntry || undefined,
    };
  }

  async getTotalHours(userId: string, startDate?: string, endDate?: string): Promise<{ totalHours: number }> {
    const whereClause: any = { 
      userId,
      status: TimeEntryStatus.CLOCKED_OUT,
    };

    if (startDate && endDate) {
      whereClause.clockIn = Between(new Date(startDate), new Date(endDate));
    }

    const entries = await this.timeEntryRepository.find({
      where: whereClause,
    });

    const totalHours = entries.reduce((sum, entry) => sum + (entry.hoursWorked || 0), 0);

    return { totalHours: Math.round(totalHours * 100) / 100 };
  }
}