import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TimeEntry } from './timeentry.entity';
import { TimetrackingService } from './timetracking.service';
import { TimetrackingController } from './timetracking.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TimeEntry])],
  controllers: [TimetrackingController],
  providers: [TimetrackingService],
})
export class TimetrackingModule {}