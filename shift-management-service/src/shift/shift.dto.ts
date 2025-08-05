import { IsString, IsUUID, IsDateString, IsNumber, IsOptional, IsEnum, Min, Max, IsIn } from 'class-validator';
import { ShiftState } from './shift.entity';

export class CreateShiftDto {
  @IsUUID()
  shiftTypeId: string;

  @IsUUID()
  employeeId: string;

  @IsDateString()
  dateStart: string;

  @IsDateString()
  dateEnd: string;

  @IsNumber()
  @Min(0)
  totalHours: number;

  @IsOptional()
  @IsString()
  weekdayCode?: string;

  @IsOptional()
  @IsString()
  comments?: string;

  @IsOptional()
  @IsUUID()
  replacementId?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsNumber()
  locationLat?: number;

  @IsOptional()
  @IsNumber()
  locationLng?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  radius?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  zoom?: number;
}

export class UpdateShiftDto {
  @IsOptional()
  @IsUUID()
  shiftTypeId?: string;

  @IsOptional()
  @IsUUID()
  employeeId?: string;

  @IsOptional()
  @IsDateString()
  dateStart?: string;

  @IsOptional()
  @IsDateString()
  dateEnd?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  totalHours?: number;

  @IsOptional()
  @IsString()
  weekdayCode?: string;

  @IsOptional()
  @IsString()
  comments?: string;

  @IsOptional()
  @IsUUID()
  replacementId?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsNumber()
  locationLat?: number;

  @IsOptional()
  @IsNumber()
  locationLng?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  radius?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  zoom?: number;
}

export class ClockDto {
  @IsNumber()
  lat: number;

  @IsNumber()
  lng: number;

  @IsIn(['clock_on', 'clock_off'])
  type: 'clock_on' | 'clock_off';

  @IsString()
  timezone: string;
}

export class ShiftResponseDto {
  id: string;
  shiftTypeId: string;
  employeeId: string;
  dateStart: Date;
  dateEnd: Date;
  dateStartTimezone?: string;
  dateEndTimezone?: string;
  totalHours: number;
  weekdayCode?: string;
  comments?: string;
  replacementId?: string;
  location?: string;
  locationLat?: number;
  locationLng?: number;
  radius?: number;
  zoom?: number;
  clockOnTime?: Date;
  clockOffTime?: Date;
  clockOnLat?: number;
  clockOnLng?: number;
  clockOffLat?: number;
  clockOffLng?: number;
  timezoneStart?: string;
  timezoneEnd?: string;
  state: ShiftState;
  shiftType?: any;
  localClockOnTime?: string;
  localClockOffTime?: string;
  localDateStart?: string;
  localDateEnd?: string;
  createdAt: Date;
  updatedAt: Date;
}