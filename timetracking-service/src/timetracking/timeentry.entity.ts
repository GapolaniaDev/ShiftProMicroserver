import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum TimeEntryStatus {
  CLOCKED_IN = 'clocked_in',
  CLOCKED_OUT = 'clocked_out',
}

@Entity('time_entries')
export class TimeEntry {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column({ type: 'timestamp' })
  clockIn: Date;

  @Column({ type: 'timestamp', nullable: true })
  clockOut: Date;

  @Column({
    type: 'enum',
    enum: TimeEntryStatus,
    default: TimeEntryStatus.CLOCKED_IN,
  })
  status: TimeEntryStatus;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  hoursWorked: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}