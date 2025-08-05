import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { ShiftService } from './shift.service';
import { ShiftController } from './shift.controller';
import { Shift } from './shift.entity';
import { TimezoneService } from '../utils/timezone.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Shift]),
    HttpModule,
  ],
  controllers: [ShiftController],
  providers: [ShiftService, TimezoneService],
  exports: [ShiftService],
})
export class ShiftModule {}