import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';

@Entity('employees')
export class Employee {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', nullable: true })
  userId: string;

  @Column({ name: 'supervisor_id', nullable: true })
  supervisorId: string;

  @Column({ name: 'first_name', length: 50 })
  firstName: string;

  @Column({ name: 'last_name', length: 50 })
  lastName: string;

  @Column({ length: 100, nullable: true })
  email: string;

  @Column({ name: 'phone_number', length: 20, nullable: true })
  phoneNumber: string;

  @Column('text', { nullable: true })
  address: string;

  @Column({ name: 'tax_number', length: 15, nullable: true })
  taxNumber: string;

  @Column({ length: 15, nullable: true })
  abn: string;

  @Column({ length: 6, nullable: true })
  bsb: string;

  @Column({ length: 20, nullable: true })
  account: string;

  @ManyToOne(() => Employee, employee => employee.supervisees, { nullable: true })
  @JoinColumn({ name: 'supervisor_id' })
  supervisor: Employee;

  @OneToMany(() => Employee, employee => employee.supervisor)
  supervisees: Employee[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Virtual property for full name
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}