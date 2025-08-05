import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { CreateEmployeeDto, UpdateEmployeeDto, EmployeeResponseDto } from './employee.dto';

@Controller('employees')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createEmployeeDto: CreateEmployeeDto): Promise<EmployeeResponseDto> {
    return this.employeeService.create(createEmployeeDto);
  }

  @Get()
  async findAll(): Promise<EmployeeResponseDto[]> {
    return this.employeeService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<EmployeeResponseDto> {
    return this.employeeService.findById(id);
  }

  @Get('user/:userId')
  async findByUserId(@Param('userId') userId: string): Promise<EmployeeResponseDto> {
    return this.employeeService.findByUserId(userId);
  }

  @Get(':id/supervisees')
  async findSupervisees(@Param('id') id: string): Promise<EmployeeResponseDto[]> {
    return this.employeeService.findSupervisees(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateEmployeeDto: UpdateEmployeeDto): Promise<EmployeeResponseDto> {
    return this.employeeService.update(id, updateEmployeeDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    return this.employeeService.remove(id);
  }

  @Post(':employeeId/assign-supervisor/:supervisorId')
  async assignSupervisor(
    @Param('employeeId') employeeId: string,
    @Param('supervisorId') supervisorId: string,
  ): Promise<EmployeeResponseDto> {
    return this.employeeService.assignSupervisor(employeeId, supervisorId);
  }
}