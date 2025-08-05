import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PayPeriod } from './pay-period.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PayPeriod])],
  exports: [TypeOrmModule],
})
export class PayPeriodModule {}