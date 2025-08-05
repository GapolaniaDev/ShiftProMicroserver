import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Shift, ShiftState } from './shift.entity';
import { CreateShiftDto, UpdateShiftDto, ClockDto, ShiftResponseDto } from './shift.dto';
import { TimezoneService } from '../utils/timezone.service';

@Injectable()
export class ShiftService {
  constructor(
    @InjectRepository(Shift)
    private shiftRepository: Repository<Shift>,
    private timezoneService: TimezoneService,
  ) {}

  async create(createShiftDto: CreateShiftDto): Promise<ShiftResponseDto> {
    const shift = this.shiftRepository.create({
      ...createShiftDto,
      dateStart: new Date(createShiftDto.dateStart),
      dateEnd: new Date(createShiftDto.dateEnd),
    });

    // Calculate timezone if coordinates are provided
    if (createShiftDto.locationLat && createShiftDto.locationLng) {
      const timezone = await this.timezoneService.getTimezoneFromCoordinates(
        createShiftDto.locationLat,
        createShiftDto.locationLng
      );
      shift.dateStartTimezone = timezone;
      shift.dateEndTimezone = timezone;
    }

    const savedShift = await this.shiftRepository.save(shift);
    return this.mapToResponseDto(savedShift);
  }

  async findAll(filters?: {
    employeeId?: string;
    dateFrom?: string;
    dateTo?: string;
    shiftTypeId?: string;
    page?: number;
    limit?: number;
  }): Promise<{ data: ShiftResponseDto[], total: number, page: number, limit: number }> {
    const queryBuilder = this.shiftRepository.createQueryBuilder('shift')
      .leftJoinAndSelect('shift.shiftType', 'shiftType');

    if (filters?.employeeId) {
      queryBuilder.andWhere('shift.employeeId = :employeeId', { employeeId: filters.employeeId });
    }

    if (filters?.shiftTypeId) {
      queryBuilder.andWhere('shift.shiftTypeId = :shiftTypeId', { shiftTypeId: filters.shiftTypeId });
    }

    if (filters?.dateFrom) {
      queryBuilder.andWhere('shift.dateStart >= :dateFrom', { dateFrom: new Date(filters.dateFrom) });
    }

    if (filters?.dateTo) {
      queryBuilder.andWhere('shift.dateEnd <= :dateTo', { dateTo: new Date(filters.dateTo) });
    }

    queryBuilder.orderBy('shift.dateStart', 'DESC');

    const page = filters?.page || 1;
    const limit = filters?.limit || 15;
    const skip = (page - 1) * limit;

    queryBuilder.skip(skip).take(limit);

    const [shifts, total] = await queryBuilder.getManyAndCount();
    
    return {
      data: shifts.map(shift => this.mapToResponseDto(shift)),
      total,
      page,
      limit,
    };
  }

  async findById(id: string): Promise<ShiftResponseDto> {
    const shift = await this.shiftRepository.findOne({
      where: { id },
      relations: ['shiftType'],
    });

    if (!shift) {
      throw new NotFoundException('Shift not found');
    }

    return this.mapToResponseDto(shift);
  }

  async findByEmployeeId(employeeId: string, filters?: {
    dateFrom?: string;
    dateTo?: string;
    page?: number;
    limit?: number;
  }): Promise<{ data: ShiftResponseDto[], total: number, page: number, limit: number }> {
    return this.findAll({ ...filters, employeeId });
  }

  async findTodayShift(employeeId: string): Promise<ShiftResponseDto> {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);

    const shift = await this.shiftRepository.findOne({
      where: {
        employeeId,
        dateStart: Between(startOfDay, endOfDay),
      },
      relations: ['shiftType'],
    });

    if (!shift) {
      throw new NotFoundException('No shift found for today');
    }

