import { IsString, IsEmail, IsOptional, Length, IsUUID } from 'class-validator';

export class CreateEmployeeDto {
  @IsOptional()
  @IsUUID()
  userId?: string;

  @IsOptional()
  @IsUUID()
  supervisorId?: string;

  @IsString()
  @Length(1, 50)
  firstName: string;

  @IsString()
  @Length(1, 50)
  lastName: string;

  @IsOptional()
  @IsEmail()
  @Length(1, 100)
  email?: string;

  @IsOptional()
  @IsString()
  @Length(1, 20)
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  @Length(1, 15)
  taxNumber?: string;

  @IsOptional()
  @IsString()
  @Length(1, 15)
  abn?: string;

  @IsOptional()
  @IsString()
  @Length(1, 6)
  bsb?: string;

  @IsOptional()
  @IsString()
  @Length(1, 20)
  account?: string;
}

export class UpdateEmployeeDto {
  @IsOptional()
  @IsUUID()
  userId?: string;

  @IsOptional()
  @IsUUID()
  supervisorId?: string;

  @IsOptional()
  @IsString()
  @Length(1, 50)
  firstName?: string;

  @IsOptional()
  @IsString()
  @Length(1, 50)
  lastName?: string;

  @IsOptional()
  @IsEmail()
  @Length(1, 100)
  email?: string;

  @IsOptional()
  @IsString()
  @Length(1, 20)
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  @Length(1, 15)
  taxNumber?: string;

  @IsOptional()
  @IsString()
  @Length(1, 15)
  abn?: string;

  @IsOptional()
  @IsString()
  @Length(1, 6)
  bsb?: string;

  @IsOptional()
  @IsString()
  @Length(1, 20)
  account?: string;
}

export class EmployeeResponseDto {
  id: string;
  userId?: string;
  supervisorId?: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email?: string;
  phoneNumber?: string;
  address?: string;
  taxNumber?: string;
  abn?: string;
  bsb?: string;
  account?: string;
  supervisor?: EmployeeResponseDto;
  supervisees?: EmployeeResponseDto[];
  createdAt: Date;
  updatedAt: Date;
}