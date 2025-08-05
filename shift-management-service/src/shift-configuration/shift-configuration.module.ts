import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShiftConfiguration } from './shift-configuration.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ShiftConfiguration])],
  exports: [TypeOrmModule],
})
export class ShiftConfigurationModule {}