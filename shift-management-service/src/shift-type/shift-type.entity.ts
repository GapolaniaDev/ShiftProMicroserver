import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Shift } from '../shift/shift.entity';
import { ShiftConfiguration } from '../shift-configuration/shift-configuration.entity';

@Entity('shift_types')
export class ShiftType {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50 })
  name: string;

  @Column({ name: 'weekly_hours', type: 'int' })
  weeklyHours: number;

  @Column('text', { nullable: true })
  description: string;

  @Column('jsonb', { nullable: true })
  schedule: Record<string, any>;

  @OneToMany(() => Shift, shift => shift.shiftType)
  shifts: Shift[];

  @OneToMany(() => ShiftConfiguration, config => config.shiftType)
  configurations: ShiftConfiguration[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}