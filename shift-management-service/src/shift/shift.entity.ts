import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, BeforeUpdate, BeforeInsert } from 'typeorm';
import { ShiftType } from '../shift-type/shift-type.entity';

export enum ShiftState {
  NOT_STARTED = 0,
  STARTED = 1,
  FINISHED = 2,
}

@Entity('shifts')
export class Shift {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'shift_type_id' })
  shiftTypeId: string;

  @Column({ name: 'employee_id' })
  employeeId: string;

  @Column({ name: 'date_start', type: 'timestamp' })
  dateStart: Date;

  @Column({ name: 'date_end', type: 'timestamp' })
  dateEnd: Date;

  @Column({ name: 'date_start_timezone', length: 100, nullable: true })
  dateStartTimezone: string;

  @Column({ name: 'date_end_timezone', length: 100, nullable: true })
  dateEndTimezone: string;

  @Column({ name: 'total_hours', type: 'decimal', precision: 5, scale: 2 })
  totalHours: number;

  @Column({ name: 'weekday_code', length: 3, nullable: true })
  weekdayCode: string;

  @Column('text', { nullable: true })
  comments: string;

  @Column({ name: 'replacement_id', nullable: true })
  replacementId: string;

  @Column({ nullable: true })
  location: string;

  @Column({ name: 'location_lat', type: 'decimal', precision: 10, scale: 7, nullable: true })
  locationLat: number;

  @Column({ name: 'location_lng', type: 'decimal', precision: 10, scale: 7, nullable: true })
  locationLng: number;

  @Column({ type: 'int', nullable: true })
  radius: number;

  @Column({ type: 'int', nullable: true })
  zoom: number;

  @Column({ name: 'clock_on_time', type: 'timestamp', nullable: true })
  clockOnTime: Date;

  @Column({ name: 'clock_off_time', type: 'timestamp', nullable: true })
  clockOffTime: Date;

  @Column({ name: 'clock_on_lat', type: 'decimal', precision: 10, scale: 7, nullable: true })
  clockOnLat: number;

  @Column({ name: 'clock_on_lng', type: 'decimal', precision: 10, scale: 7, nullable: true })
  clockOnLng: number;

  @Column({ name: 'clock_off_lat', type: 'decimal', precision: 10, scale: 7, nullable: true })
  clockOffLat: number;

  @Column({ name: 'clock_off_lng', type: 'decimal', precision: 10, scale: 7, nullable: true })
  clockOffLng: number;

  @Column({ name: 'timezone_start', length: 100, nullable: true })
  timezoneStart: string;

  @Column({ name: 'timezone_end', length: 100, nullable: true })
  timezoneEnd: string;

  @Column({ type: 'int', default: ShiftState.NOT_STARTED })
  state: ShiftState;

  @ManyToOne(() => ShiftType, shiftType => shiftType.shifts)
  @JoinColumn({ name: 'shift_type_id' })
  shiftType: ShiftType;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @BeforeInsert()
  @BeforeUpdate()
  updateState() {
    if (this.clockOffTime) {
      this.state = ShiftState.FINISHED;
    } else if (this.clockOnTime) {
      this.state = ShiftState.STARTED;
    } else {
      this.state = ShiftState.NOT_STARTED;
    }
  }

  // Calculate distance between two coordinates using Haversine formula
  calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const earthRadius = 6371000; // meters
    const lat1Rad = (lat1 * Math.PI) / 180;
    const lng1Rad = (lng1 * Math.PI) / 180;
    const lat2Rad = (lat2 * Math.PI) / 180;
    const lng2Rad = (lng2 * Math.PI) / 180;

    const latDiff = lat2Rad - lat1Rad;
    const lngDiff = lng2Rad - lng1Rad;

    const a = Math.sin(latDiff / 2) ** 2 +
              Math.cos(lat1Rad) * Math.cos(lat2Rad) *
              Math.sin(lngDiff / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return earthRadius * c;
  }

  // Check if coordinates are within allowed radius
  isWithinRadius(userLat: number, userLng: number): boolean {
    if (!this.locationLat || !this.locationLng || !this.radius) {
      return true; // If no location restrictions, allow
    }

    const distance = this.calculateDistance(
      userLat, 
      userLng, 
      this.locationLat, 
      this.locationLng
    );

    return distance <= this.radius;
  }
}