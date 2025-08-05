import { Module } from '@nestjs/common';
import { TimetrackingService } from './timetracking.service';
import { TimetrackingResolver } from './timetracking.resolver';

@Module({
  providers: [TimetrackingService, TimetrackingResolver],
})
export class TimetrackingModule {}