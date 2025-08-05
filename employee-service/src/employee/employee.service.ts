import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from './employee.entity';
import { CreateEmployeeDto, UpdateEmployeeDto, EmployeeResponseDto } from './employee.dto';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
  ) {}

  async create(createEmployeeDto: CreateEmployeeDto): Promise<EmployeeResponseDto> {
    // Validate supervisor exists if provided
    if (createEmployeeDto.supervisorId) {
      const supervisor = await this.employeeRepository.findOne({
        where: { id: createEmployeeDto.supervisorId }
      });
      if (!supervisor) {
        throw new BadRequestException('Supervisor not found');
      }
    }

    const employee = this.employeeRepository.create(createEmployeeDto);
    const savedEmployee = await this.employeeRepository.save(employee);
    
    return this.mapToResponseDto(savedEmployee);
  }

  async findAll(): Promise<EmployeeResponseDto[]> {
    const employees = await this.employeeRepository.find({
      relations: ['supervisor', 'supervisees'],
    });
    
    return employees.map(employee => this.mapToResponseDto(employee));
  }

  async findById(id: string): Promise<EmployeeResponseDto> {
    const employee = await this.employeeRepository.findOne({
      where: { id },
      relations: ['supervisor', 'supervisees'],
    });

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    return this.mapToResponseDto(employee);
  }

  async findByUserId(userId: string): Promise<EmployeeResponseDto> {
    const employee = await this.employeeRepository.findOne({
      where: { userId },
      relations: ['supervisor', 'supervisees'],
    });

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    return this.mapToResponseDto(employee);
  }

  async findSupervisees(supervisorId: string): Promise<EmployeeResponseDto[]> {
    const employees = await this.employeeRepository.find({
      where: { supervisorId },
      relations: ['supervisor'],
    });

    return employees.map(employee => this.mapToResponseDto(employee));
  }

  async update(id: string, updateEmployeeDto: UpdateEmployeeDto): Promise<EmployeeResponseDto> {
    const employee = await this.employeeRepository.findOne({ where: { id } });
    
    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    // Validate supervisor exists if provided
    if (updateEmployeeDto.supervisorId) {
      const supervisor = await this.employeeRepository.findOne({
        where: { id: updateEmployeeDto.supervisorId }
      });
      if (!supervisor) {
        throw new BadRequestException('Supervisor not found');
      }
      
      // Prevent self-supervision
      if (updateEmployeeDto.supervisorId === id) {
        throw new BadRequestException('Employee cannot supervise themselves');
      }
    }

    await this.employeeRepository.update(id, updateEmployeeDto);
    
    const updatedEmployee = await this.employeeRepository.findOne({
      where: { id },
      relations: ['supervisor', 'supervisees'],
    });

    return this.mapToResponseDto(updatedEmployee);
  }

  async remove(id: string): Promise<void> {
    const employee = await this.employeeRepository.findOne({ where: { id } });
    
    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    // Update any supervisees to remove this supervisor
    await this.employeeRepository.update(
      { supervisorId: id },
      { supervisorId: null }
    );

    await this.employeeRepository.remove(employee);
  }

  async assignSupervisor(employeeId: string, supervisorId: string): Promise<EmployeeResponseDto> {
    const employee = await this.employeeRepository.findOne({ where: { id: employeeId } });
    const supervisor = await this.employeeRepository.findOne({ where: { id: supervisorId } });

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }
    
    if (!supervisor) {
      throw new NotFoundException('Supervisor not found');
    }

    if (employeeId === supervisorId) {
      throw new BadRequestException('Employee cannot supervise themselves');
    }

    employee.supervisorId = supervisorId;
    await this.employeeRepository.save(employee);

    const updatedEmployee = await this.employeeRepository.findOne({
      where: { id: employeeId },
      relations: ['supervisor', 'supervisees'],
    });

    return this.mapToResponseDto(updatedEmployee);
  }

  private mapToResponseDto(employee: Employee): EmployeeResponseDto {
    return {
      id: employee.id,
      userId: employee.userId,
      supervisorId: employee.supervisorId,
      firstName: employee.firstName,
      lastName: employee.lastName,
      fullName: employee.fullName,
      email: employee.email,
      phoneNumber: employee.phoneNumber,
      address: employee.address,
      taxNumber: employee.taxNumber,
      abn: employee.abn,
      bsb: employee.bsb,
      account: employee.account,
      supervisor: employee.supervisor ? this.mapToResponseDto(employee.supervisor) : undefined,
      supervisees: employee.supervisees ? employee.supervisees.map(s => this.mapToResponseDto(s)) : undefined,
      createdAt: employee.createdAt,
      updatedAt: employee.updatedAt,
    };
  }
}