    return this.mapToResponseDto(shift);
  }

  async update(id: string, updateShiftDto: UpdateShiftDto): Promise<ShiftResponseDto> {
    const shift = await this.shiftRepository.findOne({ where: { id } });
    
    if (!shift) {
      throw new NotFoundException('Shift not found');
    }

    const updateData: any = { ...updateShiftDto };

    if (updateShiftDto.dateStart) {
      updateData.dateStart = new Date(updateShiftDto.dateStart);
    }

    if (updateShiftDto.dateEnd) {
      updateData.dateEnd = new Date(updateShiftDto.dateEnd);
    }

    // Recalculate timezone if coordinates changed
    if (updateShiftDto.locationLat && updateShiftDto.locationLng) {
      const timezone = await this.timezoneService.getTimezoneFromCoordinates(
        updateShiftDto.locationLat,
        updateShiftDto.locationLng
      );
      updateData.dateStartTimezone = timezone;
      updateData.dateEndTimezone = timezone;
    }

    await this.shiftRepository.update(id, updateData);
    
    const updatedShift = await this.shiftRepository.findOne({
      where: { id },
      relations: ['shiftType'],
    });

    return this.mapToResponseDto(updatedShift);
  }

  async updateClock(id: string, clockDto: ClockDto): Promise<ShiftResponseDto> {
    const shift = await this.shiftRepository.findOne({ where: { id } });
    
    if (!shift) {
      throw new NotFoundException('Shift not found');
    }

    // Check if within radius
    if (!shift.isWithinRadius(clockDto.lat, clockDto.lng)) {
      throw new BadRequestException('You are outside the allowed radius for this location');
    }

    const now = new Date();
    const updateData: any = {};

    if (clockDto.type === 'clock_on') {
      if (shift.clockOffTime) {
        throw new BadRequestException('Cannot clock on after clocking off');
      }

      updateData.clockOnTime = now;
      updateData.clockOnLat = clockDto.lat;
      updateData.clockOnLng = clockDto.lng;
      updateData.timezoneStart = clockDto.timezone;
      updateData.state = ShiftState.STARTED;
    } else {
      if (!shift.clockOnTime) {
        throw new BadRequestException('Cannot clock off before clocking on');
      }

      updateData.clockOffTime = now;
      updateData.clockOffLat = clockDto.lat;
      updateData.clockOffLng = clockDto.lng;
      updateData.timezoneEnd = clockDto.timezone;
      updateData.state = ShiftState.FINISHED;
    }

    await this.shiftRepository.update(id, updateData);
    
    const updatedShift = await this.shiftRepository.findOne({
      where: { id },
      relations: ['shiftType'],
    });

    return this.mapToResponseDto(updatedShift);
  }

  async remove(id: string): Promise<void> {
    const shift = await this.shiftRepository.findOne({ where: { id } });
    
    if (!shift) {
      throw new NotFoundException('Shift not found');
    }

    await this.shiftRepository.remove(shift);
  }

  private mapToResponseDto(shift: Shift): ShiftResponseDto {
    const response: ShiftResponseDto = {
      id: shift.id,
      shiftTypeId: shift.shiftTypeId,
      employeeId: shift.employeeId,
      dateStart: shift.dateStart,
      dateEnd: shift.dateEnd,
      dateStartTimezone: shift.dateStartTimezone,
      dateEndTimezone: shift.dateEndTimezone,
      totalHours: Number(shift.totalHours),
      weekdayCode: shift.weekdayCode,
      comments: shift.comments,
      replacementId: shift.replacementId,
      location: shift.location,
      locationLat: shift.locationLat ? Number(shift.locationLat) : undefined,
      locationLng: shift.locationLng ? Number(shift.locationLng) : undefined,
      radius: shift.radius,
      zoom: shift.zoom,
      clockOnTime: shift.clockOnTime,
      clockOffTime: shift.clockOffTime,
      clockOnLat: shift.clockOnLat ? Number(shift.clockOnLat) : undefined,
      clockOnLng: shift.clockOnLng ? Number(shift.clockOnLng) : undefined,
      clockOffLat: shift.clockOffLat ? Number(shift.clockOffLat) : undefined,
      clockOffLng: shift.clockOffLng ? Number(shift.clockOffLng) : undefined,
      timezoneStart: shift.timezoneStart,
      timezoneEnd: shift.timezoneEnd,
      state: shift.state,
      shiftType: shift.shiftType,
      createdAt: shift.createdAt,
      updatedAt: shift.updatedAt,
    };

    // Add local times if available
    if (shift.clockOnTime && shift.timezoneStart) {
      response.localClockOnTime = this.timezoneService.formatInTimezone(
        shift.clockOnTime,
        shift.timezoneStart
      );
    }

    if (shift.clockOffTime && shift.timezoneEnd) {
      response.localClockOffTime = this.timezoneService.formatInTimezone(
        shift.clockOffTime,
        shift.timezoneEnd
      );
    }

    if (shift.dateStart && shift.dateStartTimezone) {
      response.localDateStart = this.timezoneService.formatInTimezone(
        shift.dateStart,
        shift.dateStartTimezone
      );
    }

    if (shift.dateEnd && shift.dateEndTimezone) {
      response.localDateEnd = this.timezoneService.formatInTimezone(
        shift.dateEnd,
        shift.dateEndTimezone
      );
    }

    return response;
  }
}