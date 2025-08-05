import { ObjectType, Field, InputType, registerEnumType } from '@nestjs/graphql';

export enum TimeEntryStatus {
  CLOCKED_IN = 'clocked_in',
  CLOCKED_OUT = 'clocked_out',
}

registerEnumType(TimeEntryStatus, {
  name: 'TimeEntryStatus',
});

@ObjectType()
export class TimeEntry {
  @Field()
  id: string;

  @Field()
  userId: string;

  @Field()
  clockIn: Date;

  @Field({ nullable: true })
  clockOut?: Date;

  @Field(() => TimeEntryStatus)
  status: TimeEntryStatus;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  hoursWorked?: number;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

@ObjectType()
export class CurrentStatus {
  @Field()
  isActive: boolean;

  @Field(() => TimeEntry, { nullable: true })
  activeEntry?: TimeEntry;
}

@ObjectType()
export class TotalHours {
  @Field()
  totalHours: number;
}

@InputType()
export class ClockInInput {
  @Field()
  userId: string;

  @Field({ nullable: true })
  description?: string;
}

@InputType()
export class ClockOutInput {
  @Field()
  userId: string;
}