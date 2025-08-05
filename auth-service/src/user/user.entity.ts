import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum UserRole {
  ADMIN = 'admin',
  SUPERVISOR = 'supervisor',
  EMPLOYEE = 'employee',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.EMPLOYEE,
  })
  role: UserRole;

  @Column({ name: 'email_verified_at', type: 'timestamp', nullable: true })
  emailVerifiedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  hasRole(role: UserRole): boolean {
    return this.role === role;
  }

  isAdmin(): boolean {
    return this.hasRole(UserRole.ADMIN);
  }

  isSupervisor(): boolean {
    return this.hasRole(UserRole.SUPERVISOR);
  }

  isEmployee(): boolean {
    return this.hasRole(UserRole.EMPLOYEE);
  }
}