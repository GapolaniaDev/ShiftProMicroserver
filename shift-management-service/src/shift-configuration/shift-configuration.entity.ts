import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ShiftType } from '../shift-type/shift-type.entity';

@Entity('shift_configurations')
export class ShiftConfiguration {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'shift_type_id' })
  shiftTypeId: string;

  @Column({ name: 'employee_id' })
  employeeId: string;

  @Column({ name: 'shift_duration', type: 'int', nullable: true })
  shiftDuration: number;

  @ManyToOne(() => ShiftType, shiftType => shiftType.configurations)
  @JoinColumn({ name: 'shift_type_id' })
  shiftType: ShiftType;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}