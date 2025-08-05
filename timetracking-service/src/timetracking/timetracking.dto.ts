import { IsString, IsOptional, IsDateString } from 'class-validator';

export class ClockInDto {
  @IsString()
  userId: string;

  @IsOptional()
  @IsString()
  description?: string;
}

export class ClockOutDto {
  @IsString()
  userId: string;
}

export class GetTimeEntriesDto {
  @IsString()
  userId: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;
}